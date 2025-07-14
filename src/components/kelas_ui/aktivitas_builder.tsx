import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { IconButton, Message, useToaster } from "rsuite";
import {
    useAktivitasList,
    useAktivitasLoading,
    useAktivitasError,
    useGetAktivitas,
    useDeleteAktivitas,
    useClearAktivitasError
} from "@/store/aktivitas_store";
import { useSelectedKelas } from "@/store/kelas_store";
import { MyModal } from "@/components/global_ui/my_modal";

export function AktivitasBuilder() {
    const toaster = useToaster();

    // Get selected kelas from global state
    const selectedKelas = useSelectedKelas();

    // State untuk mencegah hydration mismatch
    const [isClient, setIsClient] = useState(false);

    // State untuk modal dan delete
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [aktivitasToDelete, setAktivitasToDelete] = useState<{ id: string, nama: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Get aktivitas store data and actions
    const aktivitasList = useAktivitasList();
    const loading = useAktivitasLoading();
    const error = useAktivitasError();
    const getAktivitas = useGetAktivitas();
    const deleteAktivitas = useDeleteAktivitas();
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
    }, [selectedKelas?.id, selectedKelas, getAktivitas, isClient]);

    // Clear error when component unmounts
    useEffect(() => {
        return () => {
            clearError();
        };
    }, [clearError]);

    const handleDeleteClick = (aktivitasId: string, aktivitasNama: string) => {
        setAktivitasToDelete({ id: aktivitasId, nama: aktivitasNama });
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!aktivitasToDelete) return;

        setIsDeleting(true);
        try {
            await deleteAktivitas(aktivitasToDelete.id);

            // Show success toast
            toaster.push(
                <Message showIcon type="success" closable>
                    <strong>Berhasil!</strong> Aktivitas &ldquo;{aktivitasToDelete.nama}&rdquo; berhasil dihapus.
                </Message>,
                { placement: 'topEnd' }
            );

            setIsDeleteModalOpen(false);
            setAktivitasToDelete(null);
        } catch (error) {
            // Show error toast
            toaster.push(
                <Message showIcon type="error" closable>
                    <strong>Error!</strong> {error instanceof Error ? error.message : 'Gagal menghapus aktivitas.'}
                </Message>,
                { placement: 'topEnd' }
            );
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
        setAktivitasToDelete(null);
    };

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
        <div className="flex flex-col sm:grid sm:grid-cols-2 overflow-y-scroll gap-4">
            {aktivitasList.map((aktivitas) => (
                <div key={aktivitas.id} className="flex flex-col w-full h-fit bg-white border-2 border-[#C8B560] rounded-xl overflow-clip">
                    <div className="flex flex-row justify-between items-start">
                        <div className="flex flex-col p-3">
                            <h1 className="text-xl font-semibold">{aktivitas.kelas_nama}</h1>
                            {/* Prevent hydration mismatch */}
                            {isClient && selectedKelas?.deskripsi && (
                                <p className="text-sm text-gray-600">{selectedKelas.deskripsi}</p>
                            )}
                        </div>
                        <IconButton
                            appearance="subtle"
                            className="z-0 m-2"
                            icon={<Trash2 color="red" />}
                            onClick={() => handleDeleteClick(aktivitas.id, aktivitas.nama)}
                            loading={loading}
                        />
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

            {/* Delete Confirmation Modal */}
            <MyModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="APAKAH ANDA YAKIN INGIN MENGHAPUS AKTIVITAS INI?"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                isLoading={isDeleting}
                size="sm"
                confirmText="IYA"
                cancelText="TIDAK"
                noteText="Note: Data aktivitas yang dihapus tidak bisa dikembalikan*"
            >
                {aktivitasToDelete && (
                    <p className="text-center text-gray-700">
                        Aktivitas: <strong>&ldquo;{aktivitasToDelete.nama}&rdquo;</strong>
                    </p>
                )}
            </MyModal>
        </div>
    );
}