'use client'

import { FilledButton } from "../global_ui/filled_button";
import { MyCard } from "../global_ui/my_card";
import { MyTextField } from "../global_ui/my_text_field";
import { useState } from "react";
import { useOverlayKelas } from "@/store/overlay_status";
import { MyTextArea } from "../global_ui/my_text_area";

export function AddKelasOverlay() {
    const { isOpen, close } = useOverlayKelas();

    const [addKelas, setAddKelas] = useState<{ nama: string, deskripsi: string, alamat: string }>({
        nama: "",
        deskripsi: "",
        alamat: "",
    });

    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            close();
        }
    };

    return (
        <div
            className="fixed inset-0 flex bg-black/30 items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <MyCard width="w-auto" height="h-auto" bgColor="bg-[#F5F5F5]" className="flex flex-col overflow-visible gap-2 sm:px-10 px-5 py-5 justify-center items-center max-w-md w-full border-2 border-[#C8B560]">
                <div className="flex flex-col gap-3 items-center">
                    <h1 className="text-xl font-semibold">Tambah Kelas Baru</h1>
                </div>
                <form
                    // onSubmit={handleLogin}
                    className="flex flex-col gap-3 w-full"
                >
                    <MyTextField
                        title="Nama Kelas"
                        type="text"
                        required={true}
                        placeholder="Masukkan Nama Kelas"
                        onChange={(event) => {
                            setAddKelas({ ...addKelas, nama: event.target.value });
                        }}
                        value={addKelas.nama}
                    />

                    <MyTextArea
                        title="Deskripsi"
                        required={true}
                        placeholder="Masukkan Deskripsi"
                        onChange={(event) => {
                            setAddKelas({ ...addKelas, nama: event.target.value });
                        }}
                        value={addKelas.nama}
                    />

                    <MyTextField
                        title="Alamat"
                        type="text"
                        required={true}
                        placeholder="Masukkan Alamat Kelas"
                        onChange={(event) => {
                            setAddKelas({ ...addKelas, alamat: event.target.value });
                        }}
                        value={addKelas.alamat}
                    />

                    <FilledButton
                        // isLoading={isLoading}
                        type="submit"
                        width="w-full"
                    >
                        Tambah
                    </FilledButton>
                    <FilledButton
                        // isLoading={isLoading}
                        type="button"
                        width="w-full"
                        bgColor="bg-[#F44336]"
                        onClick={close}
                    >
                        Batal
                    </FilledButton>

                </form>
            </MyCard>
        </div>
    );
}