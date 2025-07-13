'use client'

import { useIsAuth, useAuthLoading } from '@/store/auth_store';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Hook for handling authentication redirects after login
 * Automatically redirects to intended destination or dashboard
 */
export function useAuthRedirect() {
    const isAuth = useIsAuth();
    const isLoading = useAuthLoading();
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!isLoading && isAuth) {
            // Get the redirect URL from search params, default to dashboard
            const redirectTo = searchParams.get('redirectTo') || '/dashboard';

            // Use router.replace to clean the URL (removes query params)
            router.replace(redirectTo);
        }
    }, [isAuth, isLoading, router, searchParams]);

    return { isAuth, isLoading };
}

/**
 * Hook for protected routes
 * Redirects unauthenticated users to login with current path as redirect parameter
 */
export function useProtectedRoute() {
    const isAuth = useIsAuth();
    const isLoading = useAuthLoading();
    const router = useRouter();
    const [hasRedirected, setHasRedirected] = useState(false);

    useEffect(() => {
        if (!isLoading && !isAuth && !hasRedirected) {
            // Get current path for redirect after login
            const currentPath = window.location.pathname + window.location.search;
            const loginUrl = `/login?redirectTo=${encodeURIComponent(currentPath)}`;

            setHasRedirected(true);
            router.replace(loginUrl);
        }
    }, [isAuth, isLoading, router, hasRedirected]);

    return {
        isAuth,
        isLoading: isLoading || (!isAuth && !hasRedirected)
    };
}

/**
 * Hook for guest-only routes (login, register)
 * Redirects authenticated users to dashboard
 */
export function useGuestRoute() {
    const isAuth = useIsAuth();
    const isLoading = useAuthLoading();
    const router = useRouter();
    const [hasRedirected, setHasRedirected] = useState(false);

    useEffect(() => {
        if (!isLoading && isAuth && !hasRedirected) {
            setHasRedirected(true);

            // Check if there's a redirectTo parameter
            const searchParams = new URLSearchParams(window.location.search);
            const redirectTo = searchParams.get('redirectTo') || '/dashboard';

            // Clean redirect - removes all query parameters
            router.replace(redirectTo);
        }
    }, [isAuth, isLoading, router, hasRedirected]);

    return {
        isAuth,
        isLoading: isLoading || (isAuth && !hasRedirected)
    };
}
