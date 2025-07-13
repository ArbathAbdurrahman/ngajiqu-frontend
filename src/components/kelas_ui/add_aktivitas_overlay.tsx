import { FilledButton } from "../global_ui/filled_button";
import { MyCard } from "../global_ui/my_card";
import { MyTextField } from "../global_ui/my_text_field";
import { MyDatePicker } from "../global_ui/my_date_picker";
import { useState } from "react";
import { useOverlayAktivitas } from "@/store/overlay_status";

export function AddAktivitasOverlay() {
    const { isOpen, close } = useOverlayAktivitas();
    const [addAktivitas, setAddAktivitas] = useState<{ tanggal: Date, aktivitas: string }>({
        tanggal: new Date,
        aktivitas: "",
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
            <MyCard width="w-auto" height="h-auto" bgColor="bg-[#F5F5F5]" className="flex flex-col overflow-visible gap-4 sm:px-10 px-5 py-5 justify-center items-center max-w-md w-full border-2 border-[#C8B560]">
                <div className="flex flex-col gap-3 items-center">
                    <h1 className="text-xl font-semibold">Tambah Aktivitas Baru</h1>
                </div>
                <form
                    // onSubmit={handleLogin}
                    className="flex flex-col gap-3 w-full"
                >
                    <MyDatePicker
                        label="Tanggal"
                        value={addAktivitas.tanggal}
                        onChange={(value) => {
                            setAddAktivitas({ ...addAktivitas, tanggal: value || new Date() });
                        }}
                        required={true}
                    />

                    <MyTextField
                        title="Aktivitas"
                        type="text"
                        required={true}
                        placeholder="Masukkan aktivitas"
                        onChange={(event) => {
                            setAddAktivitas({ ...addAktivitas, aktivitas: event.target.value });
                        }}
                        value={addAktivitas.aktivitas}
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