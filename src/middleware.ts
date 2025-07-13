import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get tokens from cookies
    const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;

    // Check if user is authenticated (has both tokens)
    const isAuthenticated = accessToken && refreshToken;

    // Cek apakah URL adalah halaman yang dilindungi
    const isProtectedRoute = pathname.startsWith('/dashboard');
    const isAuthRoute = pathname === '/login' || pathname === '/register';

    // Jika tidak ada session dan mencoba mengakses halaman dilindungi, redirect ke login
    if (isProtectedRoute && !isAuthenticated) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirectTo', pathname); // Store intended destination
        return NextResponse.redirect(loginUrl);
    }

    // Jika sudah login dan mencoba akses halaman auth, redirect ke dashboard
    if (isAuthRoute && isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/register'],
};
