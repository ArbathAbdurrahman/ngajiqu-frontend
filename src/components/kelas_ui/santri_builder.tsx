'use client'

import { Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { IconButton, Message, useToaster } from "rsuite";
import { useEffect, useState } from "react";
import {
    useSantriList,
    useSelectedSantri,
    useSetSelectedSantri,
    useSantriError,
    useGetSantri,
    useDeleteSantri,
    useGetLatestKartu,
    useGetKartu,
    useSantriStore
} from "@/store/santri_store";
import { useSelectedKelas } from "@/store/kelas_store";
import { MyModal } from "@/components/global_ui/my_modal";

interface SantriBuilderProps {
    searchQuery?: string;
    onClearSearch?: () => void;
}

export function SantriBuilder({ searchQuery = '', onClearSearch }: SantriBuilderProps) {
    const router = useRouter();
    const params = useParams();
    const toaster = useToaster();
    const [isClient, setIsClient] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // State untuk modal dan delete
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [santriToDelete, setSantriToDelete] = useState<{ id: string, nama: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Global state selectors
    const santriList = useSantriList();
    const selectedSantri = useSelectedSantri();
    const setSelectedSantri = useSetSelectedSantri();
    const selectedKelas = useSelectedKelas();
    const error = useSantriError();

    // Actions
    const getSantri = useGetSantri();
    const deleteSantri = useDeleteSantri();
    const getLatestKartu = useGetLatestKartu();
    const getKartu = useGetKartu();

    // SSR safety
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Fetch santri data and then kartu data sequentially
    useEffect(() => {
        const fetchData = async () => {
            if (isClient && selectedKelas?.slug) {
                try {
                    console.log('🚀 [SantriBuilder] Starting data fetch for kelas:', selectedKelas.slug);

                    // Start loading for both santri and kartu
                    setIsLoading(true);

                    // First, fetch santri data
                    console.log('📋 [SantriBuilder] Step 1: Fetching santri data...');
                    await getSantri(selectedKelas.slug);
                    console.log('✅ [SantriBuilder] Step 1 Complete: Santri data fetched');

                    // Small delay to ensure state is updated
                    // await new Promise(resolve => setTimeout(resolve, 100));

                    // Then, fetch kartu data for all santri
                    // Get fresh santri list from store
                    const currentSantriList = useSantriStore.getState().santriList;
                    console.log('📊 [SantriBuilder] Step 2: Found', currentSantriList.length, 'santri, fetching kartu data...');

                    if (currentSantriList.length > 0) {
                        console.log('📊 [SantriBuilder] Starting individual kartu fetch for each santri...');

                        // Fetch kartu for each santri individually with error handling
                        for (let i = 0; i < currentSantriList.length; i++) {
                            const santri = currentSantriList[i];
                            try {
                                console.log(`📇 [SantriBuilder] Fetching kartu for santri ${i + 1}/${currentSantriList.length}: ${santri.nama} (ID: ${santri.id})`);
                                await getKartu(santri.id);
                                console.log(`✅ [SantriBuilder] Successfully fetched kartu for ${santri.nama}`);
                            } catch (error) {
                                console.error(`❌ [SantriBuilder] Failed to fetch kartu for ${santri.nama} (ID: ${santri.id}):`, error);
                                // Continue with next santri instead of stopping the entire process
                            }
                        }

                        console.log('✅ [SantriBuilder] Step 2 Complete: All kartu fetch attempts finished');
                        console.log('🎯 [SantriBuilder] All data ready - getLatestKartu can now be called safely');
                    } else {
                        console.log('⚠️ [SantriBuilder] No santri found, skipping kartu fetch');
                    }

                    // All loading complete
                    setIsLoading(false);
                    console.log('🎉 [SantriBuilder] All data loading complete!');

                    // Debug: Show final kartu data state
                    const finalKartuList = useSantriStore.getState().kartuList;
                    console.log('🗂️ [SantriBuilder] Final kartu data count:', finalKartuList.length);
                    console.log('🗂️ [SantriBuilder] Final kartu data:', finalKartuList);

                } catch (error) {
                    console.error('❌ [SantriBuilder] Error fetching data:', error);
                    setIsLoading(false);
                }
            } else {
                console.log('⏳ [SantriBuilder] Waiting for client or selectedKelas...', { isClient, selectedKelas: selectedKelas?.slug });
            }
        };

        fetchData();
    }, [isClient, selectedKelas?.slug, getSantri, getKartu]);

    const handleCardClick = (santri: any) => {
        // Set selected santri to global state
        setSelectedSantri(santri);

        // Navigate ke halaman santri detail
        const kelas = params.kelas;

        router.push(`/dashboard/${kelas}/${santri.id}?nama=${encodeURIComponent(santri.nama)}`);
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

    // Show loading state until all data is loaded
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-8">
                <div className="text-center">
                    <p className="text-lg font-medium">Loading data...</p>
                    <p className="text-sm text-gray-500 mt-1">
                        Mengambil data santri dan kartu ngaji...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!santriList || santriList.length === 0) {
        return <div>Tidak ada santri ditemukan.</div>;
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
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-blue-700">
                            Menampilkan {filteredSantriList.length} dari {santriList.length} santri
                            untuk pencarian "{searchQuery}"
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
                <div className="space-y-4">
                    {filteredSantriList.map((santri, index) => {
                        // Get latest kartu for this santri - only called when kartu data is ready
                        console.log(`🔍 [SantriBuilder] Getting latest kartu for santri ${index + 1}/${santriList.length}: ${santri.nama} (ID: ${santri.id})`);
                        const latestKartu = getLatestKartu(santri.id);
                        console.log(`🔍 [SantriBuilder] Latest kartu for ${santri.nama}:`, latestKartu ? `${latestKartu.bab} - Hal ${latestKartu.halaman}` : 'No kartu found');

                        return (
                            <div
                                key={santri.id}
                                onClick={() => handleCardClick(santri)}
                                className="flex flex-col w-full bg-white border-2 border-[#C8B560] rounded-xl overflow-clip cursor-pointer hover:shadow-lg transition-shadow"
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
                        Santri: <strong>"{santriToDelete.nama}"</strong>
                    </p>
                )}
            </MyModal>
        </>
    );

}