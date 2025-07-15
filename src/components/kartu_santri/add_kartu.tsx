'use client'

import { useState } from "react";
import { FilledButton } from "../global_ui/filled_button";
import { MyCard } from "../global_ui/my_card";
import { MyTextArea } from "../global_ui/my_text_area";
import { MyTextField } from "../global_ui/my_text_field";
import { useSelectedSantri, useAddKartu, useGetKartu } from "@/store/santri_store";
import { Message, useToaster } from "rsuite";

interface AddKartuOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddKartuOverlay({ isOpen, onClose }: AddKartuOverlayProps) {
    const toaster = useToaster();

    const [formData, setFormData] = useState({
        bab: '',
        halaman: '',
        pengampu: '',
        catatan: '',
        tanggal: new Date()
    });

    const [loading, setLoading] = useState(false);

    const selectedSantri = useSelectedSantri();
    const addKartu = useAddKartu();
    const getKartu = useGetKartu();

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedSantri) {
            toaster.push(
                <Message showIcon type="warning" closable>
                    <strong>Peringatan!</strong> Silakan pilih santri terlebih dahulu.
                </Message>,
                { placement: 'topCenter' }
            );
            return;
        }

        if (!formData.bab.trim() || !formData.halaman.trim() || !formData.pengampu.trim()) {
            toaster.push(
                <Message showIcon type="warning" closable>
                    <strong>Peringatan!</strong> Mohon lengkapi semua field yang wajib diisi.
                </Message>,
                { placement: 'topCenter' }
            );
            return;
        }

        setLoading(true);

        try {
            await addKartu(selectedSantri.id, {
                bab: formData.bab.trim(),
                halaman: parseInt(formData.halaman),
                pengampu: formData.pengampu.trim(),
                catatan: formData.catatan.trim(),
                tanggal: formData.tanggal,
                idSantri: selectedSantri.id
            });

            // Reset form and close modal
            setFormData({
                bab: '',
                halaman: '',
                pengampu: '',
                catatan: '',
                tanggal: new Date()
            });

            // Refresh kartu data for current santri
            if (selectedSantri?.id) {
                await getKartu(selectedSantri.id);
            }

            // Show success message
            toaster.push(
                <Message showIcon type="success" closable>
                    <strong>Berhasil!</strong> Kartu santri berhasil ditambahkan.
                </Message>,
                { placement: 'topCenter' }
            );

            onClose();
        } catch (error) {
            console.error('Failed to add kartu:', error);

            // Show error message
            toaster.push(
                <Message showIcon type="error" closable>
                    <strong>Error!</strong> {error instanceof Error ? error.message : 'Gagal menambahkan kartu. Silakan coba lagi.'}
                </Message>,
                { placement: 'topCenter' }
            );
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 flex bg-black/30 items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <MyCard width="w-auto" height="h-auto" bgColor="bg-[#F5F5F5]" className="flex flex-col overflow-visible gap-4 sm:px-10 px-5 py-5 justify-center items-center max-w-md w-full border-2 border-[#C8B560]">
                <div className="flex flex-col gap-3 items-center">
                    <h1 className="text-xl font-semibold">Tambah Kartu Santri</h1>
                    {selectedSantri && (
                        <div className="text-center">
                            <p className="text-sm text-gray-600">untuk santri</p>
                            <p className="font-medium text-[#C8B560]">{selectedSantri.nama}</p>
                        </div>
                    )}
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-3 w-full"
                >

                    <MyTextField
                        title="Jilid/Surat"
                        type="text"
                        required={true}
                        placeholder="Jilid/Surat Terbaru"
                        onChange={(event) => {
                            setFormData({ ...formData, bab: event.target.value });
                        }}
                        value={formData.bab}
                    />

                    <MyTextField
                        title="Hal./Ayat"
                        type="number"
                        required={true}
                        placeholder="Hal./Ayat Terbaru"
                        onChange={(event) => {
                            setFormData({ ...formData, halaman: event.target.value });
                        }}
                        value={formData.halaman}
                    />

                    <MyTextField
                        title="Pengampu"
                        type="text"
                        required={true}
                        placeholder="Masukkan Nama Pengampu"
                        onChange={(event) => {
                            setFormData({ ...formData, pengampu: event.target.value });
                        }}
                        value={formData.pengampu}
                    />

                    <MyTextArea
                        title="Catatan"
                        required={false}
                        placeholder="Masukkan Catatan"
                        onChange={(event) => {
                            setFormData({ ...formData, catatan: event.target.value });
                        }}
                        value={formData.catatan}
                    />

                    <FilledButton
                        isLoading={loading}
                        type="submit"
                        width="w-full"
                        disabled={loading || !formData.bab.trim() || !formData.halaman.trim() || !formData.pengampu.trim() || !selectedSantri}
                    >
                        {loading ? 'Menambahkan...' : 'Tambah Kartu'}
                    </FilledButton>
                    <FilledButton
                        type="button"
                        width="w-full"
                        bgColor="bg-[#F44336]"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Batal
                    </FilledButton>

                </form>
            </MyCard>
        </div>
    );
}