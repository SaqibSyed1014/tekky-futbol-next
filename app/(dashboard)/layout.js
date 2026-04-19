'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const NAV_ITEMS = [
  { href: '/admin',  label: 'Applications', role: 'admin' },
  { href: '/user',   label: 'My Dashboard', role: 'player' },
];

function DashboardNav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!user) return null;

  const links = NAV_ITEMS.filter((n) => n.role === user.role || user.role === 'admin');

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
      padding: '0.85rem 1.5rem',
      borderBottom: '1px solid rgba(0,116,255,0.2)',
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(10px)',
      marginBottom: '2.5rem',
      flexWrap: 'wrap',
    }}>
      <Link href="/" style={{ fontFamily: "'Bebas Neue', sans-serif", color: 'var(--tekky-blue)', fontSize: '1.3rem', letterSpacing: '1px', textShadow: '0 0 8px var(--tekky-blue)', textDecoration: 'none' }}>
        TekkyFutbol
      </Link>

      <div style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
        {links.map((n) => {
          const active = pathname === n.href;
          return (
            <Link
              key={n.href}
              href={n.href}
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '0.95rem',
                letterSpacing: '0.5px',
                padding: '0.3rem 0.8rem',
                borderRadius: 6,
                color: active ? 'var(--tekky-blue)' : 'var(--muted)',
                background: active ? 'rgba(0,116,255,0.12)' : 'transparent',
                border: active ? '1px solid rgba(0,116,255,0.35)' : '1px solid transparent',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
            >
              {n.label}
            </Link>
          );
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--muted)', fontSize: '0.85rem' }}>
        <span>{user.name ?? user.email}</span>
        <button
          onClick={logout}
          style={{ background: 'none', border: '1px solid rgba(255,60,60,0.35)', borderRadius: 6, padding: '0.3rem 0.7rem', color: '#ff6b6b', cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'inherit' }}
        >
          Sign out
        </button>
      </div>
    </nav>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: '#000', color: 'var(--fg)' }}>
      <DashboardNav />
      <div style={{ padding: '0 1.5rem 3rem' }}>
        {children}
      </div>
    </div>
  );
}
