import { create } from "zustand";

type OverlayAktivitasState = {
    isOpen: boolean;
    open: () => void;
    close: () => void;
};

type OverlaySantriState = {
    isOpen: boolean;
    open: () => void;
    close: () => void;
};

type OverlayKelasState = {
    isOpen: boolean;
    open: () => void;
    close: () => void;
};

export const useOverlayAktivitas = create<OverlayAktivitasState>((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
}));

export const useOverlaySantri = create<OverlaySantriState>((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
}));

export const useOverlayKelas = create<OverlayKelasState>((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
}));

export const useOpenAktivitas = () => useOverlayAktivitas((state) => state.isOpen);
export const useOpenSantri = () => useOverlaySantri((state) => state.isOpen);
export const useOpenKelas = () => useOverlaySantri((state) => state.isOpen);
