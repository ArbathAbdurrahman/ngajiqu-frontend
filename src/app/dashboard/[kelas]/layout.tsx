'use client'

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetKelasBySlug, useSelectedKelas } from "@/store/kelas_store";
import { useGetAktivitas } from "@/store/aktivitas_store";
import { useGetSantri, useGetKartu, useSantriStore } from "@/store/santri_store";

export default function KelasLayout({ children }: { children: React.ReactNode }) {
    const params = useParams();
    const [isClient, setIsClient] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);

    const kelasSlug = params.kelas as string;
    const selectedKelas = useSelectedKelas();
    const getKelasBySlug = useGetKelasBySlug();
    const getAktivitas = useGetAktivitas();
    const getSantri = useGetSantri();
    const getKartu = useGetKartu();

    // SSR safety
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Load kelas data first
    useEffect(() => {
        if (isClient && kelasSlug && (!selectedKelas || selectedKelas.slug !== kelasSlug)) {
            console.log('🏫 Loading kelas data for slug:', kelasSlug);
            getKelasBySlug(kelasSlug);
        }
    }, [isClient, kelasSlug, selectedKelas, getKelasBySlug]);

    // Load aktivitas & santri data setelah kelas data ready
    useEffect(() => {
        const loadData = async () => {
            if (selectedKelas && selectedKelas.slug === kelasSlug && !dataLoaded) {
                try {
                    console.log('📊 Loading aktivitas & santri data for kelas:', selectedKelas.nama);

                    // Step 1: Load aktivitas and santri data
                    await Promise.all([
                        getAktivitas(selectedKelas.slug),
                        getSantri(selectedKelas.slug)
                    ]);

                    console.log('✅ Step 1 Complete: Aktivitas & Santri data loaded');

                    // Step 2: Load kartu data for all santri
                    const currentSantriList = useSantriStore.getState().santriList;
                    console.log('📋 Step 2: Loading kartu data for', currentSantriList.length, 'santri...');

                    if (currentSantriList.length > 0) {
                        // Fetch kartu for each santri with error handling
                        const kartuPromises = currentSantriList.map(async (santri, index) => {
                            try {
                                console.log(`📇 [${index + 1}/${currentSantriList.length}] Loading kartu for: ${santri.nama} (ID: ${santri.id})`);
                                await getKartu(santri.id);
                                console.log(`✅ Kartu loaded for: ${santri.nama}`);
                            } catch (error) {
                                console.error(`❌ Failed to load kartu for ${santri.nama}:`, error);
                                // Continue with other santri even if one fails
                            }
                        });

                        // Wait for all kartu fetching to complete
                        await Promise.allSettled(kartuPromises);
                        console.log('✅ Step 2 Complete: All kartu fetch attempts finished');
                    } else {
                        console.log('⚠️ No santri found, skipping kartu fetch');
                    }

                    setDataLoaded(true);
                    console.log('🎉 All data loading complete for kelas:', selectedKelas.nama);

                    // Debug: Show final data state
                    const finalState = useSantriStore.getState();
                    console.log('🗂️ Final data summary:', {
                        santriCount: finalState.santriList.length,
                        kartuCount: finalState.kartuList.length,
                        kelas: selectedKelas.nama
                    });

                } catch (error) {
                    console.error('❌ Failed to load data:', error);
                    setDataLoaded(true); // Set to true to prevent infinite loading
                }
            }
        };

        loadData();
    }, [selectedKelas, kelasSlug, dataLoaded, getAktivitas, getSantri, getKartu]);

    // Reset dataLoaded when kelas changes
    useEffect(() => {
        if (selectedKelas?.slug !== kelasSlug) {
            setDataLoaded(false);
        }
    }, [kelasSlug, selectedKelas?.slug]);

    // Show loading state while data is being fetched
    if (!isClient || !selectedKelas || selectedKelas.slug !== kelasSlug) {
        return (
            <div className="bg-[#E8F5E9] h-[91vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C8B560] mx-auto mb-2"></div>
                    <p className="text-gray-600">Memuat data kelas...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#E8F5E9]">
            {children}
        </div>
    );
}
