'use client';

/**
 * PublicShell — conditionally renders the global Navbar + Footer.
 * Dashboard routes (/admin, /user, /fan minus its auth pages) get neither,
 * so the sidebar layout takes full control of the screen.
 */

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

const DASHBOARD_PREFIXES = ['/admin', '/user'];
const FAN_AUTH_PAGES = ['/fan/login', '/fan/register'];

function isFanDashboardRoute(pathname) {
  const inFanApp = pathname === '/fan' || pathname.startsWith('/fan/');
  if (!inFanApp) return false;
  return !FAN_AUTH_PAGES.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

export default function PublicShell({ children }) {
  const pathname = usePathname();
  const isDashboard =
    DASHBOARD_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/')) ||
    isFanDashboardRoute(pathname);

  if (isDashboard) return <>{children}</>;

  return (
    <div className="public-site">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
