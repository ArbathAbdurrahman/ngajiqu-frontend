'use client'

import { Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { IconButton } from "rsuite";

interface DummySantriProps {
    nama: string;
    buku: "Iqro" | "Quran",
    bab: number;
    halaman: number;
    terakhirNgaji: string;
    catatan: string;
}


const santriDummy: DummySantriProps[] = [
    {
        nama: "Hasan Ali",
        buku: "Iqro",
        bab: 3,
        halaman: 20,
        terakhirNgaji: "12-07-2025",
        catatan: "Sudah lancar bacaan bisa lanjut ke Iqro' 4"
    },
    {
        nama: "Aisyah Putri",
        buku: "Quran",
        bab: 1,
        halaman: 5,
        terakhirNgaji: "10-07-2025",
        catatan: "Perlu latihan tajwid pada surat Al-Fatihah"
    },
    {
        nama: "Muhammad Rizki",
        buku: "Iqro",
        bab: 2,
        halaman: 15,
        terakhirNgaji: "11-07-2025",
        catatan: "Masih perlu pengulangan di bab 2"
    },
]

export function SantriBuilder() {
    const router = useRouter();
    const params = useParams();

    const handleCardClick = (nama: string) => {
        // Navigate ke halaman kelas
        const kelas = params.kelas;

        const namaSantri = nama.replace(/\s+/g, '-').toLowerCase();

        router.push(`/dashboard/${kelas}/${namaSantri}?nama=${encodeURIComponent(nama)}`);
    };

    const handleDeleteClick = (e: React.MouseEvent, nama: string) => {
        e.stopPropagation(); // Prevent card click
        console.log('Delete santri:', nama);
        // Add delete logic here
    };

    return (
        santriDummy.map((data, index) => (
            <div
                key={index}
                onClick={() => handleCardClick(data.nama)}
                className="flex flex-col w-full  bg-white border-2 border-[#C8B560] rounded-xl overflow-clip"
            >
                <div className="flex flex-row justify-between items-start">
                    <div className="flex flex-col p-3">
                        <h1 className="text-xl font-semibold">{data.nama}</h1>
                        <p className="text-sm">{data.buku} {data.bab}</p>
                        <p className="text-sm">Halaman {data.halaman}</p>
                    </div>
                    <IconButton
                        onClick={(e) => handleDeleteClick(e, data.nama)}
                        appearance="subtle"
                        icon={<Trash2 color="red" />}
                    />
                </div>
                <div className="flex flex-row bg-[#C8B560] p-3 justify-between">
                    <div className="flex flex-col flex-1">
                        <h3 className="font-semibold">Terakhir Ngaji</h3>
                        <p>{data.terakhirNgaji}</p>
                    </div>
                    <div className="flex flex-col flex-1">
                        <p className="text-xs font-semibold">{data.catatan}</p>
                    </div>
                </div>
            </div>
        ))

    )

}