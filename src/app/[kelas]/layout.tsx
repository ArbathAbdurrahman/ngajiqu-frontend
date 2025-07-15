'use client'

import { HeaderPublic } from "@/components/public_ui/header_public";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
    useGetKelasBySlug,
    useSelectedKelas,
    useKelasLoading,
    useKelasError
} from "@/store/kelas_store";
import { useGetAktivitas } from "@/store/aktivitas_store";
import { useGetSantri, useGetKartu, useSantriStore } from "@/store/santri_store";


export default function Layout({ children }: { children: React.ReactNode }) {
    const params = useParams();
    const [isClient, setIsClient] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);

    // Get kelas slug from URL params
    const kelasSlug = params.kelas as string;

    // Kelas store hooks
    const getKelasBySlug = useGetKelasBySlug();
    const selectedKelas = useSelectedKelas();
    const loading = useKelasLoading();
    const error = useKelasError();

    // Data fetching hooks
    const getAktivitas = useGetAktivitas();
    const getSantri = useGetSantri();
    const getKartu = useGetKartu();

    // Set client-side rendering flag
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Fetch kelas data when component mounts or slug changes
    useEffect(() => {
        const fetchKelasData = async () => {
            if (isClient && kelasSlug && (!selectedKelas || selectedKelas.slug !== kelasSlug)) {
                try {
                    console.log('🔍 [Layout] Fetching kelas data for slug:', kelasSlug);
                    await getKelasBySlug(kelasSlug);
                    console.log('✅ [Layout] Kelas data fetched successfully');
                } catch (error) {
                    console.error('❌ [Layout] Failed to fetch kelas data:', error);
                }
            }
        };

        fetchKelasData();
    }, [isClient, kelasSlug, getKelasBySlug, selectedKelas]);

    // Fetch additional data after kelas is loaded
    useEffect(() => {
        const fetchAdditionalData = async () => {
            if (selectedKelas && selectedKelas.slug === kelasSlug && !dataLoaded) {
                try {
                    console.log('🔍 [Layout] Fetching additional data for kelas:', selectedKelas.nama);

                    // Step 1: Load aktivitas and santri data in parallel
                    await Promise.all([
                        getAktivitas(selectedKelas.slug),
                        getSantri(selectedKelas.slug)
                    ]);
                    console.log('✅ [Layout] Step 1: Aktivitas and santri data fetched successfully');

                    // Step 2: Load kartu data for each santri
                    const currentSantriList = useSantriStore.getState().santriList;
                    console.log('📋 [Layout] Step 2: Loading kartu data for', currentSantriList.length, 'santri...');

                    if (currentSantriList.length > 0) {
                        // Fetch kartu for each santri with error handling
                        const kartuPromises = currentSantriList.map(async (santri, index) => {
                            try {
                                console.log(`📇 [Layout] [${index + 1}/${currentSantriList.length}] Loading kartu for: ${santri.nama} (ID: ${santri.id})`);
                                await getKartu(santri.id);
                                console.log(`✅ [Layout] Kartu loaded for: ${santri.nama}`);
                            } catch (error) {
                                console.error(`❌ [Layout] Failed to load kartu for ${santri.nama}:`, error);
                                // Continue with other santri even if one fails
                            }
                        });

                        // Wait for all kartu fetching to complete
                        await Promise.allSettled(kartuPromises);
                        console.log('✅ [Layout] Step 2 Complete: All kartu fetch attempts finished');
                    } else {
                        console.log('⚠️ [Layout] No santri found, skipping kartu fetch');
                    }

                    setDataLoaded(true);
                    console.log('🎉 [Layout] All data loading complete for kelas:', selectedKelas.nama);

                    // Debug: Show final data state
                    const finalState = useSantriStore.getState();
                    console.log('🗂️ [Layout] Final data summary:', {
                        santriCount: finalState.santriList.length,
                        kartuCount: finalState.kartuList.length,
                        kelas: selectedKelas.nama
                    });

                } catch (error) {
                    console.error('❌ [Layout] Failed to fetch additional data:', error);
                    setDataLoaded(true); // Set to true to prevent infinite loading
                }
            }
        };

        fetchAdditionalData();
    }, [selectedKelas, kelasSlug, getAktivitas, getSantri, getKartu, dataLoaded]);

    // Show loading state while fetching kelas data
    if (!isClient || (loading && !selectedKelas)) {
        return (
            <div className="bg-[#E8F5E9] h-[100vh]">
                <div className="sticky top-0 z-50">
                    <HeaderPublic />
                </div>
                <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C8B560]"></div>
                    <span className="ml-2">Memuat data kelas...</span>
                </div>
            </div>
        );
    }

    // Show loading state while fetching additional data
    if (selectedKelas && !dataLoaded) {
        return (
            <div className="bg-[#E8F5E9] h-[100vh]">
                <div className="sticky top-0 z-50">
                    <HeaderPublic />
                </div>
                <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C8B560]"></div>
                    <span className="ml-2">Memuat data aktivitas, santri, dan kartu...</span>
                </div>
            </div>
        );
    }

    // Show error state if kelas not found
    if (error && !selectedKelas) {
        return (
            <div className="bg-[#E8F5E9] h-[100vh]">
                <div className="sticky top-0 z-50">
                    <HeaderPublic />
                </div>
                <div className="flex flex-col items-center justify-center p-8 text-red-500">
                    <h2 className="text-xl font-semibold mb-2">Kelas Tidak Ditemukan</h2>
                    <p className="text-center">{error}</p>
                    <button
                        onClick={() => window.history.back()}
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Kembali
                    </button>
                </div>
            </div>
        );
    }


    return (
        <div className="bg-[#E8F5E9]">
            <div className="sticky top-0 z-50">
                <HeaderPublic />
            </div>

            {children}
        </div>
    );
}