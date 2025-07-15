'use client'

import { useSelectedSantri } from "@/store/santri_store";
import { useEffect, useState } from "react";
import { MyCard } from "@/components/global_ui/my_card";
import { TableKartuPublic } from "@/components/public_ui/table_kartu_public";

export default function Santri() {
    const [isClient, setIsClient] = useState(false);
    const selectedSantri = useSelectedSantri();

    // SSR safety
    useEffect(() => {
        setIsClient(true);
    }, []);



    // Don't render until client-side for SSR safety
    if (!isClient) {
        return <div>Loading...</div>;
    }

    return (
        <div className=" bg-[#E8F5E9]">
            <div className="w-full pt-4 pb-2 flex flex-row justify-between px-3 sm:px-10 bg-[#E8F5E9] sticky top-[62px] z-30 ">
                <div className="flex flex-col">
                    <h3 className="text-xl font-bold">KARTU SANTRI</h3>
                    <h3 className="text-xl font-bold">
                        {selectedSantri ? selectedSantri.nama : 'Pilih Santri'}
                    </h3>
                </div>
            </div>

            <div className="flex flex-col h-[80vh] gap-4 px-1 sm:px-10 py-2">
                <MyCard padding="p-3" bgColor="bg-blue-50" >
                    <p className="text-xs text-gray-600">*Tahan (long press) pada baris kartu selama 1 detik untuk menghapus</p>
                </MyCard>
                <TableKartuPublic />
            </div>
        </div>
    )
}