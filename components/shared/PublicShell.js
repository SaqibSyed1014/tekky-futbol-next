'use client';

/**
 * PublicShell — conditionally renders the global Navbar + Footer.
 * Dashboard routes (/admin, /user) get neither, so the sidebar layout
 * takes full control of the screen.
 */

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

const DASHBOARD_PREFIXES = ['/admin', '/user'];

export default function PublicShell({ children }) {
  const pathname = usePathname();
  const isDashboard = DASHBOARD_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  );

  if (isDashboard) return <>{children}</>;

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
