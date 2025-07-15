import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
    id: string;
    email: string;
    name: string;
    username?: string;
    description?: string;
}

interface UserProfile {
    user: {
        username: string;
        first_name: string;
        last_name: string;
        email: string;
    };
    description: string;
    profile_image: string | null;
    address: string;
    contact: string;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuth: boolean;
    isLoading: boolean;
    error: string | null;
    userProfile: UserProfile | null;
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
    getUser: () => Promise<void>;
    patchUsername: (username: string) => Promise<void>;
    patchDescription: (description: string) => Promise<void>;
    patchEmail: (email: string) => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL; // Production URL


// Utility functions to get tokens from localStorage
const getAccessTokenFromStorage = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
};

const getRefreshTokenFromStorage = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refreshToken');
};

// Utility functions to set/remove cookies for middleware
const setCookie = (name: string, value: string, days: number = 7) => {
    if (typeof document === 'undefined') return;
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

const removeCookie = (name: string) => {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax`;
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
            userProfile: null,

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
                        // Parse error message from API response
                        let errorMessage = "Login failed";
                        try {
                            const errorData = await response.json();
                            // Check common API error message fields
                            if (errorData.detail) {
                                errorMessage = errorData.detail;
                            } else if (errorData.message) {
                                errorMessage = errorData.message;
                            } else if (errorData.error) {
                                errorMessage = errorData.error;
                            } else if (typeof errorData === 'string') {
                                errorMessage = errorData;
                            }
                        } catch (parseError) {
                            console.log('Could not parse error response:', parseError);
                        }
                        throw new Error(errorMessage);
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

                    // Store tokens in localStorage and cookies
                    if (accessToken) {
                        localStorage.setItem('accessToken', accessToken);
                        setCookie('accessToken', accessToken);
                    }
                    if (refreshToken) {
                        localStorage.setItem('refreshToken', refreshToken);
                        setCookie('refreshToken', refreshToken);
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

                    // Debug: Log data yang akan dikirim
                    console.log('🚀 Registration data being sent:', userData);
                    console.log('🌐 API URL:', `${API_BASE_URL}/akun/register`);

                    //fetch api
                    const response = await fetch(`${API_BASE_URL}/akun/register`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(userData),
                    });

                    console.log('📡 Response status:', response.status);
                    console.log('📡 Response headers:', response.headers);
                    console.log('📡 Response ok:', response.ok);


                    if (!response.ok) {
                        // Parse error message from API response
                        let errorMessage = "Registration failed";
                        try {
                            const errorData = await response.json();
                            console.log('❌ Full error response:', errorData); // Debug log

                            // Check common API error message fields
                            if (errorData.detail) {
                                errorMessage = errorData.detail;
                            } else if (errorData.message) {
                                errorMessage = errorData.message;
                            } else if (errorData.error) {
                                errorMessage = errorData.error;
                            } else if (typeof errorData === 'string') {
                                errorMessage = errorData;
                            } else if (typeof errorData === 'object') {
                                // Handle field-specific errors like { "username": ["A user with that username already exists."] }
                                const fieldErrors = [];
                                for (const [field, errors] of Object.entries(errorData)) {
                                    if (Array.isArray(errors)) {
                                        fieldErrors.push(`${field}: ${errors.join(', ')}`);
                                    } else if (typeof errors === 'string') {
                                        fieldErrors.push(`${field}: ${errors}`);
                                    }
                                }
                                if (fieldErrors.length > 0) {
                                    errorMessage = fieldErrors.join('; ');
                                }
                            }
                        } catch (parseError) {
                            console.log('Could not parse error response:', parseError);
                            console.log(parseError);
                            errorMessage = `Registration failed (Status: ${response.status})`;
                        }
                        console.log('❌ Final error message:', errorMessage);
                        throw new Error(errorMessage);
                    }

                    //response data - only contains success message
                    const data = await response.json();
                    console.log('Registration response:', data); // Debug log

                    // Registration successful - just clear loading state
                    // User needs to login separately after registration
                    set({
                        isLoading: false,
                        error: null,
                    });

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
                    userProfile: null,
                });

                // Clear both tokens from localStorage and cookies
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('selectedKelas');
                    localStorage.removeItem('selectedSantri');
                }

                // Clear cookies
                removeCookie('accessToken');
                removeCookie('refreshToken');

                // Force page reload to ensure complete cleanup - redirect to root
                if (typeof window !== 'undefined') {
                    window.location.href = '/';
                }
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

                    // Update localStorage and cookies with new tokens
                    if (newAccessToken) {
                        localStorage.setItem('accessToken', newAccessToken);
                        setCookie('accessToken', newAccessToken);
                    }
                    if (newRefreshToken) {
                        localStorage.setItem('refreshToken', newRefreshToken);
                        setCookie('refreshToken', newRefreshToken);
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

                    // Clear localStorage and cookies
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    removeCookie('accessToken');
                    removeCookie('refreshToken');
                }
            },

            initializeAuth: async () => {
                try {
                    set({ isLoading: true, error: null });

                    let { accessToken, refreshToken } = get();

                    // If no tokens in state, try to get from localStorage
                    if (!accessToken || !refreshToken) {
                        const storageAccessToken = getAccessTokenFromStorage();
                        const storageRefreshToken = getRefreshTokenFromStorage();

                        if (storageAccessToken && storageRefreshToken) {
                            set({
                                accessToken: storageAccessToken,
                                refreshToken: storageRefreshToken
                            });
                            accessToken = storageAccessToken;
                            refreshToken = storageRefreshToken;
                        }
                    }

                    // If still no tokens, return early
                    if (!accessToken || !refreshToken) {
                        set({ isLoading: false });
                        return;
                    }

                    // Validate access token first by making a test API call
                    console.log('🔐 Validating access token...');
                    const testResponse = await fetch(`${API_BASE_URL}/akun/`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (testResponse.ok) {
                        // Access token is valid, get user data
                        const userData = await testResponse.json();
                        set({
                            userProfile: userData,
                            user: {
                                id: userData.user.username, // Use username as ID since API doesn't provide separate ID
                                username: userData.user.username,
                                email: userData.user.email,
                                name: `${userData.user.first_name} ${userData.user.last_name}`.trim(),
                                description: userData.description,
                            },
                            isAuth: true,
                            isLoading: false,
                            error: null,
                        });
                        console.log('✅ Access token is valid, user authenticated');
                        return;
                    }

                    // Access token is invalid, try to refresh
                    console.log('⚠️ Access token invalid, attempting refresh...');
                    const refreshResponse = await fetch(`${API_BASE_URL}/akun/refresh`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${refreshToken}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!refreshResponse.ok) {
                        console.log('❌ Refresh token also invalid, clearing auth state');
                        throw new Error('Both access and refresh tokens are invalid');
                    }

                    // Refresh successful, get new tokens
                    const refreshData = await refreshResponse.json();
                    const newAccessToken = refreshData.access;
                    const newRefreshToken = refreshData.refresh;

                    // Update state with new tokens
                    set({
                        accessToken: newAccessToken,
                        refreshToken: newRefreshToken,
                        isAuth: true,
                        isLoading: false,
                        error: null,
                    });

                    // Update localStorage and cookies with new tokens
                    if (newAccessToken) {
                        localStorage.setItem('accessToken', newAccessToken);
                        setCookie('accessToken', newAccessToken);
                    }
                    if (newRefreshToken) {
                        localStorage.setItem('refreshToken', newRefreshToken);
                        setCookie('refreshToken', newRefreshToken);
                    }

                    // Get user data with new access token
                    const userResponse = await fetch(`${API_BASE_URL}/akun/`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${newAccessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (userResponse.ok) {
                        const userData = await userResponse.json();
                        set(() => ({
                            userProfile: userData,
                            user: {
                                id: userData.user.username,
                                username: userData.user.username,
                                email: userData.user.email,
                                name: `${userData.user.first_name} ${userData.user.last_name}`.trim(),
                                description: userData.description,
                            },
                            isAuth: true,
                        }));
                        console.log('✅ Token refreshed successfully, user authenticated');
                    }

                } catch (error) {
                    console.error('❌ Auth initialization failed:', error);

                    // Clear all auth state and storage on any failure
                    set({
                        user: null,
                        accessToken: null,
                        refreshToken: null,
                        isAuth: false,
                        isLoading: false,
                        error: null,
                        userProfile: null,
                    });

                    // Clear localStorage and cookies
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                        localStorage.removeItem('selectedKelas');
                        localStorage.removeItem('selectedSantri');
                    }
                    removeCookie('accessToken');
                    removeCookie('refreshToken');

                    console.log('🔄 Auth state cleared due to invalid tokens');
                }
            },

            clearErorr: () => set({ error: null }),

            setLoading: (loading: boolean) => set({ isLoading: loading }),

            // Get user profile
            getUser: async () => {
                try {
                    const { accessToken } = get();

                    if (!accessToken) {
                        throw new Error('No access token available');
                    }

                    set({ isLoading: true, error: null });

                    const response = await fetch(`${API_BASE_URL}/akun/`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!response.ok) {
                        throw new Error(`Failed to get user profile: ${response.status}`);
                    }

                    const profileData: UserProfile = await response.json();

                    // Update user state with profile data
                    set((state) => ({
                        userProfile: profileData,
                        user: {
                            ...state.user,
                            username: profileData.user.username,
                            email: profileData.user.email,
                            description: profileData.description,
                        } as User,
                        isLoading: false,
                        error: null,
                    }));

                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to get user profile',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            // Update username
            patchUsername: async (username: string) => {
                try {
                    const { accessToken } = get();

                    if (!accessToken) {
                        throw new Error('No access token available');
                    }

                    set({ isLoading: true, error: null });

                    const response = await fetch(`${API_BASE_URL}/akun/`, {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            user: {
                                username: username
                            }
                        }),
                    });

                    if (!response.ok) {
                        throw new Error(`Failed to update username: ${response.status}`);
                    }

                    const updatedData = await response.json();

                    // Update user state - menggunakan struktur response yang benar
                    set((state) => ({
                        user: {
                            ...state.user,
                            username: updatedData.user?.username || username,
                        } as User,
                        userProfile: state.userProfile ? {
                            ...state.userProfile,
                            user: {
                                ...state.userProfile.user,
                                username: updatedData.user?.username || username,
                            }
                        } : null,
                        isLoading: false,
                        error: null,
                    }));

                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to update username',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            // Update description
            patchDescription: async (description: string) => {
                try {
                    const { accessToken } = get();

                    if (!accessToken) {
                        throw new Error('No access token available');
                    }

                    set({ isLoading: true, error: null });

                    const response = await fetch(`${API_BASE_URL}/akun/`, {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ description }),
                    });

                    if (!response.ok) {
                        throw new Error(`Failed to update description: ${response.status}`);
                    }

                    const updatedData = await response.json();

                    // Update user state
                    set((state) => ({
                        user: {
                            ...state.user,
                            description: updatedData.description || description,
                        } as User,
                        userProfile: state.userProfile ? {
                            ...state.userProfile,
                            description: updatedData.description || description,
                        } : null,
                        isLoading: false,
                        error: null,
                    }));

                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to update description',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            // Update email
            patchEmail: async (email: string) => {
                try {
                    const { accessToken } = get();

                    if (!accessToken) {
                        throw new Error('No access token available');
                    }

                    set({ isLoading: true, error: null });

                    const response = await fetch(`${API_BASE_URL}/akun/`, {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            user: {
                                email: email
                            }
                        }),
                    });

                    if (!response.ok) {
                        throw new Error(`Failed to update email: ${response.status}`);
                    }

                    const updatedData = await response.json();

                    // Update user state - menggunakan struktur response yang benar
                    set((state) => ({
                        user: {
                            ...state.user,
                            email: updatedData.user?.email || email,
                        } as User,
                        userProfile: state.userProfile ? {
                            ...state.userProfile,
                            user: {
                                ...state.userProfile.user,
                                email: updatedData.user?.email || email,
                            }
                        } : null,
                        isLoading: false,
                        error: null,
                    }));

                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to update email',
                        isLoading: false,
                    });
                    throw error;
                }
            },
        }),
        {
            name: 'auth-store',
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAuth: state.isAuth,
                userProfile: state.userProfile,
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
export const useUserProfile = () => useAuthStore((state) => state.userProfile);

// Actions selector
export const useAuthActions = () => ({
    login: useAuthStore((state) => state.login),
    logout: useAuthStore((state) => state.logout),
    register: useAuthStore((state) => state.register),
    refreshTokens: useAuthStore((state) => state.refreshTokens),
    initializeAuth: useAuthStore((state) => state.initializeAuth),
    clearError: useAuthStore((state) => state.clearErorr),
    setLoading: useAuthStore((state) => state.setLoading),
    getUser: useAuthStore((state) => state.getUser),
    patchUsername: useAuthStore((state) => state.patchUsername),
    patchDescription: useAuthStore((state) => state.patchDescription),
    patchEmail: useAuthStore((state) => state.patchEmail),
});


