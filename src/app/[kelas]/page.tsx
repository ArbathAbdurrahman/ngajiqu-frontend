'use client'

import { MyTabs } from "@/components/global_ui/my_tabs";
import SearchInput from "@/components/global_ui/search_input";
import { AktivitasPublic } from "@/components/public_ui/aktivitas_public";
import { SantriPublic } from "@/components/public_ui/santri_public";
import React from "react";

export default function Page() {
    const [activeTab, setActiveTab] = React.useState("aktivitas");
    const [searchQuery, setSearchQuery] = React.useState("");

    const tabItems = [
        { label: "Aktivitas", value: "aktivitas" },
        { label: "Santri", value: "santri" }
    ]

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
    };

    const clearSearch = () => {
        setSearchQuery("");
    };

    return (
        <div className="bg-[#E8F5E9] h-[91vh]">
            <div className="w-full sticky top-[62px] z-30">
                <MyTabs
                    tabs={tabItems}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    activeColor="#C8B560"
                    maxWidth="max-w-full"
                />

                {activeTab === 'aktivitas' ? (
                    <>
                    </>
                ) : (
                    <div className="w-full pt-4 pb-2 flex gap-2 justify-end px-5 bg-[#E8F5E9]">
                        <SearchInput
                            size="md"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Cari santri..."
                        />

                    </div>
                )}


            </div>

            {/* Tab Content */}
            <div className="flex flex-col gap-4 h-[75vh] px-5 py-2">
                {activeTab === 'aktivitas' ? (
                    <AktivitasPublic />
                ) : (
                    <SantriPublic
                        searchQuery={searchQuery}
                        onClearSearch={clearSearch}
                    />
                )}
            </div>
        </div>
    )
}