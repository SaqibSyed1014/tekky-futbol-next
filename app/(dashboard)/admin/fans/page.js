'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAdminFans } from '@/services/adminApi';
import { AdminLoader, AdminStarsDivider } from '@/components/admin/ChicagoStar';
import { PremiumInput } from '@/components/dashboard/DashboardControls';

const DIVISION_LABEL = { north: 'North Court', south: 'South Court' };

const AUTH_METHOD_STYLE = {
  google:       { label: 'Google',        icon: 'fa-brands fa-google', bg: 'rgba(66,133,244,0.12)',  border: 'rgba(66,133,244,0.35)',  color: '#8ab4ff' },
  apple:        { label: 'Apple',         icon: 'fa-brands fa-apple',  bg: 'rgba(255,255,255,0.08)', border: 'rgba(255,255,255,0.25)', color: '#e5e5e5' },
  google_apple: { label: 'Google + Apple',icon: 'fa-solid fa-link',    bg: 'rgba(160,100,255,0.12)', border: 'rgba(160,100,255,0.35)', color: '#c9a8ff' },
  email:        { label: 'Email',         icon: 'fa-solid fa-envelope',bg: 'rgba(0,200,100,0.1)',    border: 'rgba(0,200,100,0.3)',    color: '#00c864' },
};

function AuthMethodBadge({ method }) {
  const s = AUTH_METHOD_STYLE[method] ?? AUTH_METHOD_STYLE.email;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
      fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 40,
      background: s.bg, border: `1px solid ${s.border}`, color: s.color,
    }}>
      <i className={s.icon} style={{ fontSize: '0.75rem' }} />
      {s.label}
    </span>
  );
}

function Banner({ type, children }) {
  if (!children) return null;
  const s = type === 'error'
    ? { bg: 'rgba(255,60,60,0.1)', border: 'rgba(255,60,60,0.35)', color: '#ff6b6b', icon: 'fa-solid fa-circle-xmark' }
    : { bg: 'rgba(0,200,100,0.1)', border: 'rgba(0,200,100,0.35)', color: '#00c864', icon: 'fa-solid fa-circle-check' };
  return (
    <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 8, padding: '0.75rem 1rem', color: s.color, fontSize: '0.88rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <i className={s.icon} /><span>{children}</span>
    </div>
  );
}

export default function AdminFansPage() {
  const { user, loading: authLoading } = useAuth();

  const [fans,         setFans]         = useState([]);
  const [initialLoad,  setInitialLoad]  = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [error,        setError]        = useState('');
  const [search,       setSearch]       = useState('');
  const [authMethod,   setAuthMethod]   = useState('');
  const [division,     setDivision]     = useState('');

  const load = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setTableLoading(true);
    setError('');
    try {
      const data = await getAdminFans({ search, auth_method: authMethod, division });
      setFans(data.results ?? data);
    } catch {
      setError('Failed to load fans.');
    } finally {
      setTableLoading(false);
      setInitialLoad(false);
    }
  }, [search, authMethod, division]);

  useEffect(() => {
    if (!authLoading && user) load();
  }, [authLoading, user, load]);

  if (authLoading || initialLoad) {
    return <AdminLoader />;
  }

  const googleCount = fans.filter((f) => f.auth_method === 'google' || f.auth_method === 'google_apple').length;

  return (
    <div className="ad-page" style={{ maxWidth: 1100 }}>
      <div className="ad-page-head">
        <p className="ad-kicker">Community</p>
        <h1 className="ad-title">Fans</h1>
        <p className="ad-sub">Registered fan accounts, favorite division, and how they sign in.</p>
      </div>
      <AdminStarsDivider />

      {/* ── Filters ── */}
      <div className="ad-toolbar" style={{ flexWrap: 'wrap' }}>
        <PremiumInput
          type="text"
          icon="fa-solid fa-magnifying-glass"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && load()}
          style={{ flex: 1, minWidth: 200 }}
        />
        <select
          value={authMethod}
          onChange={(e) => setAuthMethod(e.target.value)}
          className="ad-btn"
          style={{ cursor: 'pointer' }}
        >
          <option value="">All sign-in methods</option>
          <option value="google">Google</option>
          <option value="apple">Apple</option>
          <option value="email">Email &amp; Password</option>
        </select>
        <select
          value={division}
          onChange={(e) => setDivision(e.target.value)}
          className="ad-btn"
          style={{ cursor: 'pointer' }}
        >
          <option value="">All divisions</option>
          <option value="north">North Court</option>
          <option value="south">South Court</option>
        </select>
        <button onClick={load} className="cta" style={{ padding: '0.55rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
          <i className="fa-solid fa-rotate-right" /> Refresh
        </button>
      </div>

      <Banner type="error">{error}</Banner>

      {!error && (
        <p style={{ color: 'var(--muted)', fontSize: '0.82rem', marginBottom: '1rem' }}>
          {fans.length} fan{fans.length !== 1 ? 's' : ''} found
          {googleCount > 0 && ` · ${googleCount} signed in with Google`}
        </p>
      )}

      {/* ── Fans table ── */}
      {fans.length === 0 && !tableLoading ? (
        <div style={{ background: '#000', border: '1px solid rgba(0,116,255,0.2)', borderRadius: 12, padding: '3rem', textAlign: 'center' }}>
          <i className="fa-solid fa-heart" style={{ fontSize: '2.5rem', color: 'var(--muted)', marginBottom: '1rem', display: 'block' }} />
          <p style={{ color: 'var(--muted)' }}>No fans found.</p>
        </div>
      ) : (
        <div className="ad-panel" style={{ position: 'relative' }}>
          {tableLoading && (
            <div style={{
              position: 'absolute', inset: 0, zIndex: 10,
              background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 12,
            }}>
              <span className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
            </div>
          )}
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead>
                <tr>
                  {['Fan', 'Favorite Division', 'Zip Code', 'Sign-In Method', 'Joined'].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fans.map((f) => (
                  <tr key={f.id}>
                    <td>
                      <div className="ad-table__name">{f.name || '—'}</div>
                      <div className="ad-table__meta">{f.email}</div>
                    </td>
                    <td className={f.favorite_division ? 'ad-table__name' : 'ad-table__empty'}>
                      {DIVISION_LABEL[f.favorite_division] || '—'}
                    </td>
                    <td className={f.zip_code ? 'ad-table__name' : 'ad-table__empty'}>
                      {f.zip_code || '—'}
                    </td>
                    <td>
                      <AuthMethodBadge method={f.auth_method} />
                    </td>
                    <td className="ad-table__meta">
                      {f.created_at ? new Date(f.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
