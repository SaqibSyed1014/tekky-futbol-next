'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from "next/image";
import { MILESTONE_2_ENABLED } from '@/constants/features';

// ─── Nav config ──────────────────────────────────────────────────────────────

const ADMIN_NAV = [
  { href: '/admin',              icon: 'fa-solid fa-house',        label: 'Home'         },
  ...(MILESTONE_2_ENABLED ? [{ href: '/admin/applications', icon: 'fa-solid fa-file-lines', label: 'Applications' }] : []),
];

const PLAYER_NAV = [
  { href: '/user', icon: 'fa-solid fa-house', label: 'Home' },
];

const PAGE_TITLES = {
  '/admin':              'Dashboard',
  '/admin/applications': 'Applications',
  '/user':               'Dashboard',
};

// ─── Sidebar ─────────────────────────────────────────────────────────────────

function Sidebar({ role, isCaptain, sidebarOpen, onClose }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const navItems = role === 'admin' ? ADMIN_NAV : PLAYER_NAV;

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          onClick={onClose}
          style={{
            display: 'none',
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
            zIndex: 40,
            // shown via media query class below
          }}
          className="sidebar-backdrop"
        />
      )}

      <aside
        className={`db-sidebar${sidebarOpen ? ' open' : ''}`}
        style={{
          width: 240,
          minHeight: '100vh',
          background: '#000',
          borderRight: '1px solid rgba(0,116,255,0.2)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 50,
          transition: 'transform 0.25s ease',
        }}
      >
        {/* Brand */}
        <div style={{
          padding: '.5rem .75rem',
          borderBottom: '1px solid rgba(0,116,255,0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.1rem',
        }}>
          <Image src="/images/logo.webp" alt="TekkyFutbol Logo" width={70} height={70} />
          <div
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              color: 'var(--tekky-blue)',
              fontSize: '1.6rem',
              letterSpacing: '2px',
              textShadow: '0 0 10px var(--tekky-blue)',
              textDecoration: 'none',
              lineHeight: 1,
            }}
          >
            TekkyFutbol
          </div>
        </div>

        {/* Role badge */}
        <div style={{ padding: '1.5rem 1.5rem 0.5rem' }}>
          {(() => {
            const isAdmin   = role === 'admin';
            const isCap     = !isAdmin && isCaptain;
            const color     = isAdmin ? 'var(--tekky-blue)' : isCap ? '#f0b429' : '#00c864';
            const bg        = isAdmin ? 'rgba(0,116,255,0.1)' : isCap ? 'rgba(240,180,41,0.1)' : 'rgba(0,200,100,0.1)';
            const border    = isAdmin ? 'rgba(0,116,255,0.3)' : isCap ? 'rgba(240,180,41,0.3)' : 'rgba(0,200,100,0.3)';
            const label     = isAdmin ? 'Admin' : isCap ? 'Captain' : 'Player';
            return (
              <span style={{
                fontSize: '1rem',
                fontFamily: "'Bebas Neue', sans-serif",
                letterSpacing: '1.5px',
                color,
                background: bg,
                border: `1px solid ${border}`,
                borderRadius: 4,
                padding: '0.2rem 0.6rem',
                textTransform: 'uppercase',
              }}>
                {label}
              </span>
            );
          })()}
        </div>

        {/* Nav links */}
        <div style={{ padding: '0.75rem 0.75rem', flex: 1 }}>
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== '/admin' && item.href !== '/user' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.7rem 0.9rem',
                  borderRadius: 8,
                  marginBottom: '0.25rem',
                  color: active ? '#fff' : 'var(--muted)',
                  background: active ? 'rgba(0,116,255,0.18)' : 'transparent',
                  border: `1px solid ${active ? 'rgba(0,116,255,0.4)' : 'transparent'}`,
                  textDecoration: 'none',
                  fontSize: '0.92rem',
                  fontWeight: active ? 600 : 400,
                  transition: 'all 0.15s',
                  boxShadow: active ? '0 0 10px rgba(0,116,255,0.15)' : 'none',
                }}
                onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = 'rgba(0,116,255,0.07)'; e.currentTarget.style.color = '#fff'; } }}
                onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--muted)'; } }}
              >
                <i className={item.icon} style={{ width: 18, textAlign: 'center', fontSize: '0.88rem', color: active ? 'var(--tekky-blue)' : 'inherit' }} />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Logout button — pinned to bottom */}
        <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(0,116,255,0.15)' }}>
          <button
            onClick={() => { onClose(); logout(); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              width: '100%',
              padding: '0.7rem 0.9rem',
              borderRadius: 8,
              background: 'transparent',
              border: '1px solid transparent',
              color: 'var(--muted)',
              fontSize: '0.92rem',
              cursor: 'pointer',
              transition: 'all 0.15s',
              fontFamily: 'inherit',
              textAlign: 'left',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,60,60,0.08)';
              e.currentTarget.style.color = '#ff6b6b';
              e.currentTarget.style.borderColor = 'rgba(255,60,60,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--muted)';
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            <i className="fa-solid fa-right-from-bracket" style={{ width: 18, textAlign: 'center', fontSize: '0.88rem' }} />
            Logout
          </button>
        </div>

      </aside>
    </>
  );
}

// ─── Topbar ───────────────────────────────────────────────────────────────────

function Topbar({ user, onMenuToggle }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropRef = useRef(null);

  const pageTitle = PAGE_TITLES[pathname] ?? 'Dashboard';
  const initial = (user?.name || user?.email || '?')[0].toUpperCase();

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header style={{
      height: 87,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem',
      borderBottom: '1px solid rgba(0,116,255,0.15)',
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 30,
    }}>
      {/* Left: hamburger (mobile) + page title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
        <button
          className="db-hamburger"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
          style={{
            display: 'none', // shown via media query
            background: 'none',
            border: '1px solid rgba(0,116,255,0.3)',
            borderRadius: 6,
            color: 'var(--muted)',
            padding: '0.3rem 0.55rem',
            cursor: 'pointer',
            fontSize: '0.95rem',
          }}
        >
          <i className="fa-solid fa-bars" />
        </button>

        <h2 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '1.75rem',
          color: 'var(--fg)',
          letterSpacing: '1px',
          textShadow: 'none',
          margin: 0,
        }}>
          {pageTitle}
        </h2>
      </div>

      {/* Right: avatar + dropdown */}
      <div ref={dropRef} style={{ position: 'relative' }}>
        <button
          onClick={() => setDropdownOpen((v) => !v)}
          aria-label="User menu"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.55rem',
            background: 'none',
            border: '1px solid rgba(0,116,255,0.25)',
            borderRadius: 40,
            padding: '0.3rem 0.7rem 0.3rem 0.35rem',
            cursor: 'pointer',
            transition: 'border-color 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0,116,255,0.6)'; }}
          onMouseLeave={(e) => { if (!dropdownOpen) e.currentTarget.style.borderColor = 'rgba(0,116,255,0.25)'; }}
        >
          {/* Avatar circle */}
          <span style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--tekky-blue), #0044cc)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '1rem',
            color: '#fff',
            boxShadow: '0 0 8px rgba(0,116,255,0.4)',
            flexShrink: 0,
          }}>
            {initial}
          </span>
          <span style={{ color: 'var(--fg)', fontSize: '0.85rem', fontWeight: 500, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.name || user?.email}
          </span>
          <i
            className={`fa-solid fa-chevron-${dropdownOpen ? 'up' : 'down'}`}
            style={{ color: 'var(--muted)', fontSize: '0.7rem', transition: 'transform 0.2s' }}
          />
        </button>

        {/* Dropdown menu */}
        {dropdownOpen && (
          <div style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 8px)',
            minWidth: 180,
            background: '#0a0a0a',
            border: '1px solid rgba(0,116,255,0.25)',
            borderRadius: 10,
            boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 16px rgba(0,116,255,0.1)',
            overflow: 'hidden',
            zIndex: 100,
            animation: 'dbDropIn 0.15s ease',
          }}>
            {/* User info header */}
            <div style={{ padding: '0.8rem 1rem', borderBottom: '1px solid rgba(0,116,255,0.12)' }}>
              <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--fg)', margin: 0 }}>
                {user?.name || 'User'}
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: '0.2rem 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email}
              </p>
            </div>

            {/* Menu items */}
            <div style={{ padding: '0.4rem 0' }}>
              <DropdownItem icon="fa-solid fa-user" label="My Profile" onClick={() => setDropdownOpen(false)} disabled />
              <div style={{ height: 1, background: 'rgba(0,116,255,0.1)', margin: '0.3rem 0' }} />
              <DropdownItem
                icon="fa-solid fa-right-from-bracket"
                label="Logout"
                danger
                onClick={() => { setDropdownOpen(false); logout(); }}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function DropdownItem({ icon, label, onClick, danger = false, disabled = false }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        width: '100%',
        padding: '0.6rem 1rem',
        background: 'none',
        border: 'none',
        color: disabled ? 'var(--muted)' : (danger ? '#ff6b6b' : 'var(--fg)'),
        fontSize: '0.88rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        textAlign: 'left',
        opacity: disabled ? 0.5 : 1,
        transition: 'background 0.12s',
        fontFamily: 'inherit',
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = danger ? 'rgba(255,60,60,0.08)' : 'rgba(0,116,255,0.08)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
    >
      <i className={icon} style={{ width: 16, textAlign: 'center', fontSize: '0.82rem' }} />
      {label}
      {disabled && <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--muted)' }}>Soon</span>}
    </button>
  );
}

// ─── Main layout ─────────────────────────────────────────────────────────────

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auth + role guard (client-side safety net — middleware handles the fast path)
  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    // Prevent admin accessing /user/* and player accessing /admin/*
    if (pathname.startsWith('/admin') && user.role !== 'admin') {
      router.replace('/user');
      return;
    }
    if (pathname.startsWith('/user') && user.role === 'admin') {
      router.replace('/admin');
    }
  }, [user, loading, pathname, router]);

  if (loading || !user) {
    return (
      <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
      </div>
    );
  }

  return (
    <>
      <Sidebar role={user.role} isCaptain={user.is_captain} sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main area — offset by sidebar width on desktop */}
      <div className="db-main" style={{
        marginLeft: 240,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#030303',
      }}>
        <Topbar user={user} onMenuToggle={() => setSidebarOpen((v) => !v)} />

        <main style={{ flex: 1, padding: '2rem 2rem 3rem', maxWidth: 1280 }}>
          {children}
        </main>
      </div>

      <style>{`
        @keyframes dbDropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0);    }
        }

        @media (max-width: 768px) {
          .db-sidebar {
            transform: translateX(-100%);
          }
          .db-sidebar.open {
            transform: translateX(0);
          }
          .db-main {
            margin-left: 0 !important;
          }
          .db-hamburger {
            display: flex !important;
          }
          .sidebar-backdrop {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
}
