'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from "next/image";
import { initiatePayment } from '@/services/paymentsApi';
import ChicagoStar, { AdminStarCrop } from '@/components/admin/ChicagoStar';

function getDashTone(pathname) {
  if (pathname === '/admin' || pathname === '/user') return 'home';
  if (
    pathname.startsWith('/admin/kits') || pathname.startsWith('/admin/payments') ||
    pathname.startsWith('/user/kit') || pathname.startsWith('/user/payment')
  ) return 'shop';
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
  '/admin':                'Home',
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
  const isAdmin = role === 'admin';
  const navItems = isAdmin ? ADMIN_NAV : isCaptain ? CAPTAIN_NAV : PLAYER_NAV;
  const roleLabel = isAdmin ? 'Admin' : isCaptain ? 'Captain' : 'Player';
  const roleModifier = isAdmin ? '' : isCaptain ? ' ad-role--captain' : ' ad-role--player';

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

      <aside className={`db-sidebar ad-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="ad-brand">
          <Image src="/images/logo.webp" alt="TekkyFutbol Logo" width={55} height={55} />
          <div className="ad-brand__name">TekkyFutbol</div>
        </div>

        <div className="ad-role-wrap">
          <span className={`ad-role${roleModifier}`}>{roleLabel}</span>
        </div>

        <div className="ad-nav">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== '/admin' && item.href !== '/user' && pathname.startsWith(item.href));
            const isWaiverGated = item.href === '/user/waiver' || item.href === '/user/pool';
            const showWaiverBadge = isWaiverGated && !isAdmin && !waiverSigned;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`ad-nav-link${active ? ' is-active' : ''}${showWaiverBadge ? ' is-waiver-gated' : ''}`}
              >
                <i className={item.icon} />
                {item.label}
                {showWaiverBadge && <span className="ad-nav-link__badge">Required</span>}
              </Link>
            );
          })}
        </div>

        <div className="ad-logout-wrap">
          <button onClick={() => { onClose(); logout(); }} className="ad-logout">
            <i className="fa-solid fa-right-from-bracket" />
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
  const initial = String(user?.name || user?.email || '?').charAt(0).toUpperCase() || '?';
  const isAdmin = user?.role === 'admin';
  const breadcrumbRoot = isAdmin ? 'Admin' : user?.is_captain ? 'Captain' : 'Player';

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
    <header className="ad-topbar">
      <div className="ad-topbar__left">
        <button
          className="db-hamburger ad-hamburger"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <i className="fa-solid fa-bars" />
        </button>

        <div className="ad-breadcrumb" aria-label="Breadcrumb">
          <span className="ad-breadcrumb__root">{breadcrumbRoot}</span>
          <i className="fa-solid fa-chevron-right ad-breadcrumb__sep" aria-hidden="true" />
          <span className="ad-breadcrumb__current">{pageTitle}</span>
        </div>
      </div>

      <div ref={dropRef} style={{ position: 'relative' }}>
        <button
          onClick={() => setDropdownOpen((v) => !v)}
          aria-label="User menu"
          aria-expanded={dropdownOpen}
          className={`ad-user-btn${dropdownOpen ? ' is-open' : ''}`}
        >
          <span className="ad-avatar">{initial}</span>
          <span className="ad-user-name">{user?.name || user?.email}</span>
          <i
            className="fa-solid fa-chevron-down"
            style={{
              color: 'var(--muted)',
              fontSize: '0.7rem',
              transition: 'transform 280ms cubic-bezier(0.22, 1, 0.36, 1)',
              transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </button>

        <div className={`ad-menu${dropdownOpen ? ' is-open' : ''}`} aria-hidden={!dropdownOpen}>
          <div className="ad-menu__clip">
            <div className="ad-menu__panel">
              <div className="ad-menu__meta">
                <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--fg)', margin: 0 }}>
                  {user?.name || 'User'}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: '0.2rem 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.email}
                </p>
              </div>

              <div style={{ padding: '0.4rem 0' }}>
                <DropdownItem
                  icon="fa-solid fa-user"
                  label="My Profile"
                  onClick={() => {
                    setDropdownOpen(false);
                    router.push(user?.role === 'admin' ? '/admin/profile' : '/user/profile');
                  }}
                />
                <div style={{ height: 1, background: 'var(--ad-line)', margin: '0.3rem 0' }} />
                <DropdownItem
                  icon="fa-solid fa-right-from-bracket"
                  label="Logout"
                  danger
                  onClick={() => { setDropdownOpen(false); logout(); }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function DropdownItem({ icon, label, onClick, danger = false, disabled = false }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={`ad-menu__item${danger ? ' is-danger' : ''}`}
      disabled={disabled}
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
    <div className="ad-overlay ad-overlay--center" style={{ zIndex: 4500 }}>
      <div className="ad-modal">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
            background: 'rgba(61,139,255,0.14)', border: '1px solid rgba(61,139,255,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <i className="fa-solid fa-dollar-sign" style={{ color: 'var(--ad-electric)', fontSize: '1.1rem' }} />
          </div>
          <div>
            <h3 className="ad-modal__title" style={{ fontSize: '1.3rem' }}>Registration Fee Due</h3>
            <p className="ad-modal__sub">Complete your registration to continue</p>
          </div>
        </div>

        <div style={{
          background: 'rgba(15, 23, 42, 0.55)', border: '1px solid var(--ad-line)',
          borderRadius: 8, padding: '1rem 1.25rem', marginBottom: '1.25rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ color: 'var(--ad-muted)', fontSize: '0.88rem' }}>Registration Fee</span>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', color: 'var(--ad-fg)', letterSpacing: '1px' }}>
            $700.00
          </span>
        </div>

        <p style={{ color: 'var(--ad-muted)', fontSize: '0.83rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          Your waiver has been signed. A one-time registration fee of <strong style={{ color: 'var(--ad-fg)' }}>$700</strong> is
          required to complete your registration. You will be redirected to Stripe's
          secure payment page.
        </p>

        {error && (
          <div className="ad-alert ad-alert--error" style={{ display: 'flex', alignItems: 'center' }}>
            <i className="fa-solid fa-circle-xmark" style={{ marginRight: '0.45rem' }} />
            {error}
          </div>
        )}

        <button
          onClick={handlePay}
          disabled={paying}
          className="cta"
          style={{ width: '100%', padding: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}
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
          className="ad-btn"
          style={{ width: '100%', padding: '0.65rem', justifyContent: 'center' }}
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

  const waiting = loading || !user;
  // Standalone mode: waiver viewer at /admin/waivers/[userId]
  // Authenticated as admin (guard above), but no sidebar or topbar needed.
  const isStandalone = /^\/admin\/waivers\/[^/]+$/.test(pathname);
  const isAdmin = user?.role === 'admin';
  const dashTone = getDashTone(pathname);

  const bootScreen = waiting ? (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'linear-gradient(165deg, #071a45 0%, #0b2566 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span className="spinner" style={{ width: 32, height: 32, borderWidth: 3, margin: 0 }} />
    </div>
  ) : null;

  if (isStandalone) {
    return (
      <div className="admin-dash admin-dash--league">
        {bootScreen}
        {children}
      </div>
    );
  }

  return (
    <div className={`admin-dash admin-dash--${dashTone}`}>
      {bootScreen}
      {user && showPaymentPrompt && <PaymentPrompt onDismiss={() => setShowPaymentPrompt(false)} />}
      {user && (
        <Sidebar role={user.role} isCaptain={user.is_captain} waiverSigned={!!user.waiver_signed} sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}

      <div className="db-main ad-main">
        <AdminStarCrop size={dashTone === 'home' ? 200 : 260} />
        {user && <Topbar user={user} onMenuToggle={() => setSidebarOpen((v) => !v)} />}

        <main className="ad-content">
          {children}
        </main>

        <footer className="ad-foot">
          <div className="ad-divider__stars" aria-hidden="true">
            <ChicagoStar size={10} variant="official" />
            <ChicagoStar size={10} variant="official" />
            <ChicagoStar size={10} variant="official" />
            <ChicagoStar size={10} variant="official" />
          </div>
          <span className="ad-foot__mark">TekkyFutbol · Chicago</span>
        </footer>
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
