'use client'

import { useKelasStore, useKelasList, useKelasLoading, useKelasError, useSetSelectedKelas } from "@/store/kelas_store";
import { Edit, Link } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function BuilderKelas() {
    const router = useRouter();

    // GANTI dari useKelasState() ke individual selectors
    const kelasList = useKelasList();
    const loading = useKelasLoading();
    const error = useKelasError();
    const setSelectedKelas = useSetSelectedKelas();

    // ATAU gunakan direct store access untuk getKelas
    const getKelas = useKelasStore((state) => state.getKelas);

    useEffect(() => {
        getKelas();
    }, []); // Empty dependency array

    const handleCardClick = (kelas: any) => {
        // Set selected kelas di global state
        setSelectedKelas(kelas);
        // Navigate ke halaman kelas menggunakan slug sebagai path
        router.push(`/dashboard/${kelas.slug}`);
    };

    const handleCopyLink = (e: React.MouseEvent, link: string) => {
        e.stopPropagation(); // Prevent card click
        // Buat full URL untuk copy
        const fullLink = `${window.location.origin}/dashboard/${link}`;
        navigator.clipboard.writeText(fullLink);
        alert('Link berhasil disalin!');
    };

    // Show loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#C8B560]"></div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }

    // Show empty state
    if (kelasList.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <p className="text-gray-500">Belum ada kelas tersedia</p>
            </div>
        );
    }

    return (
        <>
            {kelasList.map((kelas) => (
                <div
                    key={kelas.id}
                    onClick={() => handleCardClick(kelas)}
                    className="flex flex-col rounded-xl gap-2 border-2 border-[#C8B560] bg-white overflow-clip cursor-pointer hover:shadow-lg transition-shadow"
                >
                    <div className="w-full h-[120px] overflow-clip">
                        <Image
                            src="/dummy_kelas.jpg" // Default image karena API tidak provide image
                            alt={kelas.nama}
                            width={1200}
                            height={1200}
                            className="object-cover w-full h-full"
                        />
                    </div>
                    <div className="flex flex-col gap-0.5 justify-center items-center px-4">
                        <h2 className="text-xl font-semibold text-center">{kelas.nama}</h2>
                        <p className="text-sm text-gray-600 text-center">{kelas.deskripsi || 'Tidak ada deskripsi'}</p>
                        <p className="text-xs text-gray-500">Santri: {kelas.santri_count || 0}</p>
                    </div>
                    <div className="flex flex-row justify-between items-center border-[#C8B560] bg-[#C8B560] px-3 py-1.5 border-t-2">
                        <button>
                            <Edit color="white" />
                        </button>
                        <div className="flex flex-row items-center gap-2">
                            <p className="text-sm text-white truncate max-w-[150px]">{kelas.slug}</p>
                            <button
                                onClick={(e) => handleCopyLink(e, kelas.slug)}
                            >
                                <Link color="white" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}