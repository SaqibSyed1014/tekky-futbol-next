import { adminFontVars } from '@/components/admin/adminFonts';
import '../admin-dash.css';
import '../dashboard-controls.css';
import DashboardShell from './DashboardShell';

export const dynamic = 'force-dynamic';

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
