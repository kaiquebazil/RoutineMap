import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req?.nextUrl?.pathname ?? '';
        if (path === '/' || path === '/login' || path === '/signup' || path.startsWith('/api/auth') || path.startsWith('/api/signup')) {
          return true;
        }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.svg|og-image\\.png|api/auth|api/signup).*)'],
};
