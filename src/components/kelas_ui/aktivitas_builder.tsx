import { Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IconButton } from "rsuite";

interface DummyKegiatanProps {
    namaKelas: string;
    tanggalKegiatan: string;
    kegiatan: string;
}

interface KelasData {
    namaKelas: string;
    namaTPQ: string;
    alamat: string;
    image: string;
}

const kegiatanDummy: DummyKegiatanProps[] = [
    {
        namaKelas: "Kelas Iqro'",
        tanggalKegiatan: "2024-06-01",
        kegiatan: "Belajar Al-Qur'an"
    },
    {
        namaKelas: "Kelas Quran",
        tanggalKegiatan: "2024-06-02",
        kegiatan: "Mengaji Bersama"
    }
]

export function AktivitasBuilder() {
    const searchParams = useSearchParams();
    const [kelasData, setKelasData] = useState<KelasData | null>(null);

    useEffect(() => {
        if (searchParams.get('namaKelas')) {
            setKelasData({
                namaKelas: searchParams.get('namaKelas') || '',
                namaTPQ: searchParams.get('namaTPQ') || '',
                alamat: searchParams.get('alamat') || '',
                image: searchParams.get('image') || '',
            });
        }
    }, [searchParams]);

    return (
        kegiatanDummy.map((kegiatanData, index) => (
            <div key={index} className="flex flex-col w-full  bg-white border-2 border-[#C8B560] rounded-xl overflow-clip">
                <div className="flex flex-row justify-between items-start">
                    <div className="flex flex-col p-3">
                        <h1 className="text-xl font-semibold">{kelasData?.namaKelas}</h1>
                        <p className="text-sm">{kelasData?.namaTPQ}</p>
                        <p className="text-sm">{kelasData?.alamat}</p>
                    </div>
                    <IconButton appearance="subtle" className="z-0" icon={<Trash2 color="red" />} />
                </div>
                <div className="flex flex-row bg-[#C8B560] p-3 justify-between">
                    <div className="flex flex-col flex-1">
                        <h3 className="font-semibold">Kegiatan Mendatang</h3>
                        <p>{kegiatanData.tanggalKegiatan}</p>
                    </div>
                    <div className="flex flex-col flex-1">
                        <p className="text-xs font-semibold">{kegiatanData.kegiatan}</p>
                    </div>
                </div>
            </div>
        ))

    )

}