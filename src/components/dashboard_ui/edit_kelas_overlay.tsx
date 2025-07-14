'use client'

import { FilledButton } from "../global_ui/filled_button";
import { MyCard } from "../global_ui/my_card";
import { MyTextField } from "../global_ui/my_text_field";
import { useState } from "react";
import { useOverlayEditKelas } from "@/store/overlay_status";
import { MyTextArea } from "../global_ui/my_text_area";
import { useEditKelas, useGenerateSlug, useValidateSlugInput, useKelasLoading, useSelectedKelas } from "@/store/kelas_store";
import { Message, useToaster } from "rsuite";
import { useEffect } from "react";

export function EditKelasOverlay() {
    const toaster = useToaster();

    const { isOpen, close } = useOverlayEditKelas();

    // Get actions and state from kelas store using individual selectors
    const editKelas = useEditKelas();
    const selectedKelas = useSelectedKelas();
    const generateSlug = useGenerateSlug();
    const validateSlugInput = useValidateSlugInput();
    const loading = useKelasLoading();

    const [formData, setFormData] = useState<{ nama: string, deskripsi: string, slug: string }>({
        nama: "",
        deskripsi: "",
        slug: "",
    });

    const [slugError, setSlugError] = useState<string | null>(null);

    // Load data when modal opens and selectedKelas exists
    useEffect(() => {
        if (isOpen && selectedKelas) {
            setFormData({
                nama: selectedKelas.nama || "",
                deskripsi: selectedKelas.deskripsi || "",
                slug: selectedKelas.slug || "",
            });
        } else if (isOpen) {
            // If no selected kelas, reset form
            setFormData({ nama: "", deskripsi: "", slug: "" });
        }
        setSlugError(null);
    }, [isOpen, selectedKelas]);

    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            close();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Final validation before submit
        const validation = validateSlugInput(formData.slug);
        if (!validation.isValid) {
            setSlugError(validation.error || 'Slug tidak valid');
            return;
        }

        try {
            if (selectedKelas) {
                // Edit existing kelas using slug
                await editKelas(selectedKelas.slug, {
                    nama: formData.nama,
                    deskripsi: formData.deskripsi,
                    slug: formData.slug,
                });

                // Show success toast
                toaster.push(
                    <Message showIcon type="success" closable>
                        <strong>Berhasil!</strong> Kelas berhasil diperbarui.
                    </Message>,
                    { placement: 'topEnd' }
                );
            } else {
                throw new Error('Tidak ada kelas yang dipilih untuk diedit');
            }

            // Reset form dan close overlay jika berhasil
            setFormData({ nama: "", deskripsi: "", slug: "" });
            setSlugError(null);
            close();

        } catch (error) {
            console.error('Failed to edit kelas:', error);

            // Show error toast
            toaster.push(
                <Message showIcon type="error" closable>
                    <strong>Error!</strong> {error instanceof Error ? error.message : 'Gagal memperbarui kelas.'}
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
            <MyCard width="w-auto" height="h-auto" bgColor="bg-[#F5F5F5]" className="flex flex-col overflow-visible gap-2 sm:px-10 px-5 py-5 justify-center items-center max-w-md w-full border-2 border-[#C8B560]">
                <div className="flex flex-col gap-3 items-center">
                    <h1 className="text-xl font-semibold">
                        Edit Kelas
                    </h1>
                    {selectedKelas && (
                        <p className="text-sm text-gray-600 text-center">
                            Mengedit kelas: <span className="font-medium text-[#C8B560]">{selectedKelas.nama}</span>
                        </p>
                    )}
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-3 w-full"
                >
                    <MyTextField
                        title="Nama Kelas"
                        type="text"
                        required={true}
                        placeholder="Masukkan Nama Kelas"
                        onChange={(event) => {
                            const namaValue = event.target.value;
                            setFormData({
                                ...formData,
                                nama: namaValue,
                                // Auto-generate slug dari nama jika slug masih kosong atau sama dengan slug sebelumnya
                                slug: formData.slug === generateSlug(formData.nama) || formData.slug === ""
                                    ? generateSlug(namaValue)
                                    : formData.slug
                            });
                            // Clear slug error when nama changes
                            if (slugError) setSlugError(null);
                        }}
                        value={formData.nama}
                    />

                    <MyTextArea
                        title="Deskripsi"
                        required={true}
                        placeholder="Masukkan Deskripsi"
                        onChange={(event) => {
                            setFormData({ ...formData, deskripsi: event.target.value });
                        }}
                        value={formData.deskripsi}
                    />

                    <MyTextField
                        title="Kode Kelas"
                        type="text"
                        required={true}
                        placeholder="otomatis-dibuat-dari-nama-kelas"
                        onChange={(event) => {
                            const slugValue = event.target.value;
                            setFormData({ ...formData, slug: slugValue });

                            // Validasi slug real-time
                            const validation = validateSlugInput(slugValue);
                            setSlugError(validation.isValid ? null : validation.error || null);
                        }}
                        value={formData.slug}
                    />
                    {/* Show slug validation error */}
                    {slugError && (
                        <div className="text-red-500 text-sm p-2 bg-red-50 border border-red-200 rounded">
                            {slugError}
                        </div>
                    )}
                    {/* Show slug preview */}
                    {formData.slug && !slugError && (
                        <div className="text-green-600 text-sm p-2 bg-green-50 border border-green-200 rounded">
                            <strong>Preview URL:</strong> {typeof window !== 'undefined' ? window.location.origin : ''}/{formData.slug}
                        </div>
                    )}

                    <FilledButton
                        isLoading={loading}
                        type="submit"
                        width="w-full"
                        disabled={loading || !!slugError || !formData.nama || !formData.slug || !formData.deskripsi}
                    >
                        {loading ? 'Memperbarui...' : 'Perbarui'}
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