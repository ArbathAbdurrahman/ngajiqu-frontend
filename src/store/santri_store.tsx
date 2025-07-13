import { create } from "zustand";

interface Santri {
    id: string;
    idKelas: string;
    nama: string;
}

interface Kartu {
    id: string;
    idSantri: string;
    tanggal: Date;
    bab: string;
    halaman: number;
    pengampu: string;
    catatan: string;
}

interface SantriState {
    santriList: Santri[];
    selectedSantri: Santri | null;
    kartuList: Kartu[];
    selectedKartu: Kartu | null;
    loading: boolean;
    error: string | null;
}

interface SantriActions {
    // Santri CRUD
    addSantri: (nama: string, kelasId: string) => Promise<void>;
    getSantri: (kelasId: string) => Promise<void>;
    getSantriById: (id: string) => Promise<void>;
    deleteSantri: (id: string) => Promise<void>;

    // Kartu CRUD
    addKartu: (santriId: string, data: Omit<Kartu, 'id'>) => Promise<void>;
    getKartu: (santriId: string) => Promise<void>;
    getKartuById: (id: string) => Promise<void>;
    deleteKartu: (id: string) => Promise<void>;

    // Kartu sorting
    sortKartuByDate: (order: 'asc' | 'desc') => void;

    // State management
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
}

type SantriStore = SantriState & SantriActions;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const useSantriStore = create<SantriStore>((set, get) => ({
    // Initial State
    santriList: [],
    selectedSantri: null,
    kartuList: [],
    selectedKartu: null,
    loading: false,
    error: null,

    // Actions
    setLoading: (loading: boolean) => set({ loading }),
    setError: (error: string | null) => set({ error }),
    clearError: () => set({ error: null }),

    // ===== SANTRI CRUD =====

    // Add new santri
    addSantri: async (nama: string, kelasId: string) => {
        try {
            set({ loading: true, error: null });

            const response = await fetch(`${API_BASE_URL}/santri`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nama,
                    kelasId,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Response berisi { id: "generated-id" }
            const { id } = await response.json();

            // Buat object santri baru dengan data yang dikirim + id dari response
            const newSantri: Santri = {
                id,
                idKelas: kelasId,
                nama,
            };

            set((state) => ({
                santriList: [...state.santriList, newSantri],
                loading: false,
            }));

        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to add santri',
                loading: false,
            });
            throw error;
        }
    },

    // Get all santri for a specific kelas
    getSantri: async (kelasId: string) => {
        try {
            set({ loading: true, error: null });

            const response = await fetch(`${API_BASE_URL}/santri?kelasId=${kelasId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Response berisi array dengan format: [{ id, nama, idKelas }]
            const santriListResponse = await response.json();

            // Pastikan response sesuai format yang diharapkan
            const santriList: Santri[] = santriListResponse.map((santri: any) => ({
                id: santri.id,
                idKelas: santri.idKelas,
                nama: santri.nama,
            }));

            set({
                santriList,
                loading: false,
            });

        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch santri',
                loading: false,
            });
            throw error;
        }
    },

    // Get santri by ID
    getSantriById: async (id: string) => {
        try {
            set({ loading: true, error: null });

            const response = await fetch(`${API_BASE_URL}/santri/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const santriResponse = await response.json();

            const santri: Santri = {
                id: santriResponse.id,
                idKelas: santriResponse.idKelas,
                nama: santriResponse.nama,
            };

            set({
                selectedSantri: santri,
                loading: false,
            });

        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch santri',
                loading: false,
            });
            throw error;
        }
    },

    // Delete santri
    deleteSantri: async (id: string) => {
        try {
            set({ loading: true, error: null });

            const response = await fetch(`${API_BASE_URL}/santri/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            set((state) => ({
                santriList: state.santriList.filter((santri) => santri.id !== id),
                selectedSantri: state.selectedSantri?.id === id ? null : state.selectedSantri,
                loading: false,
            }));

        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to delete santri',
                loading: false,
            });
            throw error;
        }
    },

    // ===== KARTU CRUD =====

    // Add new kartu for santri
    addKartu: async (santriId: string, data: Omit<Kartu, 'id'>) => {
        try {
            set({ loading: true, error: null });

            const response = await fetch(`${API_BASE_URL}/kartu`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idSantri: santriId,
                    tanggal: data.tanggal.toISOString(),
                    bab: data.bab,
                    halaman: data.halaman,
                    pengampu: data.pengampu,
                    catatan: data.catatan,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Response berisi { id: "generated-id" }
            const { id } = await response.json();

            // Buat object kartu baru dengan data yang dikirim + id dari response
            const newKartu: Kartu = {
                id,
                idSantri: santriId,
                tanggal: data.tanggal,
                bab: data.bab,
                halaman: data.halaman,
                pengampu: data.pengampu,
                catatan: data.catatan,
            };

            set((state) => ({
                kartuList: [...state.kartuList, newKartu],
                loading: false,
            }));

        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to add kartu',
                loading: false,
            });
            throw error;
        }
    },

    // Get all kartu for a specific santri
    getKartu: async (santriId: string) => {
        try {
            set({ loading: true, error: null });

            const response = await fetch(`${API_BASE_URL}/kartu?santriId=${santriId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Response berisi array dengan format: [{ id, idSantri, tanggal, bab, halaman, pengampu, catatan }]
            const kartuListResponse = await response.json();

            // Pastikan response sesuai format yang diharapkan
            const kartuList: Kartu[] = kartuListResponse.map((kartu: any) => ({
                id: kartu.id,
                idSantri: kartu.idSantri,
                tanggal: new Date(kartu.tanggal),
                bab: kartu.bab,
                halaman: Number(kartu.halaman),
                pengampu: kartu.pengampu,
                catatan: kartu.catatan,
            }));

            // Sort kartu by date (newest first by default)
            const sortedKartuList = kartuList.sort((a, b) => b.tanggal.getTime() - a.tanggal.getTime());

            set({
                kartuList: sortedKartuList,
                loading: false,
            });

        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch kartu',
                loading: false,
            });
            throw error;
        }
    },

    // Get kartu by ID
    getKartuById: async (id: string) => {
        try {
            set({ loading: true, error: null });

            const response = await fetch(`${API_BASE_URL}/kartu/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const kartuResponse = await response.json();

            const kartu: Kartu = {
                id: kartuResponse.id,
                idSantri: kartuResponse.idSantri,
                tanggal: new Date(kartuResponse.tanggal),
                bab: kartuResponse.bab,
                halaman: Number(kartuResponse.halaman),
                pengampu: kartuResponse.pengampu,
                catatan: kartuResponse.catatan,
            };

            set({
                selectedKartu: kartu,
                loading: false,
            });

        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch kartu',
                loading: false,
            });
            throw error;
        }
    },

    // Delete kartu
    deleteKartu: async (id: string) => {
        try {
            set({ loading: true, error: null });

            const response = await fetch(`${API_BASE_URL}/kartu/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            set((state) => ({
                kartuList: state.kartuList.filter((kartu) => kartu.id !== id),
                selectedKartu: state.selectedKartu?.id === id ? null : state.selectedKartu,
                loading: false,
            }));

        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to delete kartu',
                loading: false,
            });
            throw error;
        }
    },

    // ===== KARTU SORTING =====

    // Sort kartu by date
    sortKartuByDate: (order: 'asc' | 'desc') => {
        set((state) => {
            const sortedKartuList = [...state.kartuList].sort((a, b) => {
                const dateA = a.tanggal.getTime();
                const dateB = b.tanggal.getTime();

                if (order === 'asc') {
                    return dateA - dateB; // Oldest first
                } else {
                    return dateB - dateA; // Newest first
                }
            });

            return {
                kartuList: sortedKartuList,
            };
        });
    },
}));