import { BuilderKelas } from "@/components/dashboard_ui/builder_kelas";
import { HeaderDashboard } from "@/components/dashboard_ui/header_dashboard";
import { Plus } from "lucide-react";

export default function Dashboard() {
    return (
        <div className=" bg-[#E8F5E9]">
            <div className="sticky top-0">
                <HeaderDashboard />
                <div className="w-full pt-4 pb-2 flex justify-end px-5 sticky bg-[#E8F5E9]">
                    <button className="bg-[#4CAF50] flex flex-row gap-1 justify-center items-center pl-3 rounded-full">
                        <p className="text-white text-sm font-semibold">
                            Kelas Baru
                        </p>
                        <div className="bg-black rounded-full">
                            <Plus color="white" />
                        </div>
                    </button>
                </div>
            </div>

            <div className="flex flex-col h-screen gap-4 px-5 py-2">
                <BuilderKelas />
            </div>
        </div>
    )
}