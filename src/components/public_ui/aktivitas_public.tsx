import { useEffect, useState } from "react";
import {
    useAktivitasList,
    useAktivitasLoading,
    useAktivitasError,
    useGetAktivitas,
    useClearAktivitasError
} from "@/store/aktivitas_store";
import { useSelectedKelas } from "@/store/kelas_store";

export function AktivitasPublic() {

    // Get selected kelas from global state
    const selectedKelas = useSelectedKelas();

    // State untuk mencegah hydration mismatch
    const [isClient, setIsClient] = useState(false);

    // Get aktivitas store data and actions
    const aktivitasList = useAktivitasList();
    const loading = useAktivitasLoading();
    const error = useAktivitasError();
    const getAktivitas = useGetAktivitas();
    const clearError = useClearAktivitasError();

    // Set isClient setelah component mount (client-side only)
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Load aktivitas when component mounts or selectedKelas changes
    useEffect(() => {
        if (isClient) {
            if (selectedKelas?.id) {
                // Load aktivitas for specific kelas
                getAktivitas(selectedKelas.slug);
                console.log(selectedKelas);
            } else {
                // Load all aktivitas if no specific kelas
                getAktivitas();
            }
        }
    }, [selectedKelas?.id, selectedKelas?.slug, selectedKelas, getAktivitas, isClient]);

    // Clear error when component unmounts
    useEffect(() => {
        return () => {
            clearError();
        };
    }, [clearError]);

    // Show loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C8B560]"></div>
                <span className="ml-2">Memuat aktivitas...</span>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-red-500">
                <p className="text-center">{error}</p>
                <button
                    onClick={() => {
                        if (isClient && selectedKelas?.id) {
                            getAktivitas(selectedKelas.slug);
                        } else {
                            getAktivitas();
                        }
                    }}
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Coba Lagi
                </button>
            </div>
        );
    }

    // Show empty state
    if (aktivitasList.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                <p className="text-center">Belum ada aktivitas</p>
                <p className="text-sm text-center mt-1">
                    {/* Prevent hydration mismatch dengan conditional rendering */}
                    {isClient && selectedKelas
                        ? `Tambahkan aktivitas pertama untuk kelas ${selectedKelas.nama}`
                        : 'Tambahkan aktivitas pertama'
                    }
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {aktivitasList.map((aktivitas) => (
                <div key={aktivitas.id} className="flex flex-col w-full bg-white border-2 border-[#C8B560] rounded-xl overflow-clip">
                    <div className="flex flex-row justify-between items-start">
                        <div className="flex flex-col p-3">
                            <h1 className="text-xl font-semibold">{aktivitas.kelas_nama}</h1>
                            {/* Prevent hydration mismatch */}
                            {isClient && selectedKelas?.deskripsi && (
                                <p className="text-sm text-gray-600">{selectedKelas.deskripsi}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-row bg-[#C8B560] p-3 justify-between">
                        <div className="flex flex-col flex-1">
                            <h3 className="font-semibold text-white">Kegiatan</h3>
                            <p className="text-white">{aktivitas.tanggal}</p>
                        </div>
                        <div className="flex flex-col flex-1">
                            <p className="text-xs font-semibold text-white">{aktivitas.nama}</p>
                            {aktivitas.deskripsi && (
                                <p className="text-xs text-white/80 mt-1">{aktivitas.deskripsi}</p>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}