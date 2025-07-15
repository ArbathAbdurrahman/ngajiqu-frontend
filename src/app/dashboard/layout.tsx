'use client'

import { HeaderDashboard } from "@/components/dashboard_ui/header_dashboard";
import { useEffect, useState } from "react";
import { useKelasStore, useKelasLoading } from "@/store/kelas_store";

export default function Layout({ children }: { children: React.ReactNode }) {
    const [isClient, setIsClient] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);

    // Get kelas store actions and state
    const getKelas = useKelasStore((state) => state.getKelas);
    const loading = useKelasLoading();

    // Set client-side rendering flag
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Fetch kelas data when component mounts
    useEffect(() => {
        const fetchKelasData = async () => {
            if (isClient && !dataLoaded) {
                try {
                    console.log('🔍 [Dashboard Layout] Fetching kelas data...');
                    await getKelas();
                    setDataLoaded(true);
                    console.log('✅ [Dashboard Layout] Kelas data fetched successfully');
                } catch (error) {
                    console.error('❌ [Dashboard Layout] Failed to fetch kelas data:', error);
                    setDataLoaded(true); // Set to true to prevent infinite loading
                }
            }
        };

        fetchKelasData();
    }, [isClient, getKelas, dataLoaded]);

    // Show loading state while fetching kelas data  
    if (!isClient || (loading && !dataLoaded)) {
        return (
            <div className="bg-[#E8F5E9] h-[100vh]">
                <div className="sticky top-0 z-50">
                    <HeaderDashboard />
                </div>
                <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C8B560]"></div>
                    <span className="ml-2">Memuat data kelas...</span>
                </div>
            </div>
        );
    }

    return (
        <div className=" bg-[#E8F5E9]">
            <div className="sticky top-0 z-50">
                <HeaderDashboard />
            </div>

            {children}
        </div>
    );
}