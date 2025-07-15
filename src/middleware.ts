import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Helper function to validate access token with API
async function validateAccessToken(accessToken: string): Promise<boolean> {
    try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${API_BASE_URL}/akun/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        return response.ok;
    } catch (error) {
        console.error('Token validation error:', error);
        return false;
    }
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get auth tokens from cookies
    const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;

    console.log('🔐 Middleware - Path:', pathname);
    console.log('🔐 Middleware - Has tokens:', !!(accessToken && refreshToken));

    // Protected routes that require authentication
    const isProtectedRoute = pathname.startsWith('/dashboard');

    // Auth routes that should redirect if already authenticated  
    const isAuthRoute = pathname === '/login' || pathname === '/register';

    // If accessing protected route
    if (isProtectedRoute) {
        // No tokens at all - redirect to root
        if (!accessToken || !refreshToken) {
            console.log('❌ No tokens found, redirecting to root');
            const rootUrl = new URL('/', request.url);
            return NextResponse.redirect(rootUrl);
        }

        // Validate access token with API
        const isValidToken = await validateAccessToken(accessToken);

        if (!isValidToken) {
            console.log('❌ Invalid access token, redirecting to root');
            // Clear invalid cookies
            const response = NextResponse.redirect(new URL('/', request.url));
            response.cookies.delete('accessToken');
            response.cookies.delete('refreshToken');
            return response;
        }

        console.log('✅ Valid token, allowing access to protected route');
    }

    // If accessing auth routes while having valid tokens, redirect to dashboard
    if (isAuthRoute && accessToken && refreshToken) {
        const isValidToken = await validateAccessToken(accessToken);

        if (isValidToken) {
            console.log('✅ Already authenticated, redirecting to dashboard');
            const dashboardUrl = new URL('/dashboard', request.url);
            return NextResponse.redirect(dashboardUrl);
        } else {
            // Clear invalid cookies but allow access to auth routes
            const response = NextResponse.next();
            response.cookies.delete('accessToken');
            response.cookies.delete('refreshToken');
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/register'],
};
