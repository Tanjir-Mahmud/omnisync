import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const session = request.cookies.get('session')
    const isOnDashboard = request.nextUrl.pathname === '/'
    const isOnInventory = request.nextUrl.pathname.startsWith('/inventory')
    const isOnAuth = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register')

    if (isOnDashboard || isOnInventory) {
        if (!session) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    if (isOnAuth && session) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}

export const config = {
    // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
