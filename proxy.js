import { NextResponse } from 'next/server';

/**
 * Navigation guard — runs on every request before the page renders.
 *
 * Rules:
 *  1. Not logged in  + accessing a dashboard route  → redirect to /login
 *  2. Logged in      + accessing any public page    → redirect to their dashboard
 *  3. Logged in      + wrong dashboard for role     → redirect to correct dashboard
 *     (admin on /user → /admin, player on /admin → /user)
 */

const DASHBOARD_PREFIXES = ['/admin', '/user'];

/** Decode JWT payload without verifying signature (routing only, not a security check). */
function decodeToken(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('tf_token')?.value;

  const isDashboard = DASHBOARD_PREFIXES.some((p) => pathname.startsWith(p));
  const isPublic = !isDashboard;

  // ── Not logged in ──────────────────────────────────────────────────────────
  if (!token) {
    if (isDashboard) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // ── Logged in ──────────────────────────────────────────────────────────────
  const payload = decodeToken(token);

  // Invalid / tampered / expired token — treat as logged-out
  if (!payload) {
    const res = isDashboard
      ? NextResponse.redirect(new URL('/login', request.url))
      : NextResponse.next();
    res.cookies.delete('tf_token');
    return res;
  }

  const role = payload.role;
  const homeDashboard = role === 'admin' ? '/admin' : '/user';

  // Redirect logged-in users away from all public pages (incl. /login, /registration)
  if (isPublic) {
    return NextResponse.redirect(new URL(homeDashboard, request.url));
  }

  // Role isolation — prevent accessing the wrong dashboard
  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/user', request.url));
  }
  if (pathname.startsWith('/user') && role === 'admin') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match every path except Next.js internals and static public assets.
     */
    '/((?!_next/static|_next/image|images|fonts|icons|favicons|.*\\.webp|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.ico|.*\\.woff2?).*)',
  ],
};
