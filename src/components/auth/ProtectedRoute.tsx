'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIsAuth, useAuthLoading, useAuthActions } from '@/store/auth_store';

interface ProtectedRouteProps {
    children: React.ReactNode;
    redirectTo?: string;
}

export default function ProtectedRoute({
    children,
    redirectTo = '/login'
}: ProtectedRouteProps) {
    const router = useRouter();
    const isAuth = useIsAuth();
    const isLoading = useAuthLoading();
    const { initializeAuth } = useAuthActions();

    useEffect(() => {
        // Initialize auth on component mount
        initializeAuth();
    }, [initializeAuth]);

    useEffect(() => {
        // Check authentication after initialization completes
        if (!isLoading && !isAuth) {
            console.log('🔒 Not authenticated, redirecting to login');
            // Get current path for redirect after login
            const currentPath = window.location.pathname;
            const loginUrl = `${redirectTo}?redirectTo=${encodeURIComponent(currentPath)}`;
            router.push(loginUrl);
        }
    }, [isAuth, isLoading, router, redirectTo]);

    // Show loading while checking auth
    if (isLoading || (!isAuth && !isLoading)) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#E8F5E9]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C8B560] mx-auto mb-4"></div>
                    <p className="text-gray-600">Memvalidasi akses...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
