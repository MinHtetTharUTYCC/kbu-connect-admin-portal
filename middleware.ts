import { type NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const refreshToken = req.cookies.get('refresh_token')?.value;
    const hasRFToken = !!refreshToken;

    const publicRoutes = ['/', '/login'];

    if (hasRFToken && req.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    const isPublic = publicRoutes.some((route) => req.nextUrl.pathname.startsWith(route));
    if (!hasRFToken && !isPublic) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api|auth).*)']
};
