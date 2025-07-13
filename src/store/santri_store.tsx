import { create } from "zustand";

// Helper functions untuk localStorage persistence selectedSantri
const getSelectedSantriFromStorage = (): Santri | null => {
    try {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('selectedSantri');
            return stored ? JSON.parse(stored) : null;
        }
    } catch (error) {
        console.warn('Failed to get selectedSantri from localStorage:', error);
    }
    return null;
};

const saveSelectedSantriToStorage = (santri: Santri | null): void => {
    try {
        if (typeof window !== 'undefined') {
            if (santri) {
                localStorage.setItem('selectedSantri', JSON.stringify(santri));
            } else {
                localStorage.removeItem('selectedSantri');
            }
        }
    } catch (error) {
        console.warn('Failed to save selectedSantri to localStorage:', error);
    }
};

// Helper function untuk mendapatkan auth headers (sama seperti kelas_store dan aktivitas_store)
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

interface Santri {
    id: string;
    nama: string;
    kelas: number;
    kelas_nama: string;
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
    addSantri: (nama: string, kelasId: number) => Promise<void>;
    getSantri: (slug: string) => Promise<void>;
    getSantriById: (id: string) => Promise<void>;
    deleteSantri: (id: string) => Promise<void>;

    // Selected Santri management
    setSelectedSantri: (santri: Santri | null) => void;
    clearSelectedSantri: () => void;

    // Kartu CRUD
    addKartu: (santriId: string, data: Omit<Kartu, 'id'>) => Promise<void>;
    getKartu: (santriId: string) => Promise<void>;
    getKartuById: (id: string) => Promise<void>;
    deleteKartu: (id: string) => Promise<void>;

    // Kartu sorting
    sortKartuByDate: (order: 'asc' | 'desc') => void;

    // Get latest kartu
    getLatestKartu: (santriId: string) => Kartu | null;
    getLatestKartuForAllSantri: () => Record<string, Kartu | null>;

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
    selectedSantri: getSelectedSantriFromStorage(),
    kartuList: [],
    selectedKartu: null,
    loading: false,
    error: null,

    // Selected Santri management
    setSelectedSantri: (santri: Santri | null) => {
        set({ selectedSantri: santri });
        saveSelectedSantriToStorage(santri);
    },

    clearSelectedSantri: () => {
        set({ selectedSantri: null });
        saveSelectedSantriToStorage(null);
    },

    // Actions
    setLoading: (loading: boolean) => set({ loading }),
    setError: (error: string | null) => set({ error }),
    clearError: () => set({ error: null }),

    // ===== SANTRI CRUD =====

    // Add new santri
    addSantri: async (nama: string, kelasId: number) => {
        try {
            set({ loading: true, error: null });

            const headers = await getAuthHeaders();

            const response = await fetch(`${API_BASE_URL}/kelas/santri/`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    nama,
                    kelas: kelasId, // Kirim sebagai number
                }),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Authentication required. Please login again.');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Response berisi santri object yang baru dibuat
            const responseData = await response.json();

            // Buat object santri baru dengan data dari response
            const newSantri: Santri = {
                id: responseData.id.toString(),
                nama: responseData.nama,
                kelas: responseData.kelas,
                kelas_nama: responseData.kelas_nama || '',
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
    getSantri: async (slug: string) => {
        try {
            set({ error: null });

            const headers = {
                'Content-Type': 'application/json',
            };

            const response = await fetch(`${API_BASE_URL}/kelas/kelas/${slug}/santri`, {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Authentication required. Please login again.');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Response berisi array dengan format: [{ id, nama, kelas, kelas_nama }]
            const santriListResponse = await response.json();

            // Pastikan response adalah array
            if (!Array.isArray(santriListResponse)) {
                throw new Error('Expected array response from API');
            }

            // Mapping response ke format Santri
            const santriList: Santri[] = santriListResponse.map((santri: any) => ({
                id: santri.id.toString(),
                nama: santri.nama,
                kelas: santri.kelas,
                kelas_nama: santri.kelas_nama,
            }));

            set({
                santriList,
            });

        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch santri',
            });
            throw error;
        }
    },

    // Get santri by ID
    getSantriById: async (id: string) => {
        try {
            set({ loading: true, error: null });

            const headers = {
                'Content-Type': 'application/json',
            };

            const response = await fetch(`${API_BASE_URL}/kelas/santri/${id}`, {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Authentication required. Please login again.');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const santriResponse = await response.json();

            const santri: Santri = {
                id: santriResponse.id.toString(),
                nama: santriResponse.nama,
                kelas: santriResponse.kelas,
                kelas_nama: santriResponse.kelas_nama,
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

            const headers = await getAuthHeaders();

            const response = await fetch(`${API_BASE_URL}/kelas/santri/${id}`, {
                method: 'DELETE',
                headers,
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Authentication required. Please login again.');
                }
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

            const headers = await getAuthHeaders();

            const response = await fetch(`${API_BASE_URL}/kelas/ngaji/`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    nama: santriId,
                    tanggal: data.tanggal.toISOString().split('T')[0], // Format: "YYYY-MM-DD"
                    surat: data.bab,
                    ayat: data.halaman,
                    pengampu: data.pengampu,
                    catatan: data.catatan,
                }),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Authentication required. Please login again.');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Response berisi kartu object yang baru dibuat
            const responseData = await response.json();

            // Buat object kartu baru dengan data dari response
            const newKartu: Kartu = {
                id: responseData.id.toString(),
                idSantri: responseData.nama.toString(), // nama di response = id santri
                tanggal: new Date(responseData.tanggal),
                bab: responseData.surat, // surat di response = bab di kartu
                halaman: responseData.ayat, // ayat di response = halaman di kartu
                pengampu: responseData.pengampu,
                catatan: responseData.catatan,
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
            set({ error: null });

            const headers = {
                'Content-Type': 'application/json',
            };

            const response = await fetch(`${API_BASE_URL}/kelas/santri/${santriId}/ngaji-records/`, {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Authentication required. Please login again.');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Response berisi array dengan format yang sama seperti addKartu
            const kartuListResponse = await response.json();

            // Pastikan response adalah array
            if (!Array.isArray(kartuListResponse)) {
                throw new Error('Expected array response from API');
            }

            // Mapping response ke format Kartu sesuai dengan format API
            const kartuList: Kartu[] = kartuListResponse.map((kartu: any) => ({
                id: kartu.id.toString(),
                idSantri: kartu.nama.toString(), // nama di response = id santri
                tanggal: new Date(kartu.tanggal),
                bab: kartu.surat, // surat di response = bab di kartu
                halaman: kartu.ayat, // ayat di response = halaman di kartu
                pengampu: kartu.pengampu,
                catatan: kartu.catatan,
            }));

            console.log(`📇 [SantriStore] getKartu for santriId ${santriId}: received ${kartuList.length} kartu records`);

            // Merge with existing kartu data instead of replacing
            set((state) => {
                // Remove any existing kartu for this santri to avoid duplicates
                const existingKartuWithoutThisSantri = state.kartuList.filter(
                    existingKartu => existingKartu.idSantri !== santriId
                );

                console.log(`📇 [SantriStore] Before merge: ${state.kartuList.length} total kartu, ${state.kartuList.length - existingKartuWithoutThisSantri.length} for this santri`);

                // Add the new kartu data for this santri
                const mergedKartuList = [...existingKartuWithoutThisSantri, ...kartuList];

                // Sort all kartu by date (newest first)
                const sortedKartuList = mergedKartuList.sort((a, b) => b.tanggal.getTime() - a.tanggal.getTime());

                console.log(`📇 [SantriStore] After merge: ${sortedKartuList.length} total kartu`);

                return {
                    kartuList: sortedKartuList,
                };
            });

        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch kartu',
            });
            throw error;
        }
    },

    // Get kartu by ID
    getKartuById: async (id: string) => {
        try {
            set({ loading: true, error: null });

            const headers = {
                'Content-Type': 'application/json',
            };

            const response = await fetch(`${API_BASE_URL}/kelas/ngaji/${id}`, {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Authentication required. Please login again.');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const kartuResponse = await response.json();

            const kartu: Kartu = {
                id: kartuResponse.id.toString(),
                idSantri: kartuResponse.nama.toString(), // nama di response = id santri
                tanggal: new Date(kartuResponse.tanggal),
                bab: kartuResponse.surat, // surat di response = bab di kartu
                halaman: kartuResponse.ayat, // ayat di response = halaman di kartu
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

            const headers = await getAuthHeaders();

            const response = await fetch(`${API_BASE_URL}/kelas/ngaji/${id}`, {
                method: 'DELETE',
                headers,
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Authentication required. Please login again.');
                }
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

    // Get kartu with the most recent date for a specific santri
    getLatestKartu: (santriId: string) => {
        const { kartuList } = get();

        // Filter kartu for the specific santri
        const santriKartuList = kartuList.filter(kartu => kartu.idSantri === santriId);

        if (santriKartuList.length === 0) {
            return null;
        }

        // Find kartu with the most recent date
        const latestKartu = santriKartuList.reduce((latest, current) => {
            return current.tanggal.getTime() > latest.tanggal.getTime() ? current : latest;
        });

        return latestKartu;
    },

    // Get latest kartu for all santri (returns a record with santriId as key)
    getLatestKartuForAllSantri: () => {
        const { kartuList, santriList } = get();
        const result: Record<string, Kartu | null> = {};

        // Initialize all santri with null
        santriList.forEach(santri => {
            result[santri.id] = null;
        });

        // Find latest kartu for each santri
        santriList.forEach(santri => {
            const santriKartuList = kartuList.filter(kartu => kartu.idSantri === santri.id);

            if (santriKartuList.length > 0) {
                const latestKartu = santriKartuList.reduce((latest, current) => {
                    return current.tanggal.getTime() > latest.tanggal.getTime() ? current : latest;
                });
                result[santri.id] = latestKartu;
            }
        });

        return result;
    },
}));

// Individual selectors to avoid infinite loop (konsisten dengan store lainnya)
export const useSantriList = () => useSantriStore((state) => state.santriList);
export const useSelectedSantri = () => useSantriStore((state) => state.selectedSantri);
export const useKartuList = () => useSantriStore((state) => state.kartuList);
export const useSelectedKartu = () => useSantriStore((state) => state.selectedKartu);
export const useSantriLoading = () => useSantriStore((state) => state.loading);
export const useSantriError = () => useSantriStore((state) => state.error);

// Individual action selectors
export const useAddSantri = () => useSantriStore((state) => state.addSantri);
export const useGetSantri = () => useSantriStore((state) => state.getSantri);
export const useGetSantriById = () => useSantriStore((state) => state.getSantriById);
export const useDeleteSantri = () => useSantriStore((state) => state.deleteSantri);

// Selected Santri action selectors
export const useSetSelectedSantri = () => useSantriStore((state) => state.setSelectedSantri);
export const useClearSelectedSantri = () => useSantriStore((state) => state.clearSelectedSantri);

export const useAddKartu = () => useSantriStore((state) => state.addKartu);
export const useGetKartu = () => useSantriStore((state) => state.getKartu);
export const useGetKartuById = () => useSantriStore((state) => state.getKartuById);
export const useDeleteKartu = () => useSantriStore((state) => state.deleteKartu);
export const useSortKartuByDate = () => useSantriStore((state) => state.sortKartuByDate);
export const useGetLatestKartu = () => useSantriStore((state) => state.getLatestKartu);
export const useGetLatestKartuForAllSantri = () => useSantriStore((state) => state.getLatestKartuForAllSantri);

export const useSetSantriLoading = () => useSantriStore((state) => state.setLoading);
export const useSetSantriError = () => useSantriStore((state) => state.setError);
export const useClearSantriError = () => useSantriStore((state) => state.clearError);