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


export default function Layout({ children }: { children: React.ReactNode }) {
    const params = useParams();
    const [isClient, setIsClient] = useState(false);

    // Get kelas slug from URL params
    const kelasSlug = params.kelas as string;

    // Kelas store hooks
    const getKelasBySlug = useGetKelasBySlug();
    const selectedKelas = useSelectedKelas();
    const loading = useKelasLoading();
    const error = useKelasError();

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

    // Show loading state while fetching kelas data
    if (!isClient || (loading && !selectedKelas)) {
        return (
            <div className="bg-[#E8F5E9] min-h-screen">
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

    // Show error state if kelas not found
    if (error && !selectedKelas) {
        return (
            <div className="bg-[#E8F5E9] min-h-screen">
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