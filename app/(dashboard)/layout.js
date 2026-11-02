import '../admin-dash.css';
import '../dashboard-controls.css';
import DashboardShell from './DashboardShell';

export const dynamic = 'force-dynamic';

/**
 * Server layout — global CSS must stay on the server; pulling it into the
 * client dashboard shell crashes production with a blank page. Fonts come from
 * the root layout (components/shared/siteFonts.js), so the dashboard shares the
 * platform-wide typographic hierarchy instead of loading its own families.
 */
export default function DashboardLayout({ children }) {
  return <DashboardShell>{children}</DashboardShell>;
}
