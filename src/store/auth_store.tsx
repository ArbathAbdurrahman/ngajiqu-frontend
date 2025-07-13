import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
    id: string;
    email: string;
    name: string;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuth: boolean;
    isLoading: boolean;
    error: string | null;
}

interface RegiseterData {
    username: string;
    email: string;
    password1: string;
    password2: string;

}

interface AuthActions {
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (userdata: RegiseterData) => Promise<void>;
    refreshTokens: () => Promise<void>;
    initializeAuth: () => Promise<void>;
    clearErorr: () => void;
    setLoading: (loading: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const API_BASE_URL = process.env.NODE_ENV === 'development'
    ? '/api'  // Menggunakan proxy Next.js
    : process.env.NEXT_PUBLIC_API_URL; // Production URL


// Utility functions to get tokens from cookies
const getAccessTokenFromCookie = (): string | null => {
    if (typeof document === 'undefined') return null;

    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('accessToken='));

    if (tokenCookie) {
        return tokenCookie.split('=')[1];
    }

    return null;
};

const getRefreshTokenFromCookie = (): string | null => {
    if (typeof document === 'undefined') return null;

    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('refreshToken='));

    if (tokenCookie) {
        return tokenCookie.split('=')[1];
    }

    return null;
};

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuth: false,
            isLoading: false,
            error: null,

            login: async (email: string, password: string) => {
                try {
                    set({ isLoading: true, error: null })

                    //fetch api
                    const response = await fetch(`${API_BASE_URL}/akun/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email, password }),
                    });

                    console.log('Response status:', response.status); // Debug log
                    console.log('Response ok:', response.ok); // Debug log

                    if (!response.ok) {
                        throw new Error("Login failed");
                    }

                    //response data
                    const data = await response.json();

                    // Handle API response format (API returns 'access' and 'refresh' keys)
                    const accessToken = data.access;
                    const refreshToken = data.refresh;

                    //set response data
                    set({
                        user: data.user,
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        isAuth: true,
                        isLoading: false,
                        error: null,
                    });

                    // Set cookies with both tokens
                    if (accessToken) {
                        document.cookie = `accessToken=${accessToken}; path=/; secure; samesite=strict`;
                    }
                    if (refreshToken) {
                        document.cookie = `refreshToken=${refreshToken}; path=/; secure; samesite=strict`;
                    }

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
                    const response = await fetch(`${API_BASE_URL}/akun/register`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(userData),
                    });

                    if (!response.ok) {
                        throw new Error("Registration failed");
                    }

                    //response data
                    const data = await response.json();

                    // Handle API response format (API returns 'access' and 'refresh' keys)
                    const accessToken = data.access;
                    const refreshToken = data.refresh;

                    //set response data
                    set({
                        user: data.user,
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        isAuth: true,
                        isLoading: false,
                        error: null,
                    });

                    // Set cookies with both tokens
                    if (accessToken) {
                        document.cookie = `accessToken=${accessToken}; path=/; secure; samesite=strict`;
                    }
                    if (refreshToken) {
                        document.cookie = `refreshToken=${refreshToken}; path=/; secure; samesite=strict`;
                    }

                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : "Registration failed",
                        isLoading: false,
                    });
                }
            },

            logout: async () => {
                try {
                    const { accessToken } = get();

                    // Only make API call if we have an access token
                    if (accessToken) {
                        const response = await fetch(`${API_BASE_URL}/akun/logout`, {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${accessToken}`,
                                'Content-Type': 'application/json',
                            },
                        });

                        // Continue with logout even if API call fails
                        if (!response.ok) {
                            console.warn('Logout API call failed, but continuing with local logout');
                        }
                    }
                } catch (error) {
                    console.warn('Logout API call error:', error);
                    // Continue with logout even if API call fails
                }

                // Always clear local state regardless of API response
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuth: false,
                    error: null,
                });

                // Clear both cookies
                document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            },

            refreshTokens: async () => {
                try {
                    const { refreshToken } = get();

                    if (!refreshToken) {
                        throw new Error('No refresh token available');
                    }

                    set({ isLoading: true, error: null });

                    const response = await fetch(`${API_BASE_URL}/akun/refresh`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${refreshToken}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!response.ok) {
                        throw new Error(`Refresh failed with status: ${response.status}`);
                    }

                    const data = await response.json();

                    // Handle API response format (API returns 'access' and 'refresh' keys)
                    const newAccessToken = data.access;
                    const newRefreshToken = data.refresh;

                    // Update state with new tokens and user data
                    set({
                        accessToken: newAccessToken,
                        refreshToken: newRefreshToken,
                        user: data.user,
                        isAuth: true,
                        isLoading: false,
                        error: null,
                    });

                    // Update cookies with new tokens
                    if (newAccessToken) {
                        document.cookie = `accessToken=${newAccessToken}; path=/; secure; samesite=strict`;
                    }
                    if (newRefreshToken) {
                        document.cookie = `refreshToken=${newRefreshToken}; path=/; secure; samesite=strict`;
                    }

                } catch (error) {
                    console.error('Token refresh failed:', error);

                    // Clear state and redirect to login
                    set({
                        user: null,
                        accessToken: null,
                        refreshToken: null,
                        isAuth: false,
                        isLoading: false,
                        error: error instanceof Error ? error.message : 'Token refresh failed',
                    });

                    // Clear cookies
                    document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                }
            },

            initializeAuth: async () => {
                try {
                    let { accessToken, refreshToken, isAuth } = get();

                    // If no tokens in state, try to get from cookies
                    if (!accessToken || !refreshToken) {
                        const cookieAccessToken = getAccessTokenFromCookie();
                        const cookieRefreshToken = getRefreshTokenFromCookie();

                        if (cookieAccessToken && cookieRefreshToken) {
                            set({
                                accessToken: cookieAccessToken,
                                refreshToken: cookieRefreshToken
                            });
                            accessToken = cookieAccessToken;
                            refreshToken = cookieRefreshToken;
                        }
                    }

                    // If still no tokens, return early
                    if (!accessToken || !refreshToken) {
                        return;
                    }

                    // Try to refresh tokens to validate current session
                    await get().refreshTokens();

                } catch (error) {
                    console.error('Auth initialization failed:', error);
                    // Clear auth state if initialization fails
                    set({
                        user: null,
                        accessToken: null,
                        refreshToken: null,
                        isAuth: false,
                        error: null,
                    });

                    // Clear cookies
                    document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                }
            },

            clearErorr: () => set({ error: null }),

            setLoading: (loading: boolean) => set({ isLoading: loading }),
        }),
        {
            name: 'auth-store',
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAuth: state.isAuth,
            }),
        }
    )
);

//selectors
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuth = () => useAuthStore((state) => state.isAuth);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAccessToken = () => useAuthStore((state) => state.accessToken);
export const useRefreshToken = () => useAuthStore((state) => state.refreshToken);

// Actions selector
export const useAuthActions = () => ({
    login: useAuthStore((state) => state.login),
    logout: useAuthStore((state) => state.logout),
    register: useAuthStore((state) => state.register),
    refreshTokens: useAuthStore((state) => state.refreshTokens),
    initializeAuth: useAuthStore((state) => state.initializeAuth),
    clearError: useAuthStore((state) => state.clearErorr),
    setLoading: useAuthStore((state) => state.setLoading),
});

/*
Usage Example:

// In your app layout or main component:
import { useAuthActions } from '@/store/auth_store';

function App() {
    const { initializeAuth } = useAuthActions();
    
    useEffect(() => {
        // Initialize auth on app start
        initializeAuth();
    }, []);
    
    return <YourAppContent />;
}

// In login component:
import { useAuthActions, useAuthLoading, useAuthError } from '@/store/auth_store';

function LoginPage() {
    const { login } = useAuthActions();
    const isLoading = useAuthLoading();
    const error = useAuthError();
    
    const handleLogin = async (email: string, password: string) => {
        await login(email, password);
        // Login now returns both accessToken and refreshToken
    };
    
    return <LoginForm onSubmit={handleLogin} loading={isLoading} error={error} />;
}

// In any protected component:
import { useIsAuth, useUser, useAuthActions, useAccessToken } from '@/store/auth_store';

function ProtectedComponent() {
    const isAuth = useIsAuth();
    const user = useUser();
    const accessToken = useAccessToken();
    const { logout, refreshTokens } = useAuthActions();
    
    if (!isAuth) {
        return <Redirect to="/login" />;
    }
    
    return (
        <div>
            <h1>Welcome, {user?.name}!</h1>
            <button onClick={logout}>Logout</button>
            <button onClick={refreshTokens}>Refresh Tokens</button>
        </div>
    );
}

// API calls with access token:
function makeAuthenticatedRequest() {
    const accessToken = useAccessToken();
    
    return fetch('/api/protected-endpoint', {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });
}

Expected API Response Format:
// Login & Register response:
{
    user: { id: string, email: string, name: string },
    accessToken: string,  // Short-lived token for API requests
    refreshToken: string  // Long-lived token for getting new access tokens
}

// Refresh response:
{
    user: { id: string, email: string, name: string },
    accessToken: string,  // New access token
    refreshToken: string  // New refresh token (optional, can be same)
}
*/