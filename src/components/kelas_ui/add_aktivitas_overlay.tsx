import { FilledButton } from "../global_ui/filled_button";
import { MyCard } from "../global_ui/my_card";
import { MyTextField } from "../global_ui/my_text_field";
import { MyTextArea } from "../global_ui/my_text_area";
import { MyDatePicker } from "../global_ui/my_date_picker";
import { useState } from "react";
import { useOverlayAktivitas } from "@/store/overlay_status";
import {
    useAddAktivitas,
    useAktivitasLoading,
    useAktivitasError,
    useClearAktivitasError
} from "@/store/aktivitas_store";
import { useSelectedKelas } from "@/store/kelas_store";
import { Message, useToaster } from "rsuite";

export function AddAktivitasOverlay() {
    const { isOpen, close } = useOverlayAktivitas();
    const selectedKelas = useSelectedKelas();
    const toaster = useToaster();

    // Get store data and actions
    const addAktivitas = useAddAktivitas();
    const loading = useAktivitasLoading();
    const error = useAktivitasError();
    const clearError = useClearAktivitasError();

    const [formData, setFormData] = useState<{
        tanggal: Date;
        nama: string;
        deskripsi: string;
    }>({
        tanggal: new Date(),
        nama: "",
        deskripsi: "",
    });

    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            close();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Get kelas ID from global state
        if (!selectedKelas?.id) {
            toaster.push(
                <Message showIcon type="error" closable>
                    <strong>Error!</strong> Silakan pilih kelas terlebih dahulu.
                </Message>,
                { placement: 'topEnd' }
            );
            return;
        }

        try {
            // Format tanggal ke YYYY-MM-DD
            const formattedDate = formData.tanggal.toISOString().split('T')[0];

            await addAktivitas(
                parseInt(selectedKelas.id),
                formData.nama,
                formData.deskripsi,
                formattedDate
            );

            // Reset form dan close overlay jika berhasil
            setFormData({
                tanggal: new Date(),
                nama: "",
                deskripsi: ""
            });
            close();

            // Show success toast
            toaster.push(
                <Message showIcon type="success" closable>
                    <strong>Berhasil!</strong> Aktivitas berhasil ditambahkan.
                </Message>,
                { placement: 'topEnd' }
            );

        } catch (error) {
            console.error('Failed to add aktivitas:', error);

            // Show error toast
            toaster.push(
                <Message showIcon type="error" closable>
                    <strong>Error!</strong> {error instanceof Error ? error.message : 'Gagal menambahkan aktivitas.'}
                </Message>,
                { placement: 'topEnd' }
            );
        }
    };

    return (
        <div
            className="fixed inset-0 flex bg-black/30 items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <MyCard width="w-auto" height="h-auto" bgColor="bg-[#F5F5F5]" className="flex flex-col overflow-visible gap-4 sm:px-10 px-5 py-5 justify-center items-center max-w-md w-full border-2 border-[#C8B560]">
                <div className="flex flex-col gap-3 items-center">
                    <h1 className="text-xl font-semibold">Tambah Aktivitas Baru</h1>
                    {selectedKelas && (
                        <div className="text-center">
                            <p className="text-sm text-gray-600">untuk kelas</p>
                            <p className="font-medium text-[#C8B560]">{selectedKelas.nama}</p>
                        </div>
                    )}
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-3 w-full"
                >
                    {/* Show error if no kelas selected */}
                    {!selectedKelas && (
                        <div className="text-orange-600 text-sm text-center p-2 bg-orange-50 border border-orange-200 rounded">
                            <strong>Peringatan:</strong> Silakan pilih kelas terlebih dahulu dari dashboard.
                        </div>
                    )}

                    {/* Show error message if any */}
                    {error && (
                        <div className="text-red-500 text-sm text-center p-2 bg-red-50 border border-red-200 rounded">
                            <strong>Error:</strong> {error}
                        </div>
                    )}

                    <MyDatePicker
                        label="Tanggal"
                        value={formData.tanggal}
                        onChange={(value) => {
                            setFormData({ ...formData, tanggal: value || new Date() });
                        }}
                        required={true}
                    />

                    <MyTextField
                        title="Nama Aktivitas"
                        type="text"
                        required={true}
                        placeholder="Masukkan nama aktivitas"
                        onChange={(event) => {
                            setFormData({ ...formData, nama: event.target.value });
                        }}
                        value={formData.nama}
                    />

                    <MyTextArea
                        title="Deskripsi"
                        required={false}
                        placeholder="Masukkan deskripsi aktivitas (opsional)"
                        onChange={(event) => {
                            setFormData({ ...formData, deskripsi: event.target.value });
                        }}
                        value={formData.deskripsi}
                    />

                    <FilledButton
                        isLoading={loading}
                        type="submit"
                        width="w-full"
                        disabled={loading || !formData.nama.trim() || !selectedKelas}
                    >
                        {loading ? 'Menambahkan...' : 'Tambah'}
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
    );
}