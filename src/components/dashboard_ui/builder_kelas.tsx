'use client'

import { useKelasStore, useKelasList, useKelasLoading, useKelasError, useSetSelectedKelas, useDeleteKelas } from "@/store/kelas_store";

// Define local Kelas interface
interface Kelas {
    id: string;
    nama: string;
    deskripsi?: string;
    slug: string;
    author?: number;
    santri_count?: number;
}
import { useOverlayEditKelas } from "@/store/overlay_status";
import { Edit, Link } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Message, useToaster } from "rsuite";
import { MyModal } from "@/components/global_ui/my_modal";

export function BuilderKelas() {
    const router = useRouter();
    const toaster = useToaster();

    // State untuk long press detection
    const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
    const [isLongPressing, setIsLongPressing] = useState(false);
    const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);

    // State untuk delete modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [kelasToDelete, setKelasToDelete] = useState<{ id: string, nama: string, slug: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // GANTI dari useKelasState() ke individual selectors
    const kelasList = useKelasList();
    const loading = useKelasLoading();
    const error = useKelasError();
    const setSelectedKelas = useSetSelectedKelas();

    // Actions
    const deleteKelas = useDeleteKelas();

    // Overlay controls
    const { open: openEditKelas } = useOverlayEditKelas();

    // ATAU gunakan direct store access untuk getKelas
    const getKelas = useKelasStore((state) => state.getKelas);

    useEffect(() => {
        getKelas();
    }, [getKelas]); // Empty dependency array

    const handleCardClick = (kelas: Kelas) => {
        // Set selected kelas di global state
        setSelectedKelas(kelas);
        // Navigate ke halaman kelas menggunakan slug sebagai path
        router.push(`/dashboard/${kelas.slug}`);
    };

    const handleCopyLink = (e: React.MouseEvent, link: string) => {
        e.stopPropagation(); // Prevent card click
        // Buat full URL untuk copy
        const fullLink = `${window.location.origin}/${link}`;

        navigator.clipboard.writeText(fullLink).then(() => {
            console.log('✅ Copy successful');
            // Show success toast
            toaster.push(
                <Message showIcon type="success" closable>
                    <strong>Berhasil!</strong> Link berhasil disalin ke clipboard.
                </Message>,
                { placement: 'topCenter', duration: 3000 }
            );
        }).catch(() => {
            // Show error toast if copy fails
            toaster.push(
                <Message showIcon type="error" closable>
                    <strong>Gagal!</strong> Tidak dapat menyalin link ke clipboard.
                </Message>,
                { placement: 'topCenter', duration: 3000 }
            );
        });
    };

    const handleEditClick = (e: React.MouseEvent, kelas: Kelas) => {
        e.stopPropagation(); // Prevent card click
        setSelectedKelas(kelas); // Set kelas yang akan diedit
        openEditKelas(); // Buka modal edit
    };

    // Long press handlers for delete functionality
    const handleDeleteClick = (kelasId: string, kelasNama: string, kelasSlug: string) => {
        setKelasToDelete({ id: kelasId, nama: kelasNama, slug: kelasSlug });
        setIsDeleteModalOpen(true);
    };

    const handleMouseDown = (e: React.MouseEvent, kelas: Kelas) => {
        setIsLongPressing(false);
        setStartPos({ x: e.clientX, y: e.clientY });
        const timer = setTimeout(() => {
            setIsLongPressing(true);
            handleDeleteClick(kelas.id, kelas.nama, kelas.slug);
        }, 800); // 800ms long press
        setLongPressTimer(timer);
    };

    const handleMouseUp = () => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            setLongPressTimer(null);
        }
        setIsLongPressing(false);
        setStartPos(null);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (startPos && longPressTimer) {
            const distance = Math.sqrt(
                Math.pow(e.clientX - startPos.x, 2) + Math.pow(e.clientY - startPos.y, 2)
            );
            // Cancel long press if moved more than 10px
            if (distance > 10) {
                clearTimeout(longPressTimer);
                setLongPressTimer(null);
                setIsLongPressing(false);
                setStartPos(null);
            }
        }
    };

    const handleMouseLeave = () => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            setLongPressTimer(null);
        }
        setIsLongPressing(false);
        setStartPos(null);
    };

    // Touch handlers for mobile
    const handleTouchStart = (e: React.TouchEvent, kelas: Kelas) => {
        setIsLongPressing(false);
        const touch = e.touches[0];
        setStartPos({ x: touch.clientX, y: touch.clientY });
        const timer = setTimeout(() => {
            setIsLongPressing(true);
            handleDeleteClick(kelas.id, kelas.nama, kelas.slug);
        }, 800);
        setLongPressTimer(timer);
    };

    const handleTouchEnd = () => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            setLongPressTimer(null);
        }
        setIsLongPressing(false);
        setStartPos(null);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (startPos && longPressTimer) {
            const touch = e.touches[0];
            const distance = Math.sqrt(
                Math.pow(touch.clientX - startPos.x, 2) + Math.pow(touch.clientY - startPos.y, 2)
            );
            if (distance > 10) {
                clearTimeout(longPressTimer);
                setLongPressTimer(null);
                setIsLongPressing(false);
                setStartPos(null);
            }
        }
    };

    const handleConfirmDelete = async () => {
        if (!kelasToDelete) return;

        setIsDeleting(true);
        try {
            await deleteKelas(kelasToDelete.slug);
            console.log('Kelas deleted successfully:', kelasToDelete.nama);

            setIsDeleteModalOpen(false);
            setKelasToDelete(null);

            toaster.push(
                <Message type="success" showIcon closable>
                    Kelas &ldquo;{kelasToDelete.nama}&rdquo; berhasil dihapus.
                </Message>,
                { placement: 'topCenter' }
            );
        } catch (error) {
            console.error('Failed to delete kelas:', error);
            toaster.push(
                <Message type="error" showIcon closable>
                    Gagal menghapus kelas. Silakan coba lagi.
                </Message>,
                { placement: 'topCenter' }
            );
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
        setKelasToDelete(null);
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
                    onMouseDown={(e) => handleMouseDown(e, kelas)}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onTouchStart={(e) => handleTouchStart(e, kelas)}
                    onTouchEnd={handleTouchEnd}
                    onTouchMove={handleTouchMove}
                    className={`flex flex-col rounded-xl gap-2 border-2 border-[#C8B560] bg-white overflow-clip cursor-pointer hover:shadow-lg transition-shadow ${isLongPressing ? 'ring-2 ring-red-400' : ''
                        }`}
                    style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
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
                        <button
                            onClick={(e) => handleEditClick(e, kelas)}
                            className="hover:bg-white/20 p-1 rounded transition-colors"
                            title="Edit Kelas"
                        >
                            <Edit color="white" />
                        </button>
                        <div className="flex flex-row items-center gap-2">
                            <p className="text-sm text-white truncate max-w-[150px]">{kelas.slug}</p>
                            <button
                                onClick={(e) => handleCopyLink(e, kelas.slug)}
                                className="hover:bg-white/20 p-1 rounded transition-colors"
                                title="Copy Link"
                            >
                                <Link color="white" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            {/* Delete Confirmation Modal */}
            <MyModal
                isOpen={isDeleteModalOpen}
                onClose={handleCancelDelete}
                title="Konfirmasi Hapus Kelas"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                isLoading={isDeleting}
                confirmText="Hapus"
                cancelText="Batal"
            >
                <div className="py-4">
                    <p className="text-gray-700">
                        Apakah Anda yakin ingin menghapus kelas{' '}
                        <span className="font-semibold">&ldquo;{kelasToDelete?.nama}&rdquo;</span>?
                    </p>
                    <p className="text-red-600 text-sm mt-2">
                        ⚠️ Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data santri dan kartu yang terkait.
                    </p>
                </div>
            </MyModal>
        </>
    );
}