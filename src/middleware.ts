import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get auth tokens from cookies (we'll need to set these in the auth store)
    const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;

    // Check if user is authenticated
    const isAuthenticated = !!(accessToken && refreshToken);

    console.log('Middleware - Path:', pathname, 'Authenticated:', isAuthenticated);

    // Protected routes that require authentication
    const isProtectedRoute = pathname.startsWith('/dashboard');

    // Auth routes that should redirect if already authenticated
    const isAuthRoute = pathname === '/login' || pathname === '/register';

    // If accessing protected route without auth, redirect to root
    if (isProtectedRoute && !isAuthenticated) {
        console.log('Redirecting to root - no auth');
        const rootUrl = new URL('/', request.url);
        return NextResponse.redirect(rootUrl);
    }

    // If accessing auth routes while authenticated, redirect to dashboard
    if (isAuthRoute && isAuthenticated) {
        console.log('Redirecting to dashboard - already authenticated');
        const dashboardUrl = new URL('/dashboard', request.url);
        return NextResponse.redirect(dashboardUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/register'],
};
