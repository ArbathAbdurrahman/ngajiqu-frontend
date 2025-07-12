'use client'

import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";

const TABLE_HEAD = ["Tanggal", "Jilid/Surat", "Hal/Ayat", "Pengampu", "Catatan"];

const TABLE_ROWS = [
    {
        tanggal: "12/12/2025",
        jilid: "Iqro' 3",
        halaman: "15",
        pengampu: "Ustadz Ahmad",
        catatan: "Sudah lancar, bisa lanjut",
    },
    {
        tanggal: "11/12/2025",
        jilid: "Iqro' 3",
        halaman: "14",
        pengampu: "Ustadz Ahmad",
        catatan: "Perlu pengulangan huruf hijaiyah",
    },
    {
        tanggal: "10/12/2025",
        jilid: "Al-Fatihah",
        halaman: "1-7",
        pengampu: "Ustadzah Fatimah",
        catatan: "Bacaan tajwid perlu diperbaiki",
    },
    {
        tanggal: "09/12/2025",
        jilid: "Iqro' 2",
        halaman: "25",
        pengampu: "Ustadz Ahmad",
        catatan: "Lulus ke Iqro' 3",
    },
    {
        tanggal: "08/12/2025",
        jilid: "Iqro' 2",
        halaman: "24",
        pengampu: "Ustadz Ahmad",
        catatan: "Latihan membaca panjang pendek",
    },
];

export function TableKartu() {
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const handleDateSort = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        // Add sorting logic here
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'selesai':
                return 'bg-green-100 text-green-800';
            case 'review':
                return 'bg-orange-100 text-orange-800';
            case 'progress':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-[#C8B560] overflow-hidden">
            {/* Table */}
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
                                                <ChevronsUpDown className="w-2.5 h-2.5 text-gray-400 flex-shrink-0" />
                                            )}
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {TABLE_ROWS.map(({ tanggal, jilid, halaman, pengampu, catatan }, index) => (
                            <tr key={`${tanggal}-${index}`} className="hover:bg-gray-50">
                                <td className="px-2 py-1.5 text-[10px] text-gray-900 w-[18%] align-top text-center">
                                    <div className="break-words">{tanggal}</div>
                                </td>
                                <td className="px-2 py-1.5 text-[10px] text-gray-900 w-[20%] align-top text-center">
                                    <div className="break-words">{jilid}</div>
                                </td>
                                <td className="px-2 py-1.5 text-[10px] text-gray-900 text-center w-[12%] align-top">
                                    <div className="break-words">{halaman}</div>
                                </td>
                                <td className="px-2 py-1.5 text-[10px] text-gray-900 w-[20%] align-top text-center">
                                    <div className="break-words">{pengampu}</div>
                                </td>
                                <td className="px-2 py-1.5 text-[10px] text-gray-900 w-[30%] align-top text-center">
                                    <div className="break-words">{catatan}</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer */}

        </div>
    );
}