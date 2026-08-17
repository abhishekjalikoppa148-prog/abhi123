import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';

// Routes that require authentication
const PROTECTED_ROUTES = ['/dashboard', '/builder', '/onboarding', '/profile', '/orders'];

// Routes only admins can access
const ADMIN_ROUTES = ['/admin'];

// Public routes (no auth needed)
const PUBLIC_AUTH_ROUTES = ['/login', '/signup', '/forgot-password', '/reset-password'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip for Next.js internals, static assets, API routes, and birthday pages
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/birthday/') ||
    pathname.startsWith('/public/') ||
    pathname === '/favicon.ico'
  ) {
    return addSecurityHeaders(NextResponse.next());
  }

  const session = await getSessionFromRequest(request);

  // Redirect logged-in users away from auth pages
  if (PUBLIC_AUTH_ROUTES.some(r => pathname.startsWith(r))) {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return addSecurityHeaders(NextResponse.next());
  }

  // Admin route protection
  if (ADMIN_ROUTES.some(r => pathname.startsWith(r))) {
    if (!session) {
      const url = new URL('/login', request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
    if ((session as any).role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return addSecurityHeaders(NextResponse.next());
  }

  // Protected route check
  if (PROTECTED_ROUTES.some(r => pathname.startsWith(r))) {
    if (!session) {
      const url = new URL('/login', request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
  }

  return addSecurityHeaders(NextResponse.next());
}

function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
