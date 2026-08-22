'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAdminWaiverSigned, getAdminWaiverUnsigned } from '@/services/waiverApi';
import { AdminStarsDivider } from '@/components/admin/ChicagoStar';
import StatCard from '@/components/admin/StatCard';

const TABS = [
  { key: 'signed',   label: 'Signed',   icon: 'fa-solid fa-circle-check' },
  { key: 'unsigned', label: 'Unsigned', icon: 'fa-solid fa-circle-xmark'  },
];

// ─── Shared table primitives ──────────────────────────────────────────────────

function Table({ children }) {
  return (
    <div className="ad-table-wrap">
      <table className="ad-table">{children}</table>
    </div>
  );
}

function Th({ children, actions }) {
  return <th className={actions ? 'ad-table__col-actions' : undefined}>{children}</th>;
}

function Td({ children, muted, date, actions, name }) {
  const cls = [
    muted && 'ad-table__muted',
    date && 'ad-table__date',
    actions && 'ad-table__col-actions',
  ].filter(Boolean).join(' ');
  return (
    <td className={cls || undefined}>
      {name ? <span className="ad-table__name">{children}</span> : children}
    </td>
  );
}

function RoleBadge({ role, isCaptain }) {
  const label = role === 'admin' ? 'Admin' : isCaptain ? 'Captain' : 'Player';
  const color = role === 'admin' ? '#0074ff' : isCaptain ? '#f0b429' : '#00c864';
  return (
    <span style={{
      fontSize: '0.7rem', fontWeight: 700, fontFamily: 'var(--ad-display)',
      letterSpacing: '1px', color,
      background: `${color}15`,
      border: `1px solid ${color}40`,
      borderRadius: 4, padding: '0.15rem 0.5rem',
    }}>
      {label}
    </span>
  );
}

function EmptyState({ tab }) {
  const isSigned = tab === 'signed';
  return (
    <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
      <i
        className={isSigned ? 'fa-solid fa-file-signature' : 'fa-solid fa-circle-check'}
        style={{ fontSize: '2.5rem', color: isSigned ? 'var(--muted)' : '#00c864', marginBottom: '0.75rem', display: 'block' }}
      />
      <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: 0 }}>
        {isSigned ? 'No signed waivers yet.' : 'All users have signed the waiver!'}
      </p>
    </div>
  );
}

// ─── Signed table ─────────────────────────────────────────────────────────────

function AgeBadge({ isMinor }) {
  const label = isMinor ? 'Minor' : 'Adult';
  const color = isMinor ? '#f0b429' : '#00c864';
  return (
    <span style={{
      fontSize: '0.7rem', fontWeight: 700, fontFamily: 'var(--ad-display)',
      letterSpacing: '1px', color,
      background: `${color}15`,
      border: `1px solid ${color}40`,
      borderRadius: 4, padding: '0.15rem 0.5rem',
    }}>
      {label}
    </span>
  );
}

function SignedTable({ rows }) {
  if (!rows.length) return <EmptyState tab="signed" />;
  return (
    <Table>
      <thead>
        <tr>
          <Th>Name</Th>
          <Th>Email</Th>
          <Th>Signed At</Th>
          <Th>Age Group</Th>
          <Th actions>Actions</Th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            <Td name>{row.user_name || '—'}</Td>
            <Td muted>{row.user_email}</Td>
            <Td date>
              {new Date(row.signed_at).toLocaleString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </Td>
            <Td><AgeBadge isMinor={row.is_minor} /></Td>
            <Td actions>
              <button
                onClick={() => window.open(`/admin/waivers/${row.user_id}`, '_blank', 'noopener,noreferrer')}
                style={{
                  display:     'inline-flex',
                  alignItems:  'center',
                  gap:         '0.4rem',
                  padding:     '0.35rem 0.8rem',
                  background:  'rgba(0,116,255,0.1)',
                  border:      '1px solid rgba(0,116,255,0.35)',
                  borderRadius: 6,
                  color:       'var(--tekky-blue)',
                  fontSize:    '0.78rem',
                  fontWeight:  600,
                  whiteSpace:  'nowrap',
                  cursor:      'pointer',
                  fontFamily:  'inherit',
                  transition:  'background 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,116,255,0.2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,116,255,0.1)'; }}
              >
                <i className="fa-solid fa-eye" style={{ fontSize: '0.72rem' }} />
                View Waiver
              </button>
            </Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

// ─── Unsigned table ───────────────────────────────────────────────────────────

function UnsignedTable({ rows }) {
  if (!rows.length) return <EmptyState tab="unsigned" />;
  return (
    <Table>
      <thead>
        <tr>
          <Th>Name</Th>
          <Th>Email</Th>
          <Th>Role</Th>
          <Th>Registered</Th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            <Td name>{row.name || '—'}</Td>
            <Td muted>{row.email}</Td>
            <Td><RoleBadge role={row.role} isCaptain={row.is_captain} /></Td>
            <Td date>
              {new Date(row.created_at).toLocaleString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric',
              })}
            </Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

// ─── Main client ──────────────────────────────────────────────────────────────

const ROLE_FILTERS = [
  { key: 'all',      label: 'All',      icon: 'fa-solid fa-users' },
  { key: 'captains', label: 'Captains', icon: 'fa-solid fa-shield-halved' },
  { key: 'players',  label: 'Players',  icon: 'fa-solid fa-user' },
];

export default function AdminWaiversClient() {
  const [activeTab,   setActiveTab]   = useState('signed');
  const [roleFilter,  setRoleFilter]  = useState('all');
  const [signed,      setSigned]      = useState([]);
  const [unsigned,    setUnsigned]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');

  const [signedTotal,   setSignedTotal]   = useState(0);
  const [unsignedTotal, setUnsignedTotal] = useState(0);

  const loadData = useCallback(async (filter) => {
    setLoading(true);
    setError('');

    const params = {};
    if (filter === 'captains') params.is_captain = 'true';
    if (filter === 'players')  params.is_captain = 'false';

    try {
      const [signedRes, unsignedRes] = await Promise.all([
        getAdminWaiverSigned(params),
        getAdminWaiverUnsigned(params),
      ]);
      setSigned(signedRes.results ?? signedRes);
      setUnsigned(unsignedRes.results ?? unsignedRes);
      setSignedTotal(signedRes.count ?? (signedRes.results ?? signedRes).length);
      setUnsignedTotal(unsignedRes.count ?? (unsignedRes.results ?? unsignedRes).length);
    } catch {
      setError('Failed to load waiver data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(roleFilter); }, [loadData, roleFilter]);

  return (
    <div className="ad-page" style={{ maxWidth: 1100 }}>

      <div className="ad-page-head">
        <p className="ad-kicker">League</p>
        <h2 className="ad-title">Waivers</h2>
        <p className="ad-sub">
          Track which players and captains have signed the participant waiver.
        </p>
      </div>
      <AdminStarsDivider />

      {/* Stats */}
      <div className="ad-stats">
        <StatCard label="Signed" value={signedTotal} icon="fa-solid fa-circle-check" />
        <StatCard label="Unsigned" value={unsignedTotal} icon="fa-solid fa-circle-xmark" />
        <StatCard
          label="Completion"
          value={signedTotal + unsignedTotal > 0 ? `${Math.round((signedTotal / (signedTotal + unsignedTotal)) * 100)}%` : '—'}
          icon="fa-solid fa-chart-pie"
        />
      </div>

      {/* Role filter pills */}
      <div className="ad-toolbar">
        {ROLE_FILTERS.map((f) => {
          const active = roleFilter === f.key;
          return (
            <button
              type="button"
              key={f.key}
              onClick={() => setRoleFilter(f.key)}
              className={`ad-pill${active ? ' is-active' : ''}`}
            >
              <i className={f.icon} style={{ fontSize: '0.72rem' }} />
              {f.label}
            </button>
          );
        })}
      </div>

      {error && (
        <div style={{
          background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.3)',
          borderRadius: 8, padding: '0.8rem 1rem', color: '#ff6b6b',
          marginBottom: '1.25rem', fontSize: '0.9rem',
        }}>
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="ad-panel">
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(0,116,255,0.15)' }}>
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            const count  = tab.key === 'signed' ? signedTotal : unsignedTotal;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  flex: 1, padding: '0.85rem 1.25rem',
                  background: active ? 'rgba(0,116,255,0.1)' : 'transparent',
                  border: 'none',
                  borderBottom: active ? '2px solid var(--tekky-blue)' : '2px solid transparent',
                  color: active ? '#fff' : 'var(--muted)',
                  fontSize: '0.88rem', fontWeight: active ? 600 : 400,
                  cursor: 'pointer', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  fontFamily: 'inherit',
                }}
              >
                <i className={tab.icon} style={{ fontSize: '0.82rem', color: active ? (tab.key === 'signed' ? '#00c864' : '#ffb400') : 'inherit' }} />
                {tab.label}
                <span style={{
                  fontSize: '0.72rem', fontWeight: 700,
                  background: active ? 'rgba(0,116,255,0.25)' : 'rgba(255,255,255,0.08)',
                  borderRadius: 10, padding: '0.1rem 0.45rem',
                  color: active ? 'var(--tekky-blue)' : 'var(--muted)',
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div style={{ padding: '1.25rem' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2.5rem' }}>
              <span className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
            </div>
          ) : activeTab === 'signed' ? (
            <SignedTable rows={signed} />
          ) : (
            <UnsignedTable rows={unsigned} />
          )}
        </div>
      </div>
    </div>
  );
}
