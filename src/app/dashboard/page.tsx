'use client'

import { AddKelasOverlay } from "@/components/dashboard_ui/add_kelas_overlay";
import { BuilderKelas } from "@/components/dashboard_ui/builder_kelas";
import { PlusButton } from "@/components/global_ui/plus_button";
import { useOverlayKelas } from "@/store/overlay_status";

export default function Dashboard() {
    const { open } = useOverlayKelas()
    return (
        <div className=" bg-[#E8F5E9]">

            <AddKelasOverlay />

            <div className="w-full pt-4 pb-2 flex justify-end px-5 bg-[#E8F5E9] sticky top-[62px] z-30 ">
                <PlusButton
                    title="Kelas Baru"
                    onClick={open}
                />
            </div>

            <div className="flex flex-col h-screen gap-4 px-5 py-2">
                <BuilderKelas />
            </div>
        </div>
    )
}