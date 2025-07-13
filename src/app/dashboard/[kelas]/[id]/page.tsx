'use client'

import { PlusButton } from "@/components/global_ui/plus_button";
import { TableKartu } from "@/components/kartu_santri/table_kartu";
import { useSelectedSantri } from "@/store/santri_store";
import { useEffect, useState } from "react";

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
            <div className="w-full pt-4 pb-2 flex flex-row justify-between px-3 bg-[#E8F5E9] sticky top-[62px] z-30 ">
                <div className="flex flex-col">
                    <h3 className="text-lx font-semibold">KARTU SANTRI</h3>
                    <h3 className="text-lx font-semibold">
                        {selectedSantri ? selectedSantri.nama : 'Pilih Santri'}
                    </h3>
                </div>
                <PlusButton
                    // onClick={}
                    title="Ubah Kartu"
                    className="h-8" />
            </div>

            <div className="flex flex-col h-screen gap-4 px-1 py-2">
                <TableKartu />
            </div>
        </div>
    )
}