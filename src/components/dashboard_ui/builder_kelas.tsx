'use client'

import { ClipboardList, Link } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IconButton } from "rsuite";

interface DummyKelasProps {
    image: string;
    namaKelas: string;
    namaTPQ: string;
    alamat: string;
    link: string;
}

const kelasDummy: DummyKelasProps[] = [
    {
        image: '/dummy_kelas.jpg',
        namaKelas: "Kelas Iqro'",
        namaTPQ: "Masjid AL-Huda",
        alamat: "Randugunting, Kalasan, Sleman",
        link: "ngajiqu/alhudaiqro"
    },
    {
        image: '/dummy_kelas.jpg',
        namaKelas: "Kelas Quran",
        namaTPQ: "Masjid AL-Huda",
        alamat: "Randugunting, Kalasan, Sleman",
        link: "ngajiqu/alhudaiqro"
    },
]

export function BuilderKelas() {
    const router = useRouter();

    const handleCardClick = (kelasData: DummyKelasProps) => {
        // Navigate ke halaman kelas
        const queryParams = new URLSearchParams({
            namaKelas: kelasData.namaKelas,
            namaTPQ: kelasData.namaTPQ,
            alamat: kelasData.alamat,
            image: kelasData.image
        });

        router.push(`/dashboard/${kelasData.namaKelas.replace(/[^a-zA-Z0-9]/g, '')}?${queryParams.toString()}`);
    };

    const handleCopyLink = (e: React.MouseEvent, link: string) => {
        e.stopPropagation(); // Prevent card click
        navigator.clipboard.writeText(link);
        alert('Link berhasil disalin!');
    };

    return (
        kelasDummy.map((kelasData, index) => (
            <div
                key={index}
                onClick={() => handleCardClick(kelasData)}
                className="flex flex-col rounded-xl gap-2 border-2 border-[#C8B560] bg-white overflow-clip"
            >
                <div className="w-full h-[120px] overflow-clip">
                    <Image
                        src={kelasData.image}
                        alt={kelasData.namaKelas}
                        width={1200}
                        height={1200}
                        className="object-cover"
                    />
                </div>
                <div className="flex flex-col gap-0.5 justify-center items-center">
                    <h2 className="text-xl font-semibold">{kelasData.namaKelas}</h2>
                    <p className="text-sm">{kelasData.namaTPQ}</p>
                    <p className="text-sm">{kelasData.alamat}</p>
                </div>
                <div className="flex flex-row justify-between items-center border-[#C8B560] border-t-2">
                    <IconButton appearance="subtle" icon={<ClipboardList />} />
                    <div className="flex flex-row items-center">
                        <p className="text-sm text-[#388E3C]">{kelasData.link}</p>
                        <IconButton
                            appearance="subtle"
                            onClick={(e) => handleCopyLink(e, kelasData.link)}
                            icon={<Link color="#4CAF50" />}
                        />
                    </div>
                </div>
            </div>
        ))

    );
}