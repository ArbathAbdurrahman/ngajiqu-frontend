import { FilledButton } from "../global_ui/filled_button";
import { MyCard } from "../global_ui/my_card";
import { MyTextField } from "../global_ui/my_text_field";
import { useState } from "react";
import { useOverlaySantri } from "@/store/overlay_status";
import { useAddSantri, useSantriLoading, useSantriError } from "@/store/santri_store";
import { useSelectedKelas } from "@/store/kelas_store";

export function AddSantriOverlay() {
    const { isOpen, close } = useOverlaySantri();
    const [addSantriData, setAddSantriData] = useState<{ nama: string }>({
        nama: "",
    });
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Global state and actions
    const selectedKelas = useSelectedKelas();
    const addSantri = useAddSantri();
    const loading = useSantriLoading();
    const error = useSantriError();

    if (!isOpen) return null;

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000); // Hide after 3 seconds
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            close();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!addSantriData.nama.trim()) {
            showToast('Nama santri harus diisi', 'error');
            return;
        }

        if (!selectedKelas?.id) {
            showToast('Kelas tidak ditemukan', 'error');
            return;
        }

        try {
            await addSantri(addSantriData.nama.trim(), Number(selectedKelas.id));

            // Reset form and close overlay on success
            setAddSantriData({ nama: "" });
            close();

            showToast('✅ Santri berhasil ditambahkan!', 'success');
        } catch (error) {
            console.error('Failed to add santri:', error);
            showToast('❌ Gagal menambahkan santri. Silakan coba lagi.', 'error');
        }
    };

    return (
        <>
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-[60] px-4 py-2 rounded-lg shadow-lg transition-all duration-300 ${toast.type === 'success'
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                    }`}>
                    {toast.message}
                </div>
            )}

            {/* Main Overlay */}
            <div
                className="fixed inset-0 flex bg-black/30 items-center justify-center z-50 p-4"
                onClick={handleBackdropClick}
            >
                <MyCard width="w-auto" height="h-auto" bgColor="bg-[#F5F5F5]" className="flex flex-col overflow-visible gap-2 sm:px-10 px-5 py-5 justify-center items-center max-w-md w-full border-2 border-[#C8B560]">
                    <div className="flex flex-col gap-3 items-center">
                        <h1 className="text-xl font-semibold">Tambah Santri Baru</h1>
                    </div>
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-3 w-full"
                    >
                        {error && (
                            <div className="text-red-500 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <MyTextField
                            title="Nama"
                            type="text"
                            required={true}
                            placeholder="Masukkan Nama"
                            onChange={(event) => {
                                setAddSantriData({ ...addSantriData, nama: event.target.value });
                            }}
                            value={addSantriData.nama}
                        />


                        <FilledButton
                            isLoading={loading}
                            type="submit"
                            width="w-full"
                        >
                            Tambah
                        </FilledButton>
                        <FilledButton
                            type="button"
                            width="w-full"
                            bgColor="bg-[#F44336]"
                            onClick={close}
                            disabled={loading}
                        >
                            Batal
                        </FilledButton>

                    </form>
                </MyCard>
            </div>
        </>
    );
}