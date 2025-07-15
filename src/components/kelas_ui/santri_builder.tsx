'use client'

import { Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { IconButton, Message, useToaster } from "rsuite";
import { useEffect, useState } from "react";
import {
    useSantriList,
    useSelectedSantri,
    useSetSelectedSantri,
    useDeleteSantri,
    useGetLatestKartu
} from "@/store/santri_store";
import { useSelectedKelas } from "@/store/kelas_store";
import { MyModal } from "@/components/global_ui/my_modal";

// Define local Santri interface
interface Santri {
    id: string;
    nama: string;
    kelas: number;
    kelas_nama: string;
}

interface SantriBuilderProps {
    searchQuery?: string;
    onClearSearch?: () => void;
}

export function SantriBuilder({ searchQuery = '', onClearSearch }: SantriBuilderProps) {
    const router = useRouter();
    const params = useParams();
    const toaster = useToaster();
    const [isClient, setIsClient] = useState(false);

    // State untuk modal dan delete
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [santriToDelete, setSantriToDelete] = useState<{ id: string, nama: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Global state selectors (data sudah di-load oleh layout)
    const santriList = useSantriList();
    const selectedSantri = useSelectedSantri();
    const setSelectedSantri = useSetSelectedSantri();
    const selectedKelas = useSelectedKelas();

    // Actions (hanya untuk operasi CRUD, bukan fetching)
    const deleteSantri = useDeleteSantri();
    const getLatestKartu = useGetLatestKartu();

    // SSR safety
    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleCardClick = (santri: Santri) => {
        // Set selected santri to global state
        setSelectedSantri(santri);

        // Navigate ke halaman santri detail
        const kelas = params.kelas;

        router.push(`/dashboard/${kelas}/${santri.id}`);
    };

    const handleDeleteClick = (santriId: string, santriNama: string) => {
        setSantriToDelete({ id: santriId, nama: santriNama });
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!santriToDelete) return;

        setIsDeleting(true);
        try {
            await deleteSantri(santriToDelete.id);
            console.log('Santri deleted successfully:', santriToDelete.nama);

            // Clear selected santri if the deleted santri was selected
            if (selectedSantri?.id === santriToDelete.id) {
                setSelectedSantri(null);
            }

            setIsDeleteModalOpen(false);
            setSantriToDelete(null);
        } catch (error) {
            console.error('Failed to delete santri:', error);
            toaster.push(
                <Message type="error" showIcon closable>
                    Gagal menghapus santri. Silakan coba lagi.
                </Message>,
                { placement: 'topCenter' }
            );
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
        setSantriToDelete(null);
    };

    // Don't render until client-side for SSR safety
    if (!isClient) {
        return <div>Loading...</div>;
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

    return (
        <>
            {/* Search results info */}
            {searchQuery.trim() && (
                <div className="mb-4 p-3 w-full sm:w-fit place-self-end bg-blue-50 border border-blue-200 rounded-lg">
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
                                className="flex flex-col w-full h-fit bg-white border-2 border-[#C8B560] rounded-xl overflow-clip cursor-pointer hover:shadow-lg transition-shadow"
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
                                    <IconButton
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent card click
                                            handleDeleteClick(santri.id, santri.nama);
                                        }}
                                        appearance="subtle"
                                        icon={<Trash2 color="red" />}
                                    />
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

            {/* Delete Confirmation Modal */}
            <MyModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="APAKAH ANDA YAKIN INGIN MENGHAPUS SANTRI INI?"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                isLoading={isDeleting}
                size="sm"
                confirmText="IYA"
                cancelText="TIDAK"
                noteText="Note: Data santri yang dihapus tidak bisa dikembalikan*"
            >
                {santriToDelete && (
                    <p className="text-center text-gray-700">
                        Santri: <strong>&ldquo;{santriToDelete.nama}&rdquo;</strong>
                    </p>
                )}
            </MyModal>
        </>
    );

}