import { create } from "zustand";

interface Kelas {
    id: string;
    nama: string;
    alamat: string;
    deskripsi?: string;
    link: string;
}

interface KelasState {
    kelasList: Kelas[];
    selectedKelas: Kelas | null;
    loading: boolean;
    error: string | null;
}

interface KelasAction {
    addKelas: ({ nama, alamat, deskripsi }: Omit<Kelas, 'id' | 'link'>) => Promise<void>;
    getKelas: () => Promise<void>;
    getKelasById: (id: string) => Promise<void>;
    editKelas: (id: string, data: Partial<Kelas>) => Promise<void>;
    deleteKelas: (id: string) => Promise<void>;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
}

type KelasStore = KelasState & KelasAction;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const useKelasStore = create<KelasStore>((set, get) => ({
    // Initial State
    kelasList: [],
    selectedKelas: null,
    loading: false,
    error: null,

    // Actions
    setLoading: (loading: boolean) => set({ loading }),
    setError: (error: string | null) => set({ error }),
    clearError: () => set({ error: null }),

    // Add new kelas
    addKelas: async ({ nama, alamat, deskripsi }) => {
        try {
            set({ loading: true, error: null });

            const response = await fetch(`${API_BASE_URL}/kelas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nama,
                    alamat,
                    deskripsi,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Response berisi { id: "generated-id", link: "generated-link" }
            const { id, link } = await response.json();

            // Buat object kelas baru dengan data yang dikirim + id dan link dari response
            const newKelas: Kelas = {
                id,
                nama,
                alamat,
                deskripsi,
                link,
            };

            set((state) => ({
                kelasList: [...state.kelasList, newKelas],
                loading: false,
            }));

        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to add kelas',
                loading: false,
            });
            throw error;
        }
    },

    // Get all kelas
    getKelas: async () => {
        try {
            set({ loading: true, error: null });

            const response = await fetch(`${API_BASE_URL}/kelas`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Response berisi array dengan format: [{ id, nama, alamat, deskripsi, link }]
            const kelasListResponse = await response.json();

            // Pastikan response sesuai format yang diharapkan
            const kelasList: Kelas[] = kelasListResponse.map((kelas: any) => ({
                id: kelas.id,
                nama: kelas.nama,
                alamat: kelas.alamat,
                deskripsi: kelas.deskripsi,
                link: kelas.link,
            }));

            set({
                kelasList,
                loading: false,
            });

        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch kelas',
                loading: false,
            });
            throw error;
        }
    },

    // Get kelas by ID
    getKelasById: async (id: string) => {
        try {
            set({ loading: true, error: null });

            const response = await fetch(`${API_BASE_URL}/kelas/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const kelas = await response.json();

            set({
                selectedKelas: kelas,
                loading: false,
            });

        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch kelas',
                loading: false,
            });
            throw error;
        }
    },

    // Edit kelas
    editKelas: async (id: string, data: Partial<Kelas>) => {
        try {
            set({ loading: true, error: null });

            const response = await fetch(`${API_BASE_URL}/kelas/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const updatedKelas = await response.json();

            set((state) => ({
                kelasList: state.kelasList.map((kelas) =>
                    kelas.id === id ? updatedKelas : kelas
                ),
                selectedKelas: state.selectedKelas?.id === id ? updatedKelas : state.selectedKelas,
                loading: false,
            }));

        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to update kelas',
                loading: false,
            });
            throw error;
        }
    },

    // Delete kelas
    deleteKelas: async (id: string) => {
        try {
            set({ loading: true, error: null });

            const response = await fetch(`${API_BASE_URL}/kelas/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            set((state) => ({
                kelasList: state.kelasList.filter((kelas) => kelas.id !== id),
                selectedKelas: state.selectedKelas?.id === id ? null : state.selectedKelas,
                loading: false,
            }));

        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to delete kelas',
                loading: false,
            });
            throw error;
        }
    },
}));