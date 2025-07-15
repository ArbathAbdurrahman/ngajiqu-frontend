'use client'

import { AddKelasOverlay } from "@/components/dashboard_ui/add_kelas_overlay";
import { EditKelasOverlay } from "@/components/dashboard_ui/edit_kelas_overlay";
import { BuilderKelas } from "@/components/dashboard_ui/builder_kelas";
import { PlusButton } from "@/components/global_ui/plus_button";
import { useOverlayKelas } from "@/store/overlay_status";
import { MyCard } from "@/components/global_ui/my_card";
import { useKelasList, useKelasLoading } from "@/store/kelas_store";

export default function Dashboard() {
    const { open } = useOverlayKelas();

    // Get kelas state for UI logic
    const kelasList = useKelasList();
    const loading = useKelasLoading();

    // Show loading state
    if (loading) {
        return (
            <div className="bg-[#E8F5E9] h-[91vh]">
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
                <div className="flex w-full justify-center items-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#C8B560]"></div>
                </div>
            </div>
        );
    }


    // Show empty state
    if (kelasList.length === 0) {
        return (
            <div className="bg-[#E8F5E9] h-[91vh]">
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
                <div className="flex flex-col text-center justify-center items-center min-h-[400px]">
                    <p className="text-gray-500 text-lg mb-4">Belum ada kelas tersedia</p>
                    <p className="text-gray-400 text-sm mb-4">Mulai dengan membuat kelas pertama Anda</p>
                    <PlusButton
                        title="Buat Kelas Pertama"
                        onClick={open}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#E8F5E9] h-[91vh]">
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
            <div className="flex flex-col w-full sm:grid sm:grid-cols-2  overflow-y-scroll h-[80vh] gap-4 px-5 py-2">
                <BuilderKelas />
            </div>
        </div>
    )
}