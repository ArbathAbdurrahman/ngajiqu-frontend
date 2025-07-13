'use client'

import { ArrowDownNarrowWide, ArrowUpNarrowWide, ChevronsDown, ChevronsUp, ChevronsUpDown } from "lucide-react";
import { useState, useEffect } from "react";
import {
    useKartuList,
    useSelectedSantri,
    useGetKartu,
    useSortKartuByDate,
    useSantriLoading,
    useSantriError,
    useDeleteKartu
} from "@/store/santri_store";
import { MyModal } from "@/components/global_ui/my_modal";
import { Message, useToaster } from "rsuite";

const TABLE_HEAD = ["Tanggal", "Jilid/Surat", "Hal/Ayat", "Pengampu", "Catatan"];

export function TableKartu() {
    const toaster = useToaster();

    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [isClient, setIsClient] = useState(false);

    // Long press state
    const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
    const [isLongPressing, setIsLongPressing] = useState(false);
    const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

    // Delete modal state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [kartuToDelete, setKartuToDelete] = useState<{ id: string, tanggal: string, bab: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Global state selectors
    const allKartuList = useKartuList();
    const selectedSantri = useSelectedSantri();
    const loading = useSantriLoading();
    const error = useSantriError();

    // Filter kartu for selected santri only
    const kartuList = allKartuList.filter(kartu =>
        selectedSantri?.id && kartu.idSantri === selectedSantri.id
    );

    // Actions
    const getKartu = useGetKartu();
    const sortKartuByDate = useSortKartuByDate();
    const deleteKartu = useDeleteKartu();

    // SSR safety
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Fetch kartu data when selectedSantri changes
    useEffect(() => {
        if (isClient && selectedSantri?.id) {
            getKartu(selectedSantri.id);
        }
    }, [isClient, selectedSantri?.id, getKartu]);

    const handleDateSort = () => {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newSortOrder);
        sortKartuByDate(newSortOrder);
    };

    // Long press handlers
    const handleMouseDown = (kartu: any) => {
        setIsLongPressing(false);
        const timer = setTimeout(() => {
            setIsLongPressing(true);
            handleDeleteClick(kartu.id, kartu.tanggal.toLocaleDateString('id-ID'), kartu.bab);
        }, 800); // 800ms long press
        setLongPressTimer(timer);
    };

    const handleMouseUp = () => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            setLongPressTimer(null);
        }
        setIsLongPressing(false);
    };

    const handleMouseLeave = () => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            setLongPressTimer(null);
        }
        setIsLongPressing(false);
    };

    // Touch handlers for mobile
    const handleTouchStart = (kartu: any, e: React.TouchEvent) => {
        const touch = e.touches[0];
        setTouchStart({ x: touch.clientX, y: touch.clientY });
        setIsLongPressing(false);

        const timer = setTimeout(() => {
            setIsLongPressing(true);
            handleDeleteClick(kartu.id, kartu.tanggal.toLocaleDateString('id-ID'), kartu.bab);
        }, 800); // 800ms long press
        setLongPressTimer(timer);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!touchStart || !longPressTimer) return;

        const touch = e.touches[0];
        const deltaX = Math.abs(touch.clientX - touchStart.x);
        const deltaY = Math.abs(touch.clientY - touchStart.y);

        // Cancel long press if user moves finger too much (scrolling)
        if (deltaX > 10 || deltaY > 10) {
            clearTimeout(longPressTimer);
            setLongPressTimer(null);
            setIsLongPressing(false);
        }
    };

    const handleTouchEnd = () => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            setLongPressTimer(null);
        }
        setIsLongPressing(false);
        setTouchStart(null);
    };

    // Delete handlers
    const handleDeleteClick = (kartuId: string, tanggal: string, bab: string) => {
        setKartuToDelete({ id: kartuId, tanggal, bab });
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!kartuToDelete) return;

        setIsDeleting(true);
        try {
            await deleteKartu(kartuToDelete.id);
            console.log('Kartu deleted successfully:', kartuToDelete);

            // Refresh kartu data for current santri
            if (selectedSantri?.id) {
                await getKartu(selectedSantri.id);
            }

            setIsDeleteModalOpen(false);
            setKartuToDelete(null);
        } catch (error) {
            console.error('Failed to delete kartu:', error);
            toaster.push(
                <Message type="error" showIcon closable>
                    Gagal menghapus kartu. Silakan coba lagi.
                </Message>,
                { placement: 'topCenter' }
            );
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
        setKartuToDelete(null);
    };

    // Clean up timer on unmount
    useEffect(() => {
        return () => {
            if (longPressTimer) {
                clearTimeout(longPressTimer);
            }
        };
    }, [longPressTimer]);

    // Don't render until client-side for SSR safety
    if (!isClient) {
        return <div>Loading...</div>;
    }

    if (!selectedSantri) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-[#C8B560] p-4 text-center">
                <p className="text-gray-500">Pilih santri terlebih dahulu untuk melihat kartu ngaji</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-[#C8B560] p-4 text-center">
                <p>Loading kartu data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-[#C8B560] p-4 text-center">
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }


    return (
        <div className="bg-white rounded-lg shadow-sm border border-[#C8B560] overflow-hidden">
            {/* Instructions */}
            {/* {kartuList.length > 0 && (
                <div className="px-4 py-2 bg-blue-50 border-b border-blue-200">
                    <p className="text-xs text-blue-600 text-center">
                        💡 Tahan (long press) pada baris kartu selama 1 detik untuk menghapus
                    </p>
                </div>
            )} */}

            {/* Table */}
            <div className="w-full">
                <table className="w-full table-fixed">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            {TABLE_HEAD.map((head, index) => {
                                let width = "";
                                switch (head) {
                                    case "Tanggal":
                                        width = "w-[26%]";
                                        break;
                                    case "Jilid/Surat":
                                        width = "w-[20%]";
                                        break;
                                    case "Hal/Ayat":
                                        width = "w-[14%]";
                                        break;
                                    case "Pengampu":
                                        width = "w-[20%]";
                                        break;
                                    case "Catatan":
                                        width = "w-[30%]";
                                        break;
                                }

                                return (
                                    <th
                                        key={index}
                                        className={`px-2 py-1.5 text-center font-medium text-gray-500 uppercase tracking-wider text-[10px] ${width} ${head === "Tanggal" ? "cursor-pointer hover:bg-gray-100" : ""
                                            }`}
                                        onClick={head === "Tanggal" ? handleDateSort : undefined}
                                    >
                                        <div className="flex items-center justify-center gap-1">
                                            <span className="break-words">{head}</span>
                                            {head === "Tanggal" && (
                                                <div className="relative">
                                                    <div >
                                                        {sortOrder === 'asc' ? (
                                                            <ArrowUpNarrowWide size={"15"} />
                                                        ) : (
                                                            <ArrowDownNarrowWide size={"15"} />
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {kartuList.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-2 py-8 text-center text-gray-500">
                                    Belum ada catatan ngaji untuk santri {selectedSantri.nama}
                                </td>
                            </tr>
                        ) : (
                            kartuList.map((kartu, index) => (
                                <tr
                                    key={index}
                                    className={`hover:bg-gray-50 select-none transition-colors duration-200 cursor-pointer ${isLongPressing ? 'bg-red-100 border-red-200' : ''}`}
                                    onMouseDown={() => handleMouseDown(kartu)}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseLeave}
                                    onTouchStart={(e) => handleTouchStart(kartu, e)}
                                    onTouchMove={handleTouchMove}
                                    onTouchEnd={handleTouchEnd}
                                    onContextMenu={(e) => e.preventDefault()} // Prevent right-click context menu
                                    style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                                >
                                    <td className="px-2 py-1.5 text-[10px] text-gray-900 w-[18%] align-top text-center">
                                        <div className="break-words">{kartu.tanggal.toLocaleDateString('id-ID')}</div>
                                    </td>
                                    <td className="px-2 py-1.5 text-[10px] text-gray-900 w-[20%] align-top text-center">
                                        <div className="break-words">{kartu.bab}</div>
                                    </td>
                                    <td className="px-2 py-1.5 text-[10px] text-gray-900 text-center w-[12%] align-top">
                                        <div className="break-words">{kartu.halaman}</div>
                                    </td>
                                    <td className="px-2 py-1.5 text-[10px] text-gray-900 w-[20%] align-top text-center">
                                        <div className="break-words">{kartu.pengampu}</div>
                                    </td>
                                    <td className="px-2 py-1.5 text-[10px] text-gray-900 w-[30%] align-top text-center">
                                        <div className="break-words">{kartu.catatan || 'Tidak ada catatan'}</div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer */}

            {/* Delete Confirmation Modal */}
            <MyModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="APAKAH ANDA YAKIN INGIN MENGHAPUS KARTU INI?"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                isLoading={isDeleting}
                size="sm"
                confirmText="IYA"
                cancelText="TIDAK"
                noteText="Note: Data kartu yang dihapus tidak bisa dikembalikan*"
            >
                {kartuToDelete && (
                    <div className="text-center text-gray-700">
                        <p><strong>Tanggal:</strong> {kartuToDelete.tanggal}</p>
                        <p><strong>Bab:</strong> {kartuToDelete.bab}</p>
                    </div>
                )}
            </MyModal>

        </div>
    );
}