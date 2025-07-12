import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
    id: string;
    email: string;
    name: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuth: boolean;
    isLoading: boolean;
    error: string | null;
}

interface RegiseterData {
    email: string;
    name: string;
    password: string;
}

interface AuthActions {
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    register: (userdata: RegiseterData) => Promise<void>;
    refreshToken: () => Promise<void>;
    clearErorr: () => void;
    setLoading: (loading: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuth: false,
            isLoading: false,
            error: null,

            login: async (email: string, password: string) => {
                try {
                    set({ isLoading: true, error: null })

                    //fetch api
                    const response = await fetch('/api/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email, password }),
                    });

                    if (!response.ok) {
                        throw new Error("Login failed");
                    }

                    //response data
                    const data = await response.json();

                    //set response data
                    set({
                        user: data.user,
                        token: data.token,
                        isAuth: true,
                        isLoading: false,
                        error: null,
                    });

                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Login failed',
                        isLoading: false,
                        isAuth: false,
                    });
                }
            },

            register: async (userData: RegiseterData) => {
                try {
                    set({
                        isLoading: true, error: null
                    });

                    //fetch api
                    const response = await fetch('/api/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userData }),
                    });

                    if (!response.ok) {
                        throw new Error("Login failed");
                    }

                    //response data
                    const data = await response.json();

                    //set response data
                    set({
                        user: data.user,
                        token: data.token,
                        isAuth: true,
                        isLoading: false,
                        error: null,
                    });

                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : "Login failed",
                        isLoading: false,
                    });
                }
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    isAuth: false,
                    error: null,
                })

                document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
            },

            refreshToken: async () => {
                try {
                    const { token } = get();

                    if (!token) return;

                    const response = await fetch('/api/auth/refresh', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Error refresh failed')
                    }

                    const data = await response.json();

                    set({
                        token: data.token,
                        user: data.user,
                        isAuth: true,
                    })

                } catch (error) {
                    console.log('Token refresh failed:', error);
                    //if user fails, logout user
                    get().logout();
                }
            },

            clearErorr: () => set({ error: null }),

            setLoading: (loading: boolean) => set({ isLoading: loading }),
        }),
        {
            name: 'auth-store',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuth: state.isAuth,
            }),
        }
    )
);

//selector
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuth = () => useAuthStore((state) => state.isAuth);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);