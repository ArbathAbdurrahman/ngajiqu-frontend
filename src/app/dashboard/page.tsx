import { BuilderKelas } from "@/components/dashboard_ui/builder_kelas";
import { HeaderDashboard } from "@/components/dashboard_ui/header_dashboard";
import { PlusButton } from "@/components/global_ui/plus_button";
import { Plus } from "lucide-react";

export default function Dashboard() {
    return (
        <div className=" bg-[#E8F5E9]">
            <div className="w-full pt-4 pb-2 flex justify-end px-5 bg-[#E8F5E9] sticky top-[62px] z-30 ">
                <PlusButton title="Kelas Baru" />
            </div>

            <div className="flex flex-col h-screen gap-4 px-5 py-2">
                <BuilderKelas />
            </div>
        </div>
    )
}