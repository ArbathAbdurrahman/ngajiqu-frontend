'use client'

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
    useGetSantriById,
    useGetKartu,
    useSantriStore,
    useSelectedSantri
} from "@/store/santri_store";

export default function Layout({ children }: { children: React.ReactNode }) {
    const params = useParams();
    const [isClient, setIsClient] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);

    // Get santri ID from URL params
    const santriId = params.id as string;

    // Store hooks
    const getSantriById = useGetSantriById();
    const getKartu = useGetKartu();
    const selectedSantri = useSelectedSantri();
    const { loading: santriLoading, error: santriError } = useSantriStore();

    // Set client-side rendering flag
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Fetch santri data when component mounts or ID changes
    useEffect(() => {
        const fetchSantriData = async () => {
            if (isClient && santriId && (!selectedSantri || selectedSantri.id !== santriId)) {
                try {
                    console.log('🔍 [Santri Layout] Fetching santri data for ID:', santriId);
                    await getSantriById(santriId);
                    console.log('✅ [Santri Layout] Santri data fetched successfully');
                } catch (error) {
                    console.error('❌ [Santri Layout] Failed to fetch santri data:', error);
                }
            }
        };

        fetchSantriData();
    }, [isClient, santriId, getSantriById, selectedSantri]);

    // Fetch kartu data after santri is loaded
    useEffect(() => {
        const fetchKartuData = async () => {
            if (selectedSantri && selectedSantri.id === santriId && !dataLoaded) {
                try {
                    console.log('🔍 [Santri Layout] Fetching kartu data for santri:', selectedSantri.nama);
                    await getKartu(santriId);
                    setDataLoaded(true);
                    console.log('✅ [Santri Layout] Kartu data fetched successfully');
                } catch (error) {
                    console.error('❌ [Santri Layout] Failed to fetch kartu data:', error);
                }
            }
        };

        fetchKartuData();
    }, [selectedSantri, santriId, getKartu, dataLoaded]);

    // Show loading state while fetching santri data
    if (!isClient || (santriLoading && !selectedSantri)) {
        return (
            <div className="bg-[#E8F5E9] h-[100vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C8B560] mx-auto mb-2"></div>
                    <p className="text-gray-600">Memuat data santri...</p>
                </div>
            </div>
        );
    }

    // Show error state if santri not found
    if (santriError && !selectedSantri) {
        return (
            <div className="flex flex-col h-[100vh] items-center justify-center p-8 text-red-500">
                <h2 className="text-xl font-semibold mb-2">Santri Tidak Ditemukan</h2>
                <p className="text-center">{santriError}</p>
                <button
                    onClick={() => window.history.back()}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Kembali
                </button>
            </div>
        );
    }

    // Show loading state while fetching additional data
    if (!dataLoaded && selectedSantri) {
        return (
            <div className="flex items-center h-[91vh] justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C8B560]"></div>
                <span className="ml-2">Memuat data kartu santri...</span>
            </div>
        );
    }

    return children;
}
