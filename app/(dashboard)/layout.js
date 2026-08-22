import { adminFontVars } from '@/components/admin/adminFonts';
import '../admin-dash.css';
import DashboardShell from './DashboardShell';

/**
 * Server layout — next/font and global CSS must stay on the server.
 * Pulling them into the client dashboard shell crashes production with a blank page.
 */
export default function DashboardLayout({ children }) {
  return (
    <div className={adminFontVars}>
      <DashboardShell>{children}</DashboardShell>
    </div>
  );
}
