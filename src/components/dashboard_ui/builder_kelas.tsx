import { ClipboardList, Link } from "lucide-react";
import Image from "next/image";
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
        namaKelas: "Kelas Iqro'",
        namaTPQ: "Masjid AL-Huda",
        alamat: "Randugunting, Kalasan, Sleman",
        link: "ngajiqu/alhudaiqro"
    },
]

export function BuilderKelas() {
    return (
        kelasDummy.map(({ image, namaKelas, namaTPQ, alamat, link }, index) => (
            <div key={index} className="flex flex-col rounded-xl gap-2 border-2 border-[#C8B560] bg-white overflow-clip">
                <div className="w-full h-[120px] overflow-clip">
                    <Image
                        src={image}
                        alt={namaKelas}
                        width={1200}
                        height={1200}
                        className="object-cover"
                    />
                </div>
                <div className="flex flex-col gap-0.5 justify-center items-center">
                    <h2 className="text-xl font-semibold">{namaKelas}</h2>
                    <p className="text-sm">{namaTPQ}</p>
                    <p className="text-sm">{alamat}</p>
                </div>
                <div className="flex flex-row justify-between items-center border-[#C8B560] border-t-2">
                    <IconButton appearance="subtle" icon={<ClipboardList />} />
                    <div className="flex flex-row items-center">
                        <p className="text-sm text-[#388E3C]">{link}</p>
                        <IconButton appearance="subtle" icon={<Link color="#4CAF50" />} />
                    </div>
                </div>
            </div>
        ))

    );
}