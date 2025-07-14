'use client'

import { AddKelasOverlay } from "@/components/dashboard_ui/add_kelas_overlay";
import { EditKelasOverlay } from "@/components/dashboard_ui/edit_kelas_overlay";
import { BuilderKelas } from "@/components/dashboard_ui/builder_kelas";
import { PlusButton } from "@/components/global_ui/plus_button";
import { useOverlayKelas } from "@/store/overlay_status";
import { MyCard } from "@/components/global_ui/my_card";

export default function Dashboard() {
    const { open } = useOverlayKelas()
    return (
        <div className=" bg-[#E8F5E9]">

            <AddKelasOverlay />
            <EditKelasOverlay />

            <div className="w-full pt-4 gap-5 pb-2 flex justify-between items-center px-5 bg-[#E8F5E9] sticky top-[62px] z-30 ">
                <MyCard padding="p-3" bgColor="bg-blue-50">
                    <p className="text-xs ">*Tekan tahan kelas untuk menghapus kelas</p>
                </MyCard>
                <PlusButton
                    title="Kelas Baru"
                    onClick={open}
                />
            </div>
            <div className="flex flex-col h-screen overflow-y-scroll gap-4 px-5 py-2">
                <BuilderKelas />
            </div>
        </div>
    )
}