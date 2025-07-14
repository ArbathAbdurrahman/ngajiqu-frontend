'use client'

import { PlusButton } from "@/components/global_ui/plus_button";
import { TableKartu } from "@/components/kartu_santri/table_kartu";
import { AddKartuOverlay } from "@/components/kartu_santri/add_kartu";
import { useSelectedSantri } from "@/store/santri_store";
import { useEffect, useState } from "react";
import { MyCard } from "@/components/global_ui/my_card";
import { Loader } from "rsuite";

export default function Santri() {
    const [isClient, setIsClient] = useState(false);
    const [isAddKartuOpen, setIsAddKartuOpen] = useState(false);
    const selectedSantri = useSelectedSantri();

    // SSR safety
    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleOpenAddKartu = () => {
        setIsAddKartuOpen(true);
    };

    const handleCloseAddKartu = () => {
        setIsAddKartuOpen(false);
    };

    // Don't render until client-side for SSR safety
    if (!isClient) {
        return <div className="h-screen w-full flex p-10 justify-center items-start">
            <p className="mb-2">Loading...</p>
            {/* RSuite Loader */}
            <Loader size="md" />
        </div>;
    }

    return (
        <div className=" bg-[#E8F5E9]">
            <div className="w-full pt-4 pb-2 flex flex-row justify-between px-3 bg-[#E8F5E9] sticky top-[62px] z-30 ">
                <div className="flex flex-col">
                    <h3 className="text-xl font-bold">KARTU SANTRI</h3>
                    <h3 className="text-xl font-bold">
                        {selectedSantri ? selectedSantri.nama : 'Pilih Santri'}
                    </h3>
                </div>
                <PlusButton
                    onClick={handleOpenAddKartu}
                    title="Tambah Kartu"
                    className="h-8"
                />
            </div>

            <div className="flex flex-col h-screen gap-4 px-1 py-2">
                <MyCard padding="p-3" bgColor="bg-blue-50" >
                    <p className="text-xs text-gray-600">*Tahan (long press) pada baris kartu selama 1 detik untuk menghapus</p>
                </MyCard>
                <TableKartu />
            </div>

            {/* Add Kartu Overlay */}
            <AddKartuOverlay
                isOpen={isAddKartuOpen}
                onClose={handleCloseAddKartu}
            />
        </div>
    )
}