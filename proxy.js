import { NextResponse } from 'next/server';

/**
 * Navigation guard — runs on every request before the page renders.
 *
 * Rules:
 *  1. Not logged in  + accessing a dashboard / fan account route  → login
 *  2. Logged in player/admin + accessing a public page            → their dashboard
 *  3. Logged in fan          + accessing public pages             → stay (shop, home)
 *  4. Logged in              + wrong area for role                → redirect home
 *
 * Login is a single shared page/endpoint for every role. Registration stays
 * split: /registration for players, /fan/register for fans.
 */

const DASHBOARD_PREFIXES = ['/admin', '/user'];
const LOGIN_PAGE = '/login';
const FAN_REGISTER_PAGE = '/fan/register';
const PLAYER_REGISTER_PAGE = '/registration';

/**
 * Pages that require auth-awareness but must remain accessible to BOTH
 * logged-in and logged-out users (they render different content per state).
 * e.g. /register?invite=<token>, /join/<token>
 */
const AUTH_AWARE_PREFIXES = ['/register', '/join'];

/** Decode JWT payload without verifying signature (routing only, not a security check). */
function decodeToken(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

function homeForRole(role) {
  if (role === 'admin') return '/admin';
  if (role === 'fan') return '/fan';
  return '/user';
}

function isFanApp(pathname) {
  return pathname === '/fan' || pathname.startsWith('/fan/');
}

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('tf_token')?.value;

  const isDashboard = DASHBOARD_PREFIXES.some((p) => pathname.startsWith(p));
  const isFanRegisterPage = pathname === FAN_REGISTER_PAGE;
  const isFanProtected = isFanApp(pathname) && !isFanRegisterPage;
  const isLoginPage = pathname === LOGIN_PAGE;
  const isAuthAware = AUTH_AWARE_PREFIXES.some((p) => pathname.startsWith(p));
  const isPublic = !isDashboard && !isAuthAware && !isFanApp(pathname) && !isLoginPage;

  // ── Not logged in ──────────────────────────────────────────────────────────
  if (!token) {
    if (isDashboard || isFanProtected) {
      return NextResponse.redirect(new URL(LOGIN_PAGE, request.url));
    }
    return NextResponse.next();
  }

  // ── Logged in ──────────────────────────────────────────────────────────────
  const payload = decodeToken(token);

  // Invalid / tampered / expired token — treat as logged-out
  if (!payload) {
    const res = (isDashboard || isFanProtected)
      ? NextResponse.redirect(new URL(LOGIN_PAGE, request.url))
      : NextResponse.next();
    res.cookies.delete('tf_token');
    return res;
  }

  const role = payload.role;
  const homeDashboard = homeForRole(role);

  if (isAuthAware) {
    return NextResponse.next();
  }

  if (isLoginPage) {
    return NextResponse.redirect(new URL(homeDashboard, request.url));
  }

  if (isFanRegisterPage) {
    if (role === 'fan') {
      return NextResponse.redirect(new URL('/fan', request.url));
    }
    return NextResponse.redirect(new URL(homeDashboard, request.url));
  }

  if (isFanProtected) {
    if (role !== 'fan') {
      return NextResponse.redirect(new URL(homeDashboard, request.url));
    }
    return NextResponse.next();
  }

  if (isPublic) {
    if (role === 'fan') {
      if (pathname === PLAYER_REGISTER_PAGE || pathname.startsWith(`${PLAYER_REGISTER_PAGE}/`)) {
        return NextResponse.redirect(new URL('/fan', request.url));
      }
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL(homeDashboard, request.url));
  }

  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL(homeDashboard, request.url));
  }
  if (pathname.startsWith('/user') && role !== 'player') {
    return NextResponse.redirect(new URL(homeDashboard, request.url));
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
