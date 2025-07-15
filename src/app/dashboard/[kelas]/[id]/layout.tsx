'use client'

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelectedSantri, useSetSelectedSantri, useSantriList } from "@/store/santri_store";

export default function SantriLayout({ children }: { children: React.ReactNode }) {
    const params = useParams();
    const [isClient, setIsClient] = useState(false);

    const santriId = params.id as string;
    const selectedSantri = useSelectedSantri();
    const setSelectedSantri = useSetSelectedSantri();
    const santriList = useSantriList();

    // SSR safety
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Set selected santri based on URL param
    useEffect(() => {
        if (isClient && santriId && santriList.length > 0) {
            // Find santri in the list
            const santri = santriList.find(s => s.id === santriId);

            if (santri && (!selectedSantri || selectedSantri.id !== santriId)) {
                console.log('👤 Setting selected santri:', santri.nama);
                setSelectedSantri(santri);
            }
        }
    }, [isClient, santriId, santriList, selectedSantri, setSelectedSantri]);

    // Show loading state while data is being prepared
    if (!isClient || !selectedSantri || selectedSantri.id !== santriId) {
        return (
            <div className="bg-[#E8F5E9] h-[91vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C8B560] mx-auto mb-2"></div>
                    <p className="text-gray-600">Memuat data santri...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {children}
        </>
    );
}
