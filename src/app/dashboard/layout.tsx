'use client'

import { HeaderDashboard } from "@/components/dashboard_ui/header_dashboard";


export default function Layout({ children }: { children: React.ReactNode }) {


    return (
        <div className=" bg-[#E8F5E9]">
            <div className="sticky top-0 z-50">
                <HeaderDashboard />
            </div>

            {children}
        </div>
    );
}