import { create } from "zustand";

interface Aktivitas {
    id: string;
    aktivitas: string;
    tanggal: Date;
}

interface AktivitasState {
    aktivitasList: Aktivitas[];
    selectedAktivitas: Aktivitas | null;
    loading: boolean;
    error: string | null;
}

interface AktivitasActions {
    addAktivitas: (aktivitas: string, tanggal: Date) => Promise<void>;
    getAktivitas: (kelasId: string) => Promise<void>;
    getAktivitasById: (id: string) => Promise<void>;
    deleteAktivitas: (id: string) => Promise<void>;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
}

type AktivitasStore = AktivitasState & AktivitasActions;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const useAktivitasStore = create<AktivitasStore>((set, get) => ({
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
    addAktivitas: async (aktivitas: string, tanggal: Date) => {
        try {
            set({ loading: true, error: null });

            const response = await fetch(`${API_BASE_URL}/aktivitas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    aktivitas,
                    tanggal: tanggal.toISOString(),
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Response berisi { id: "generated-id" }
            const { id } = await response.json();

            // Buat object aktivitas baru dengan data yang dikirim + id dari response
            const newAktivitas: Aktivitas = {
                id,
                aktivitas,
                tanggal,
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

    // Get all aktivitas for a specific kelas
    getAktivitas: async (kelasId: string) => {
        try {
            set({ loading: true, error: null });

            const response = await fetch(`${API_BASE_URL}/aktivitas?kelasId=${kelasId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Response berisi array dengan format: [{ id, aktivitas, tanggal }]
            const aktivitasListResponse = await response.json();

            // Pastikan response sesuai format yang diharapkan
            const aktivitasList: Aktivitas[] = aktivitasListResponse.map((aktivitas: any) => ({
                id: aktivitas.id,
                aktivitas: aktivitas.aktivitas,
                tanggal: new Date(aktivitas.tanggal),
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

            const response = await fetch(`${API_BASE_URL}/aktivitas/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const aktivitasResponse = await response.json();

            const aktivitas: Aktivitas = {
                id: aktivitasResponse.id,
                aktivitas: aktivitasResponse.aktivitas,
                tanggal: new Date(aktivitasResponse.tanggal),
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

            const response = await fetch(`${API_BASE_URL}/aktivitas/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
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