import '@/app/globals.css';

export const metadata = {
  title: 'Dashboard — TekkyFutbol',
};

export default function DashboardLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: '#000', color: 'var(--fg)', padding: '2rem 1.25rem' }}>
      {/* Dashboard shell — expand with sidebar/topbar when auth is added */}
      {children}
    </div>
  );
}
