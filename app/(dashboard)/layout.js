'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from "next/image";
import { initiatePayment } from '@/services/paymentsApi';
import ChicagoStar, { AdminStarCrop } from '@/components/admin/ChicagoStar';
import { adminFontVars } from '@/components/admin/adminFonts';
import '../admin-dash.css';

function getAdminTone(pathname) {
  if (pathname === '/admin') return 'home';
  if (pathname.startsWith('/admin/kits') || pathname.startsWith('/admin/payments')) return 'shop';
  return 'league';
}
// ─── Nav config ──────────────────────────────────────────────────────────────

const ADMIN_NAV = [
  { href: '/admin',                icon: 'fa-solid fa-house',           label: 'Home'         },
  { href: '/admin/applications',   icon: 'fa-solid fa-file-lines',      label: 'Applications' },
  { href: '/admin/teams',          icon: 'fa-solid fa-shield-halved',   label: 'Teams'        },
  { href: '/admin/memberships',    icon: 'fa-solid fa-users',           label: 'Memberships'  },
  { href: '/admin/players',        icon: 'fa-solid fa-user-group',      label: 'Players'      },
  { href: '/admin/waivers',        icon: 'fa-solid fa-file-signature',  label: 'Waivers'      },
  { href: '/admin/kits',           icon: 'fa-solid fa-shirt',           label: 'Kits'         },
  { href: '/admin/payments',       icon: 'fa-solid fa-dollar-sign',     label: 'Payments'     },
];

const PLAYER_NAV = [
  { href: '/user',         icon: 'fa-solid fa-house',          label: 'Home'    },
  { href: '/user/waiver',  icon: 'fa-solid fa-file-signature', label: 'Waiver'  },
  { href: '/user/kit',     icon: 'fa-solid fa-shirt',          label: 'Kit'     },
  { href: '/user/payment', icon: 'fa-solid fa-credit-card',    label: 'Payment' },
];

// Captain shares the /user route but also gets roster nav links
const CAPTAIN_NAV = [
  { href: '/user',         icon: 'fa-solid fa-house',            label: 'Home'         },
  { href: '/user/roster',  icon: 'fa-solid fa-users',            label: 'My Roster'    },
  { href: '/user/pool',    icon: 'fa-solid fa-magnifying-glass', label: 'Find Players' },
  { href: '/user/waiver',  icon: 'fa-solid fa-file-signature',   label: 'Waiver'       },
  { href: '/user/kit',     icon: 'fa-solid fa-shirt',            label: 'Kit'          },
  { href: '/user/payment', icon: 'fa-solid fa-credit-card',      label: 'Payment'      },
];

const PAGE_TITLES = {
  '/admin':                'Dashboard',
  '/admin/applications':   'Applications',
  '/admin/teams':          'Teams',
  '/admin/memberships':    'Memberships',
  '/admin/waivers':        'Waivers',
  '/admin/profile':        'My Profile',
  '/admin/kits':           'Kit Orders',
  '/admin/players':        'Players',
  '/admin/payments':       'Payments',
  '/user':                 'Dashboard',
  '/user/roster':          'My Roster',
  '/user/invites':         'Invitations',
  '/user/pool':            'Find Players',
  '/user/waiver':          'Waiver',
  '/user/profile':         'My Profile',
  '/user/kit':             'Kit Selection',
  '/user/payment':         'Registration Fee',
};

// ─── Sidebar ─────────────────────────────────────────────────────────────────

function Sidebar({ role, isCaptain, waiverSigned, sidebarOpen, onClose }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const navItems = role === 'admin' ? ADMIN_NAV : isCaptain ? CAPTAIN_NAV : PLAYER_NAV;
  const isAdmin = role === 'admin';

  return (
    <>
      {sidebarOpen && (
        <div
          onClick={onClose}
          style={{
            display: 'none',
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
            zIndex: 40,
          }}
          className="sidebar-backdrop"
        />
      )}

      <aside
        className={`db-sidebar${sidebarOpen ? ' open' : ''}${isAdmin ? ' ad-sidebar' : ''}`}
        style={isAdmin ? undefined : {
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
        <div className={isAdmin ? 'ad-brand' : undefined} style={isAdmin ? undefined : {
          padding: '.5rem .75rem',
          borderBottom: '1px solid rgba(0,116,255,0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.1rem',
        }}>
          <Image src="/images/logo.webp" alt="TekkyFutbol Logo" width={55} height={55} />
          <div
            className={isAdmin ? 'ad-brand__name' : undefined}
            style={isAdmin ? undefined : {
              fontFamily: "'Bebas Neue', sans-serif",
              color: 'white',
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

        <div className={isAdmin ? 'ad-role-wrap' : undefined} style={isAdmin ? undefined : { padding: '1.5rem 1.5rem 0.5rem' }}>
          {isAdmin ? (
            <span className="ad-role">Admin</span>
          ) : (() => {
            const isCap     = isCaptain;
            const color     = isCap ? '#f0b429' : '#00c864';
            const bg        = isCap ? 'rgba(240,180,41,0.1)' : 'rgba(0,200,100,0.1)';
            const border    = isCap ? 'rgba(240,180,41,0.3)' : 'rgba(0,200,100,0.3)';
            const label     = isCap ? 'Captain' : 'Player';
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

        <div className={isAdmin ? 'ad-nav' : undefined} style={isAdmin ? undefined : { padding: '0.75rem 0.75rem', flex: 1 }}>
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== '/admin' && item.href !== '/user' && pathname.startsWith(item.href));
            const isWaiverGated = item.href === '/user/waiver' || item.href === '/user/pool';
            const showWaiverBadge = isWaiverGated && role !== 'admin' && !waiverSigned;
            if (isAdmin) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`ad-nav-link${active ? ' is-active' : ''}`}
                >
                  <i className={item.icon} />
                  {item.label}
                </Link>
              );
            }
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
                  color: active ? '#fff' : showWaiverBadge ? '#ffb400' : 'var(--muted)',
                  background: active ? 'rgba(0,116,255,0.18)' : showWaiverBadge ? 'rgba(255,180,0,0.06)' : 'transparent',
                  border: `1px solid ${active ? 'rgba(0,116,255,0.4)' : showWaiverBadge ? 'rgba(255,180,0,0.25)' : 'transparent'}`,
                  textDecoration: 'none',
                  fontSize: '0.92rem',
                  fontWeight: active || showWaiverBadge ? 600 : 400,
                  transition: 'all 0.15s',
                  boxShadow: active ? '0 0 10px rgba(0,116,255,0.15)' : 'none',
                }}
                onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = 'rgba(0,116,255,0.07)'; e.currentTarget.style.color = '#fff'; } }}
                onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = showWaiverBadge ? 'rgba(255,180,0,0.06)' : 'transparent'; e.currentTarget.style.color = showWaiverBadge ? '#ffb400' : 'var(--muted)'; } }}
              >
                <i className={item.icon} style={{ width: 18, textAlign: 'center', fontSize: '0.88rem', color: active ? 'var(--tekky-blue)' : showWaiverBadge ? '#ffb400' : 'inherit' }} />
                {item.label}
                {showWaiverBadge && (
                  <span style={{
                    marginLeft: 'auto',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    background: '#ffb400',
                    color: '#000',
                    borderRadius: 20,
                    padding: '0.1rem 0.45rem',
                    letterSpacing: '0.3px',
                    textTransform: 'uppercase',
                  }}>
                    Required
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <div className={isAdmin ? 'ad-logout-wrap' : undefined} style={isAdmin ? undefined : { padding: '0.75rem', borderTop: '1px solid rgba(0,116,255,0.15)' }}>
          <button
            onClick={() => { onClose(); logout(); }}
            className={isAdmin ? 'ad-logout' : undefined}
            style={isAdmin ? undefined : {
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
            onMouseEnter={isAdmin ? undefined : (e) => {
              e.currentTarget.style.background = 'rgba(255,60,60,0.08)';
              e.currentTarget.style.color = '#ff6b6b';
              e.currentTarget.style.borderColor = 'rgba(255,60,60,0.2)';
            }}
            onMouseLeave={isAdmin ? undefined : (e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--muted)';
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            <i className="fa-solid fa-right-from-bracket" style={isAdmin ? undefined : { width: 18, textAlign: 'center', fontSize: '0.88rem' }} />
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
  const router = useRouter();
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

  const isAdmin = user?.role === 'admin';

  return (
    <header
      className={isAdmin ? 'ad-topbar' : undefined}
      style={isAdmin ? undefined : {
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
      <div className={isAdmin ? 'ad-topbar__left' : undefined} style={isAdmin ? undefined : { display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
        <button
          className={`db-hamburger${isAdmin ? ' ad-hamburger' : ''}`}
          onClick={onMenuToggle}
          aria-label="Toggle menu"
          style={isAdmin ? undefined : {
            display: 'none',
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

        <h2 className={isAdmin ? 'ad-page-title' : undefined} style={isAdmin ? undefined : {
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

      <div ref={dropRef} style={{ position: 'relative' }}>
        <button
          onClick={() => setDropdownOpen((v) => !v)}
          aria-label="User menu"
          className={isAdmin ? `ad-user-btn${dropdownOpen ? ' is-open' : ''}` : undefined}
          style={isAdmin ? undefined : {
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
          onMouseEnter={isAdmin ? undefined : (e) => { e.currentTarget.style.borderColor = 'rgba(0,116,255,0.6)'; }}
          onMouseLeave={isAdmin ? undefined : (e) => { if (!dropdownOpen) e.currentTarget.style.borderColor = 'rgba(0,116,255,0.25)'; }}
        >
          <span className={isAdmin ? 'ad-avatar' : undefined} style={isAdmin ? undefined : {
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
          <span className={isAdmin ? 'ad-user-name' : undefined} style={isAdmin ? undefined : { color: 'var(--fg)', fontSize: '0.85rem', fontWeight: 500, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.name || user?.email}
          </span>
          <i
            className={`fa-solid fa-chevron-${dropdownOpen ? 'up' : 'down'}`}
            style={{ color: 'var(--muted)', fontSize: '0.7rem', transition: 'transform 0.2s' }}
          />
        </button>

        {/* Dropdown menu */}
        {dropdownOpen && (
          <div className={isAdmin ? 'ad-menu' : undefined} style={isAdmin ? undefined : {
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
            <div className={isAdmin ? 'ad-menu__meta' : undefined} style={isAdmin ? undefined : { padding: '0.8rem 1rem', borderBottom: '1px solid rgba(0,116,255,0.12)' }}>
              <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--fg)', margin: 0 }}>
                {user?.name || 'User'}
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: '0.2rem 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email}
              </p>
            </div>

            {/* Menu items */}
            <div style={{ padding: '0.4rem 0' }}>
              <DropdownItem
                admin={isAdmin}
                icon="fa-solid fa-user"
                label="My Profile"
                onClick={() => {
                  setDropdownOpen(false);
                  router.push(user?.role === 'admin' ? '/admin/profile' : '/user/profile');
                }}
              />
              <div style={{ height: 1, background: 'rgba(0,116,255,0.1)', margin: '0.3rem 0' }} />
              <DropdownItem
                admin={isAdmin}
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

function DropdownItem({ icon, label, onClick, danger = false, disabled = false, admin = false }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={admin ? `ad-menu__item${danger ? ' is-danger' : ''}` : undefined}
      style={admin ? undefined : {
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
      onMouseEnter={admin ? undefined : (e) => { if (!disabled) e.currentTarget.style.background = danger ? 'rgba(255,60,60,0.08)' : 'rgba(0,116,255,0.08)'; }}
      onMouseLeave={admin ? undefined : (e) => { e.currentTarget.style.background = 'none'; }}
    >
      <i className={icon} style={{ width: 16, textAlign: 'center', fontSize: '0.82rem' }} />
      {label}
      {disabled && <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--muted)' }}>Soon</span>}
    </button>
  );
}

// ─── Payment prompt modal ─────────────────────────────────────────────────────

function PaymentPrompt({ onDismiss }) {
  const [paying, setPaying] = useState(false);
  const [error, setError]   = useState('');

  async function handlePay() {
    setError('');
    setPaying(true);
    try {
      const data = await initiatePayment();
      window.location.href = data.checkout_url;
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.');
      setPaying(false);
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
    }}>
      <div style={{
        background: '#0a0a0a', border: '1px solid rgba(0,116,255,0.35)',
        borderRadius: 16, padding: '2rem', maxWidth: 420, width: '100%',
        boxShadow: '0 0 40px rgba(0,116,255,0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
            background: 'rgba(0,116,255,0.1)', border: '1px solid rgba(0,116,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <i className="fa-solid fa-dollar-sign" style={{ color: '#0074ff', fontSize: '1.1rem' }} />
          </div>
          <div>
            <h3 style={{ color: '#fff', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.3rem', letterSpacing: '1px', margin: 0 }}>
              Registration Fee Due
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.8rem', margin: 0 }}>
              Complete your registration to continue
            </p>
          </div>
        </div>

        <div style={{
          background: 'rgba(0,116,255,0.05)', border: '1px solid rgba(0,116,255,0.12)',
          borderRadius: 8, padding: '1rem 1.25rem', marginBottom: '1.25rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ color: '#b6c2d3', fontSize: '0.88rem' }}>Registration Fee</span>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', color: '#fff', letterSpacing: '1px' }}>
            $700.00
          </span>
        </div>

        <p style={{ color: '#b6c2d3', fontSize: '0.83rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          Your waiver has been signed. A one-time registration fee of <strong style={{ color: '#fff' }}>$700</strong> is
          required to complete your registration. You will be redirected to Stripe's
          secure payment page.
        </p>

        {error && (
          <div style={{
            padding: '0.65rem 0.9rem', borderRadius: 8, marginBottom: '1rem',
            background: 'rgba(255,60,60,0.08)', border: '1px solid rgba(255,60,60,0.25)',
            color: '#ff6b6b', fontSize: '0.82rem',
          }}>
            <i className="fa-solid fa-circle-xmark" style={{ marginRight: '0.45rem' }} />
            {error}
          </div>
        )}

        <button
          onClick={handlePay}
          disabled={paying}
          style={{
            width: '100%', padding: '0.85rem',
            background: paying ? 'rgba(0,116,255,0.3)' : 'rgba(0,116,255,0.15)',
            border: '2px solid rgba(0,116,255,0.6)',
            borderRadius: 8, color: '#fff', fontSize: '0.92rem', fontWeight: 700,
            cursor: paying ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            marginBottom: '0.65rem', fontFamily: 'inherit',
          }}
        >
          {paying ? (
            <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Redirecting to Bank…</>
          ) : (
            <><i className="fa-solid fa-credit-card" /> Pay $700.00 Now</>
          )}
        </button>

        <button
          onClick={onDismiss}
          disabled={paying}
          style={{
            width: '100%', padding: '0.65rem',
            background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, color: 'var(--muted)', fontSize: '0.85rem',
            cursor: paying ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
          }}
        >
          Remind Me Later
        </button>
      </div>
    </div>
  );
}

// ─── Main layout ─────────────────────────────────────────────────────────────

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPaymentPrompt, setShowPaymentPrompt] = useState(false);

  // Auth + role guard (client-side safety net — middleware handles the fast path)
  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    // Block players from accessing admin routes
    if (user.role !== 'admin' && pathname.startsWith('/admin')) {
      router.replace('/user');
      return;
    }
    // Block admins from accessing player routes
    if (user.role === 'admin' && pathname.startsWith('/user')) {
      router.replace('/admin');
    }
  }, [user, loading, pathname, router]);

  // Show payment prompt when waiver is signed but fee not yet paid
  useEffect(() => {
    if (!user || user.role === 'admin') return;
    const needsPayment = user.waiver_signed && user.payment_status !== 'paid';
    // Don't show the prompt if already on the payment page
    const onPaymentPage = pathname === '/user/payment';
    setShowPaymentPrompt(needsPayment && !onPaymentPage);
  }, [user, pathname]);

  if (loading || !user) {
    return (
      <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
      </div>
    );
  }

  // Standalone mode: waiver viewer at /admin/waivers/[userId]
  // Authenticated as admin (guard above), but no sidebar or topbar needed.
  const isStandalone = /^\/admin\/waivers\/[^/]+$/.test(pathname);
  const isAdmin = user.role === 'admin';
  const adminTone = getAdminTone(pathname);

  if (isStandalone) {
    return <div className={`admin-dash admin-dash--league ${adminFontVars}`}>{children}</div>;
  }

  return (
    <div className={isAdmin ? `admin-dash admin-dash--${adminTone} ${adminFontVars}` : undefined}>
      {showPaymentPrompt && <PaymentPrompt onDismiss={() => setShowPaymentPrompt(false)} />}
      <Sidebar role={user.role} isCaptain={user.is_captain} waiverSigned={!!user.waiver_signed} sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div
        className={isAdmin ? 'db-main ad-main' : 'db-main'}
        style={isAdmin ? undefined : {
        marginLeft: 240,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#030303',
      }}>
        {isAdmin && <AdminStarCrop variant={adminTone === 'shop' ? 'silver' : 'ghost'} size={adminTone === 'home' ? 200 : 260} />}
        <Topbar user={user} onMenuToggle={() => setSidebarOpen((v) => !v)} />

        <main className={isAdmin ? 'ad-content' : undefined} style={isAdmin ? undefined : { flex: 1, padding: '2rem 2rem 3rem', maxWidth: 1280 }}>
          {children}
        </main>

        {isAdmin && (
          <footer className="ad-foot">
            <div className="ad-divider__stars" aria-hidden="true">
              <ChicagoStar size={10} variant="official" />
              <ChicagoStar size={10} variant="official" />
              <ChicagoStar size={10} variant="official" />
              <ChicagoStar size={10} variant="official" />
            </div>
            <span className="ad-foot__mark">TekkyFutbol · Chicago</span>
          </footer>
        )}
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
    </div>
  );
}
