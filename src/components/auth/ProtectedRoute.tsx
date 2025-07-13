'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIsAuth, useAuthActions } from '@/store/auth_store';

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
    const { initializeAuth } = useAuthActions();

    useEffect(() => {
        // Initialize auth on component mount
        initializeAuth();
    }, [initializeAuth]);

    useEffect(() => {
        // Check authentication after initialization
        if (!isAuth) {
            // Get current path for redirect after login
            const currentPath = window.location.pathname;
            const loginUrl = `${redirectTo}?redirectTo=${encodeURIComponent(currentPath)}`;
            router.push(loginUrl);
        }
    }, [isAuth, router, redirectTo]);

    // Show loading or nothing while checking auth
    if (!isAuth) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return <>{children}</>;
}
