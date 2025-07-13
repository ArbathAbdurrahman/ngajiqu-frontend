import { create } from "zustand";
import { useMemo } from "react";

// Helper function untuk mendapatkan auth headers (sama seperti kelas_store)
const getAuthHeaders = async (): Promise<Record<string, string>> => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    try {
        const accessToken = localStorage.getItem('accessToken');

        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }
    } catch (error) {
        console.warn('Failed to get auth token:', error);
    }

    return headers;
};

interface Aktivitas {
    id: string;
    kelas: number;
    kelas_nama: string;
    nama: string;
    deskripsi: string;
    tanggal: string; // Format: "YYYY-MM-DD"
}

interface AktivitasState {
    aktivitasList: Aktivitas[];
    selectedAktivitas: Aktivitas | null;
    loading: boolean;
    error: string | null;
}

interface AktivitasActions {
    addAktivitas: (kelasId: number, nama: string, deskripsi: string, tanggal: string) => Promise<void>;
    getAktivitas: (kelasId?: string) => Promise<void>;
    getAktivitasById: (id: string) => Promise<void>;
    deleteAktivitas: (id: string) => Promise<void>;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
}

type AktivitasStore = AktivitasState & AktivitasActions;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const useAktivitasStore = create<AktivitasStore>((set) => ({
    // Initial State
    aktivitasList: [],
    selectedAktivitas: null,
    loading: false,
    error: null,

    // Actions
    setLoading: (loading: boolean) => set({ loading }),
    setError: (error: string | null) => set({ error }),
    clearError: () => set({ error: null }),

    // Add new aktivitas
    addAktivitas: async (kelasId: number, nama: string, deskripsi: string, tanggal: string) => {
        try {
            set({ loading: true, error: null });

            const headers = await getAuthHeaders();

            const response = await fetch(`${API_BASE_URL}/kelas/kegiatan/`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    kelas: kelasId,
                    nama,
                    deskripsi,
                    tanggal, // Format: "YYYY-MM-DD"
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Response berisi data aktivitas yang baru dibuat
            const responseData = await response.json();

            // Mapping response ke format Aktivitas
            const newAktivitas: Aktivitas = {
                id: responseData.id.toString(),
                kelas: responseData.kelas,
                kelas_nama: responseData.kelas_nama || '',
                nama: responseData.nama,
                deskripsi: responseData.deskripsi || '',
                tanggal: responseData.tanggal,
            };

            set((state) => ({
                aktivitasList: [...state.aktivitasList, newAktivitas],
                loading: false,
            }));

        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to add aktivitas',
                loading: false,
            });
            throw error;
        }
    },

    // Get all aktivitas for a specific kelas or all aktivitas
    getAktivitas: async (slug?: string) => {
        try {
            set({ loading: true, error: null });

            const headers = await getAuthHeaders();

            // Build URL dengan atau tanpa filter kelas
            const url = `${API_BASE_URL}/kelas/kelas/${slug}/kegiatan/`;

            const response = await fetch(url, {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Authentication required. Please login again.');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Response berisi array aktivitas langsung
            const aktivitasResponse = await response.json();

            // Pastikan response adalah array
            if (!Array.isArray(aktivitasResponse)) {
                throw new Error('Expected array response from API');
            }

            // Mapping ke format Aktivitas
            const aktivitasList: Aktivitas[] = aktivitasResponse.map((aktivitas: any) => ({
                id: aktivitas.id.toString(),
                kelas: aktivitas.kelas,
                kelas_nama: aktivitas.kelas_nama,
                nama: aktivitas.nama,
                deskripsi: aktivitas.deskripsi || '',
                tanggal: aktivitas.tanggal,
            }));

            set({
                aktivitasList,
                loading: false,
            });

        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch aktivitas',
                loading: false,
            });
            throw error;
        }
    },

    // Get aktivitas by ID
    getAktivitasById: async (id: string) => {
        try {
            set({ loading: true, error: null });

            const headers = await getAuthHeaders();

            const response = await fetch(`${API_BASE_URL}/kelas/kegiatan/${id}/`, {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const aktivitasResponse = await response.json();

            const aktivitas: Aktivitas = {
                id: aktivitasResponse.id.toString(),
                kelas: aktivitasResponse.kelas,
                kelas_nama: aktivitasResponse.kelas_nama,
                nama: aktivitasResponse.nama,
                deskripsi: aktivitasResponse.deskripsi || '',
                tanggal: aktivitasResponse.tanggal,
            };

            set({
                selectedAktivitas: aktivitas,
                loading: false,
            });

        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch aktivitas',
                loading: false,
            });
            throw error;
        }
    },

    // Delete aktivitas
    deleteAktivitas: async (id: string) => {
        try {
            set({ loading: true, error: null });

            const headers = await getAuthHeaders();

            const response = await fetch(`${API_BASE_URL}/kelas/kegiatan/${id}/`, {
                method: 'DELETE',
                headers,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            set((state) => ({
                aktivitasList: state.aktivitasList.filter((aktivitas) => aktivitas.id !== id),
                selectedAktivitas: state.selectedAktivitas?.id === id ? null : state.selectedAktivitas,
                loading: false,
            }));

        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to delete aktivitas',
                loading: false,
            });
            throw error;
        }
    },
}));

// Individual selectors to avoid infinite loop
export const useAktivitasList = () => useAktivitasStore((state) => state.aktivitasList);
export const useAktivitasLoading = () => useAktivitasStore((state) => state.loading);
export const useAktivitasError = () => useAktivitasStore((state) => state.error);
export const useSelectedAktivitas = () => useAktivitasStore((state) => state.selectedAktivitas);

// Individual action selectors
export const useAddAktivitas = () => useAktivitasStore((state) => state.addAktivitas);
export const useGetAktivitas = () => useAktivitasStore((state) => state.getAktivitas);
export const useGetAktivitasById = () => useAktivitasStore((state) => state.getAktivitasById);
export const useDeleteAktivitas = () => useAktivitasStore((state) => state.deleteAktivitas);
export const useSetAktivitasLoading = () => useAktivitasStore((state) => state.setLoading);
export const useSetAktivitasError = () => useAktivitasStore((state) => state.setError);
export const useClearAktivitasError = () => useAktivitasStore((state) => state.clearError);

// Alternative: Cached version using useMemo
export const useAktivitasActions = () => {
    const addAktivitas = useAktivitasStore((state) => state.addAktivitas);
    const getAktivitas = useAktivitasStore((state) => state.getAktivitas);
    const getAktivitasById = useAktivitasStore((state) => state.getAktivitasById);
    const deleteAktivitas = useAktivitasStore((state) => state.deleteAktivitas);
    const setLoading = useAktivitasStore((state) => state.setLoading);
    const setError = useAktivitasStore((state) => state.setError);
    const clearError = useAktivitasStore((state) => state.clearError);

    return useMemo(() => ({
        addAktivitas,
        getAktivitas,
        getAktivitasById,
        deleteAktivitas,
        setLoading,
        setError,
        clearError,
    }), [addAktivitas, getAktivitas, getAktivitasById, deleteAktivitas, setLoading, setError, clearError]);
};