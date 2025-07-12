'use client'

import { PlusButton } from "@/components/global_ui/plus_button";
import { TableKartu } from "@/components/kartu_santri/table_kartu";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Santri() {
    const searchParams = useSearchParams();
    const [namaSantri, setNamaSantri] = useState<string>('');

    useEffect(() => {
        // Get nama from URL parameter
        const nama = searchParams.get('nama');
        if (nama) {
            setNamaSantri(nama);
        }
    }, [searchParams]);

    return (
        <div className=" bg-[#E8F5E9]">
            <div className="w-full pt-4 pb-2 flex flex-row justify-between px-3 bg-[#E8F5E9] sticky top-[62px] z-30 ">
                <div className="flex flex-col">
                    <h3 className="text-lx font-semibold">KARTU SANTRI</h3>
                    <h3 className="text-lx font-semibold">{namaSantri}</h3>
                </div>
                <PlusButton title="Ubah Kartu" className="h-8" />
            </div>

            <div className="flex flex-col h-screen gap-4 px-1 py-2">
                <TableKartu />
            </div>
        </div>
    )
}