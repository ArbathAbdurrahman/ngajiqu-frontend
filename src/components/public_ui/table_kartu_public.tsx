'use client'

import { ArrowDownNarrowWide, ArrowUpNarrowWide } from "lucide-react";
import { useState, useEffect } from "react";
import {
    useKartuList,
    useSelectedSantri,
    useGetKartu,
    useSortKartuByDate,
    useSantriLoading,
    useSantriError
} from "@/store/santri_store";

const TABLE_HEAD = ["Tanggal", "Jilid/Surat", "Hal/Ayat", "Pengampu", "Catatan"];

export function TableKartuPublic() {
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [isClient, setIsClient] = useState(false);

    // Global state selectors
    const allKartuList = useKartuList();
    const selectedSantri = useSelectedSantri();
    const loading = useSantriLoading();
    const error = useSantriError();

    // Filter kartu for selected santri only
    const kartuList = allKartuList.filter(kartu =>
        selectedSantri?.id && kartu.idSantri === selectedSantri.id
    );

    // Actions
    const getKartu = useGetKartu();
    const sortKartuByDate = useSortKartuByDate();

    // SSR safety
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Fetch kartu data when selectedSantri changes
    useEffect(() => {
        if (isClient && selectedSantri?.id) {
            getKartu(selectedSantri.id);
        }
    }, [isClient, selectedSantri?.id, getKartu]);

    const handleDateSort = () => {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newSortOrder);
        sortKartuByDate(newSortOrder);
    };

    // Don't render until client-side for SSR safety
    if (!isClient) {
        return <div>Loading...</div>;
    }

    if (!selectedSantri) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-[#C8B560] p-4 text-center">
                <p className="text-gray-500">Pilih santri terlebih dahulu untuk melihat kartu ngaji</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-[#C8B560] p-4 text-center">
                <p>Loading kartu data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-[#C8B560] p-4 text-center">
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }


    return (
        <div className="bg-white rounded-lg shadow-sm border border-[#C8B560] overflow-hidden">
            <div className="w-full">
                <table className="w-full table-fixed">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            {TABLE_HEAD.map((head, index) => {
                                let width = "";
                                switch (head) {
                                    case "Tanggal":
                                        width = "w-[26%]";
                                        break;
                                    case "Jilid/Surat":
                                        width = "w-[20%]";
                                        break;
                                    case "Hal/Ayat":
                                        width = "w-[14%]";
                                        break;
                                    case "Pengampu":
                                        width = "w-[20%]";
                                        break;
                                    case "Catatan":
                                        width = "w-[30%]";
                                        break;
                                }

                                return (
                                    <th
                                        key={index}
                                        className={`px-2 py-1.5 text-center font-medium text-gray-500 uppercase tracking-wider text-[10px] ${width} ${head === "Tanggal" ? "cursor-pointer hover:bg-gray-100" : ""
                                            }`}
                                        onClick={head === "Tanggal" ? handleDateSort : undefined}
                                    >
                                        <div className="flex items-center justify-center gap-1">
                                            <span className="break-words">{head}</span>
                                            {head === "Tanggal" && (
                                                <div className="relative">
                                                    <div >
                                                        {sortOrder === 'asc' ? (
                                                            <ArrowUpNarrowWide size={"15"} />
                                                        ) : (
                                                            <ArrowDownNarrowWide size={"15"} />
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {kartuList.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-2 py-8 text-center text-gray-500">
                                    Belum ada catatan ngaji untuk santri {selectedSantri.nama}
                                </td>
                            </tr>
                        ) : (
                            kartuList.map((kartu, index) => (
                                <tr
                                    key={index}
                                    className="hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <td className="px-2 py-1.5 text-[10px] text-gray-900 w-[18%] align-top text-center">
                                        <div className="break-words">{kartu.tanggal.toLocaleDateString('id-ID')}</div>
                                    </td>
                                    <td className="px-2 py-1.5 text-[10px] text-gray-900 w-[20%] align-top text-center">
                                        <div className="break-words">{kartu.bab}</div>
                                    </td>
                                    <td className="px-2 py-1.5 text-[10px] text-gray-900 text-center w-[12%] align-top">
                                        <div className="break-words">{kartu.halaman}</div>
                                    </td>
                                    <td className="px-2 py-1.5 text-[10px] text-gray-900 w-[20%] align-top text-center">
                                        <div className="break-words">{kartu.pengampu}</div>
                                    </td>
                                    <td className="px-2 py-1.5 text-[10px] text-gray-900 w-[30%] align-top text-center">
                                        <div className="break-words">{kartu.catatan || 'Tidak ada catatan'}</div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer - Public version has no footer actions */}

        </div>
    );
}