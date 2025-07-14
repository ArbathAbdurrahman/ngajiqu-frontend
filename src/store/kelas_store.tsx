import { create } from "zustand";
import { useMemo } from "react";

// Helper function untuk generate slug dari nama
const generateSlugFromNama = (nama: string): string => {
    return nama
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-') // Ganti spasi dengan tanda hubung
        .replace(/[^a-z0-9-]/g, '') // Hapus karakter khusus selain huruf, angka, dan tanda hubung
        .replace(/-+/g, '-') // Ganti multiple tanda hubung dengan satu
        .replace(/^-|-$/g, ''); // Hapus tanda hubung di awal dan akhir
};

// Helper function untuk validasi slug
const validateSlug = (slug: string): { isValid: boolean; error?: string } => {
    if (!slug || slug.trim() === '') {
        return { isValid: false, error: 'Slug tidak boleh kosong.' };
    }

    if (slug.includes(' ')) {
        return { isValid: false, error: 'Slug tidak boleh mengandung spasi. Gunakan tanda hubung (-) atau underscore (_) sebagai pengganti.' };
    }

    const slugPattern = /^[a-zA-Z0-9-_]+$/;
    if (!slugPattern.test(slug)) {
        return { isValid: false, error: 'Slug hanya boleh mengandung huruf, angka, tanda hubung (-), dan underscore (_).' };
    }

    return { isValid: true };
};

// Helper function untuk mendapatkan auth headers
const getAuthHeaders = async (): Promise<Record<string, string>> => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    try {
        const accessToken = localStorage.getItem('accessToken');

        console.log(accessToken);

        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }
        // Dynamic import untuk menghindari circular dependency
        console.log(headers);
    } catch (error) {
        console.warn('Failed to get auth token:', error);
    }

    return headers;
};

// Helper functions untuk localStorage persistence
const getSelectedKelasFromStorage = (): Kelas | null => {
    try {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('selectedKelas');
            return stored ? JSON.parse(stored) : null;
        }
    } catch (error) {
        console.warn('Failed to get selectedKelas from localStorage:', error);
    }
    return null;
};

const saveSelectedKelasToStorage = (kelas: Kelas | null): void => {
    try {
        if (typeof window !== 'undefined') {
            if (kelas) {
                localStorage.setItem('selectedKelas', JSON.stringify(kelas));
            } else {
                localStorage.removeItem('selectedKelas');
            }
        }
    } catch (error) {
        console.warn('Failed to save selectedKelas to localStorage:', error);
    }
};

interface Kelas {
    id: string;
    nama: string;
    deskripsi?: string;
    slug: string;
    author?: number;
    santri_count?: number;
}

interface KelasState {
    kelasList: Kelas[];
    selectedKelas: Kelas | null;
    loading: boolean;
    error: string | null;
}

interface KelasAction {
    addKelas: ({ nama, slug, deskripsi }: Omit<Kelas, 'id' | 'link'>) => Promise<void>;
    getKelas: () => Promise<void>;
    getKelasById: (id: string) => Promise<void>;
    getKelasBySlug: (slug: string) => Promise<void>;
    editKelas: (slug: string, data: Partial<Kelas>) => Promise<void>;
    deleteKelas: (slug: string) => Promise<void>;
    setSelectedKelas: (kelas: Kelas | null) => void;
    clearSelectedKelas: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
    generateSlug: (nama: string) => string;
    validateSlugInput: (slug: string) => { isValid: boolean; error?: string };
}

type KelasStore = KelasState & KelasAction;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const useKelasStore = create<KelasStore>((set) => ({
    // Initial State with localStorage persistence
    kelasList: [],
    selectedKelas: getSelectedKelasFromStorage(),
    loading: false,
    error: null,

    // Actions
    setLoading: (loading: boolean) => set({ loading }),
    setError: (error: string | null) => set({ error }),
    clearError: () => set({ error: null }),
    setSelectedKelas: (kelas: Kelas | null) => {
        set({ selectedKelas: kelas });
        saveSelectedKelasToStorage(kelas);
    },

    clearSelectedKelas: () => {
        set({ selectedKelas: null });
        saveSelectedKelasToStorage(null);
    },

    // Utility actions for slug handling
    generateSlug: (nama: string) => generateSlugFromNama(nama),
    validateSlugInput: (slug: string) => validateSlug(slug),

    // Add new kelas
    addKelas: async ({ nama, slug, deskripsi }) => {
        try {
            set({ loading: true, error: null });

            // Validasi slug menggunakan helper function
            const slugValidation = validateSlug(slug);
            if (!slugValidation.isValid) {
                throw new Error(slugValidation.error);
            }

            const headers = await getAuthHeaders();

            console.log(headers);

            const response = await fetch(`${API_BASE_URL}/kelas/kelas/`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    nama,
                    deskripsi,
                    slug,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Response berisi format API yang benar sesuai dengan GET kelas
            const responseData = await response.json();
            console.log(responseData);

            // Mapping response ke format Kelas yang konsisten dengan getKelas
            const newKelas: Kelas = {
                id: responseData.id.toString(), // Pastikan id berupa string
                nama: responseData.nama || nama,
                deskripsi: responseData.deskripsi || deskripsi,
                slug: responseData.slug || slug,
                author: responseData.author,
                santri_count: responseData.santri_count || 0,
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

            const headers = {
                'Content-Type': 'application/json',
            };

            const response = await fetch(`${API_BASE_URL}/kelas/kelas`, {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Authentication required. Please login again.');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Response berisi format paginated: { count, next, previous, results: [...] }
            const kelasResponse = await response.json();

            // Ambil data dari results array dan mapping ke format Kelas
            const kelasList: Kelas[] = kelasResponse.results.map((kelas: { id: string; nama: string; deskripsi?: string; slug: string; author: number; santri_count: number }) => ({
                id: kelas.id.toString(), // Konversi id ke string
                nama: kelas.nama,
                alamat: '', // API tidak mengembalikan alamat, set default kosong
                deskripsi: kelas.deskripsi || '',
                slug: kelas.slug, // Gunakan slug sebagai link
                author: kelas.author,
                santri_count: kelas.santri_count,
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

            const headers = {
                'Content-Type': 'application/json',
            };

            const response = await fetch(`${API_BASE_URL}/kelas/${id}`, {
                method: 'GET',
                headers,
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

    // Get kelas by slug
    getKelasBySlug: async (slug: string) => {
        try {
            set({ loading: true, error: null });

            const headers = {
                'Content-Type': 'application/json',
            };

            const response = await fetch(`${API_BASE_URL}/kelas/kelas/${slug}`, {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(`Kelas dengan kode '${slug}' tidak ditemukan.`);
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const kelasData = await response.json();

            // Mapping response ke format Kelas yang konsisten
            const kelas: Kelas = {
                id: kelasData.id.toString(),
                nama: kelasData.nama,
                deskripsi: kelasData.deskripsi || '',
                slug: kelasData.slug,
                author: kelasData.author,
                santri_count: kelasData.santri_count || 0,
            };

            set({
                selectedKelas: kelas,
                loading: false,
            });

            // Also save to localStorage for persistence
            saveSelectedKelasToStorage(kelas);

        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch kelas by code',
                loading: false,
            });
            throw error;
        }
    },

    // Edit kelas
    editKelas: async (slug: string, data: Partial<Kelas>) => {
        try {
            set({ loading: true, error: null });

            const headers = await getAuthHeaders();

            const response = await fetch(`${API_BASE_URL}/kelas/kelas/${slug}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const updatedKelas = await response.json();

            // Mapping response ke format Kelas yang konsisten
            const kelasData: Kelas = {
                id: updatedKelas.id.toString(),
                nama: updatedKelas.nama,
                deskripsi: updatedKelas.deskripsi || '',
                slug: updatedKelas.slug,
                author: updatedKelas.author,
                santri_count: updatedKelas.santri_count || 0,
            };

            set((state) => {
                const updatedState = {
                    kelasList: state.kelasList.map((kelas) =>
                        kelas.slug === slug ? kelasData : kelas
                    ),
                    selectedKelas: state.selectedKelas?.slug === slug ? kelasData : state.selectedKelas,
                    loading: false,
                };

                // Also save to localStorage if this is the selected kelas
                if (state.selectedKelas?.slug === slug) {
                    saveSelectedKelasToStorage(kelasData);
                }

                return updatedState;
            });

        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to update kelas',
                loading: false,
            });
            throw error;
        }
    },

    // Delete kelas
    deleteKelas: async (slug: string) => {
        try {
            set({ loading: true, error: null });

            const headers = await getAuthHeaders();

            const response = await fetch(`${API_BASE_URL}/kelas/kelas/${slug}`, {
                method: 'DELETE',
                headers,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            set((state) => ({
                kelasList: state.kelasList.filter((kelas) => kelas.slug !== slug),
                selectedKelas: state.selectedKelas?.slug === slug ? null : state.selectedKelas,
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

// GANTI dengan individual selectors:
export const useKelasList = () => useKelasStore((state) => state.kelasList);
export const useKelasLoading = () => useKelasStore((state) => state.loading);
export const useKelasError = () => useKelasStore((state) => state.error);
export const useSelectedKelas = () => useKelasStore((state) => state.selectedKelas);

// Individual action selectors to avoid infinite loop
export const useAddKelas = () => useKelasStore((state) => state.addKelas);
export const useGetKelas = () => useKelasStore((state) => state.getKelas);
export const useGetKelasById = () => useKelasStore((state) => state.getKelasById);
export const useGetKelasBySlug = () => useKelasStore((state) => state.getKelasBySlug);
export const useEditKelas = () => useKelasStore((state) => state.editKelas);
export const useDeleteKelas = () => useKelasStore((state) => state.deleteKelas);
export const useSetSelectedKelas = () => useKelasStore((state) => state.setSelectedKelas);
export const useClearSelectedKelas = () => useKelasStore((state) => state.clearSelectedKelas);
export const useSetKelasLoading = () => useKelasStore((state) => state.setLoading);
export const useSetKelasError = () => useKelasStore((state) => state.setError);
export const useClearKelasError = () => useKelasStore((state) => state.clearError);
export const useGenerateSlug = () => useKelasStore((state) => state.generateSlug);
export const useValidateSlugInput = () => useKelasStore((state) => state.validateSlugInput);

// Alternative: Cached version of useKelasActions using useMemo
export const useKelasActions = () => {
    const addKelas = useKelasStore((state) => state.addKelas);
    const getKelas = useKelasStore((state) => state.getKelas);
    const getKelasById = useKelasStore((state) => state.getKelasById);
    const getKelasBySlug = useKelasStore((state) => state.getKelasBySlug);
    const editKelas = useKelasStore((state) => state.editKelas);
    const deleteKelas = useKelasStore((state) => state.deleteKelas);
    const setSelectedKelas = useKelasStore((state) => state.setSelectedKelas);
    const clearSelectedKelas = useKelasStore((state) => state.clearSelectedKelas);
    const setLoading = useKelasStore((state) => state.setLoading);
    const setError = useKelasStore((state) => state.setError);
    const clearError = useKelasStore((state) => state.clearError);
    const generateSlug = useKelasStore((state) => state.generateSlug);
    const validateSlugInput = useKelasStore((state) => state.validateSlugInput);

    return useMemo(() => ({
        addKelas,
        getKelas,
        getKelasById,
        getKelasBySlug,
        editKelas,
        deleteKelas,
        setSelectedKelas,
        clearSelectedKelas,
        setLoading,
        setError,
        clearError,
        generateSlug,
        validateSlugInput,
    }), [addKelas, getKelas, getKelasById, getKelasBySlug, editKelas, deleteKelas, setSelectedKelas, clearSelectedKelas, setLoading, setError, clearError, generateSlug, validateSlugInput]);
};