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
const FAN_REGISTER_PAGE = '/fan/register';

// Public pages that still get the Footer but never the Navbar — reached
// directly from outside the site (e.g. scanning a QR code with a phone's
// camera), so the normal site chrome would be misleading/distracting here.
const NO_NAVBAR_PAGES = ['/tickets/verify', '/tickets/order/success'];

function isFanDashboardRoute(pathname) {
  const inFanApp = pathname === '/fan' || pathname.startsWith('/fan/');
  if (!inFanApp) return false;
  return pathname !== FAN_REGISTER_PAGE && !pathname.startsWith(`${FAN_REGISTER_PAGE}/`);
}

export default function PublicShell({ children }) {
  const pathname = usePathname();
  const isDashboard =
    DASHBOARD_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/')) ||
    isFanDashboardRoute(pathname);

  if (isDashboard) return <>{children}</>;

  if (NO_NAVBAR_PAGES.includes(pathname)) {
    return (
      <div className="public-site">
        {children}
        <Footer />
      </div>
    );
  }

  return (
    <div className="public-site">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
