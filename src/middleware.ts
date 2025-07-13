import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    // Since we're using localStorage for auth, we'll handle protection client-side
    // This middleware will only handle static route protection for non-JS scenarios

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/register'],
};
