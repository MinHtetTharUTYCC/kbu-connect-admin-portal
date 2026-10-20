import { type NextRequest, NextResponse } from 'next/server';

const publicRoutes = ['/login'];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    if (!publicRoutes.includes(pathname) && request.cookies.get('kbu_auth_hint')?.value === 'unauthenticated') {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api|auth).*)']
};
