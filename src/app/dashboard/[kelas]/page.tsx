'use client'

import { MyTabs } from "@/components/global_ui/my_tabs";
import { PlusButton } from "@/components/global_ui/plus_button";
import SearchInput from "@/components/global_ui/search_input";
import { AddAktivitasOverlay } from "@/components/kelas_ui/add_aktivitas_overlay";
import { AddSantriOverlay } from "@/components/kelas_ui/add_santri_overlay";
import { AktivitasBuilder } from "@/components/kelas_ui/aktivitas_builder";
import { SantriBuilder } from "@/components/kelas_ui/santri_builder";
import { useOverlayAktivitas, useOverlaySantri } from "@/store/overlay_status";
import React from "react";

export default function Page() {
    const { open: openAktivitas } = useOverlayAktivitas();
    const { open: openSantri } = useOverlaySantri();

    const [activeTab, setActiveTab] = React.useState("aktivitas");
    const [searchQuery, setSearchQuery] = React.useState("");

    const tabItems = [
        { label: "Aktivitas", value: "aktivitas" },
        { label: "Santri", value: "santri" }
    ];

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
    };

    const handleClearSearch = () => {
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
                    <div className="w-full pt-4 pb-2 flex justify-end px-5 bg-[#E8F5E9]">
                        <PlusButton
                            title='Aktivitas Baru'
                            onClick={openAktivitas}
                        />
                        <AddAktivitasOverlay />
                    </div>
                ) : (

                    <div className="w-full pt-4 pb-2 flex gap-2 justify-end px-2.5 bg-[#E8F5E9]">
                        <SearchInput

                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Cari santri..."
                        />
                        <PlusButton
                            title='Tambah Santri'

                            onClick={openSantri}
                        />
                        <AddSantriOverlay />
                    </div>
                )}


            </div>

            {/* Tab Content */}
            <div className="flex flex-col h-[75vh] gap-4 px-5 py-2">
                {activeTab === 'aktivitas' ? (
                    <AktivitasBuilder />
                ) : (
                    <SantriBuilder
                        searchQuery={searchQuery}
                        onClearSearch={handleClearSearch}
                    />
                )}
            </div>
        </div>
    )
}