'use client'

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    useSantriList,
    useSetSelectedSantri,
    useSantriError,
    useGetLatestKartu
} from "@/store/santri_store";
import { useSelectedKelas } from "@/store/kelas_store";

interface SantriPublicProps {
    searchQuery?: string;
    onClearSearch?: () => void;
}

export function SantriPublic({ searchQuery = '', onClearSearch }: SantriPublicProps) {
    const router = useRouter();
    const params = useParams();
    const [isClient, setIsClient] = useState(false);

    // Global state selectors
    const santriList = useSantriList();
    const setSelectedSantri = useSetSelectedSantri();
    const selectedKelas = useSelectedKelas();
    const error = useSantriError();

    // Actions
    const getLatestKartu = useGetLatestKartu();

    // SSR safety
    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleCardClick = (santri: { id: string; nama: string; kelas: number; kelas_nama: string }) => {
        // Set selected santri to global state
        setSelectedSantri(santri);

        const kelas = params.kelas;

        router.push(`/${kelas}/${santri.id}`);

        // Log for debugging
        console.log('🔄 [SantriPublic] Selected santri:', santri.nama, 'ID:', santri.id);
    };

    // Don't render until client-side for SSR safety
    if (!isClient) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!santriList || santriList.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                <p className="text-center">Belum ada santri</p>
                <p className="text-sm text-center mt-1">
                    {/* Prevent hydration mismatch dengan conditional rendering */}
                    {isClient && selectedKelas
                        ? `Tambahkan santri pertama untuk kelas ${selectedKelas.nama}`
                        : 'Tambahkan santri pertama'
                    }
                </p>
            </div>
        )
    }

    // Filter santri berdasarkan search query
    const filteredSantriList = santriList.filter(santri => {
        if (!searchQuery.trim()) return true; // Show all if no search query
        return santri.nama.toLowerCase().includes(searchQuery.toLowerCase());
    });

    console.log('🔍 [SantriBuilder] Rendering santri cards - loading complete, all data ready');
    console.log('🔍 [SantriBuilder] Search query:', searchQuery);
    console.log('🔍 [SantriBuilder] Filtered santri count:', filteredSantriList.length);

    return (
        <>
            {/* Search results info */}
            {searchQuery.trim() && (
                <div className="mb-4 p-3 sm:w-fit place-self-end bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-blue-700">
                            Menampilkan {filteredSantriList.length} dari {santriList.length} santri
                            untuk pencarian &ldquo;{searchQuery}&rdquo;
                        </p>
                        {onClearSearch && (
                            <button
                                onClick={onClearSearch}
                                className="text-sm text-blue-600 hover:text-blue-800 underline"
                            >
                                Hapus pencarian
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Show no results message if search returns nothing */}
            {searchQuery.trim() && filteredSantriList.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500 text-lg">Tidak ada santri yang ditemukan</p>
                    <p className="text-gray-400 text-sm mt-2">
                        Coba kata kunci lain atau
                        {onClearSearch && (
                            <button
                                onClick={onClearSearch}
                                className="text-blue-600 hover:text-blue-800 underline ml-1"
                            >
                                hapus pencarian
                            </button>
                        )}
                    </p>
                </div>
            ) : (
                <div className="flex flex-col sm:grid sm:grid-cols-2 overflow-y-scroll gap-4">
                    {filteredSantriList.map((santri, index) => {
                        // Get latest kartu for this santri - only called when kartu data is ready
                        console.log(`🔍 [SantriBuilder] Getting latest kartu for santri ${index + 1}/${santriList.length}: ${santri.nama} (ID: ${santri.id})`);
                        const latestKartu = getLatestKartu(santri.id);
                        console.log(`🔍 [SantriBuilder] Latest kartu for ${santri.nama}:`, latestKartu ? `${latestKartu.bab} - Hal ${latestKartu.halaman}` : 'No kartu found');

                        return (
                            <div
                                key={santri.id}
                                onClick={() => handleCardClick(santri)}
                                className="flex flex-col w-full bg-white border-2 border-[#C8B560] rounded-xl overflow-clip cursor-pointer hover:shadow-lg hover:border-[#B89E4F] transition-all duration-200"
                            >
                                <div className="flex flex-row justify-between items-start">
                                    <div className="flex flex-col p-3">
                                        <h1 className="text-xl font-semibold">{santri.nama}</h1>
                                        {latestKartu ? (
                                            <>
                                                <p className="text-sm">{latestKartu.bab}</p>
                                                <p className="text-sm">Halaman {latestKartu.halaman}</p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-sm text-gray-500">Belum ada bab</p>
                                                <p className="text-sm text-gray-500">Belum ada halaman</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-row bg-[#C8B560] p-3 justify-between">
                                    <div className="flex flex-col flex-1">
                                        <h3 className="font-semibold">Terakhir Ngaji</h3>
                                        {latestKartu ? (
                                            <p className="text-sm">{latestKartu.tanggal.toLocaleDateString('id-ID')}</p>
                                        ) : (
                                            <p className="text-sm text-gray-600">Belum ada catatan</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        {latestKartu ? (
                                            <p className="text-xs font-semibold">{latestKartu.catatan || 'Tidak ada catatan'}</p>
                                        ) : (
                                            <p className="text-xs font-semibold text-gray-600">Belum ada catatan ngaji</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );

}