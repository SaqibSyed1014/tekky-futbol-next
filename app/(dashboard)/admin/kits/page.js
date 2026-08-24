'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { getAdminKits } from '@/services/kitsApi';
import { AdminLoader, AdminStarsDivider } from '@/components/admin/ChicagoStar';
import StatCard from '@/components/admin/StatCard';

function Banner({ type, children }) {
  const styles = {
    error: { bg: 'rgba(214,69,69,0.08)', border: 'rgba(214,69,69,0.28)', color: '#d64545', icon: 'fa-solid fa-circle-xmark' },
    info:  { bg: 'rgba(21,83,209,0.08)', border: 'rgba(21,83,209,0.22)', color: 'var(--ad-blue-deep)', icon: 'fa-solid fa-circle-info' },
  };
  const s = styles[type] || styles.info;
  if (!children) return null;
  return (
    <div style={{
      background: s.bg, border: `1px solid ${s.border}`, borderRadius: 8,
      padding: '0.75rem 1rem', color: s.color, fontSize: '0.88rem',
      marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
    }}>
      <i className={s.icon} />
      <span>{children}</span>
    </div>
  );
}

function SizeBadge({ label, value }) {
  if (!value) return null;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
      padding: '0.15rem 0.5rem',
      background: 'rgba(21,83,209,0.08)',
      border: '1px solid rgba(21,83,209,0.2)',
      borderRadius: 4, fontSize: '0.75rem', color: 'var(--ad-fg)',
    }}>
      <span style={{ color: 'var(--ad-muted)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{label}</span>
      <strong style={{ color: 'var(--ad-blue-deep)' }}>{value}</strong>
    </span>
  );
}

function TeamKitCard({ entry }) {
  const [expanded, setExpanded] = useState(true);

  const completedOrders = entry.orders?.length ?? 0;

  return (
    <div className="ad-panel" style={{ marginBottom: '1.25rem' }}>
      {/* Header */}
      <div
        onClick={() => setExpanded((v) => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: '1rem',
          padding: '1rem 1.25rem', cursor: 'pointer',
          borderBottom: expanded ? '1px solid rgba(0,116,255,0.12)' : 'none',
        }}
      >
        {/* Kit thumbnail */}
        <div style={{ position: 'relative', width: 48, height: 48, flexShrink: 0 }}>
          <Image
            src={`/images/kits/${entry.kit_slug}.webp`}
            alt={entry.kit_slug}
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <strong style={{ fontSize: '1rem', color: 'var(--ad-fg)' }}>{entry.teamName}</strong>
            <span style={{
              fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.3px',
              padding: '0.15rem 0.5rem', borderRadius: 4,
              background: entry.is_locked ? 'rgba(10,138,74,0.1)' : 'rgba(196,125,0,0.1)',
              border: `1px solid ${entry.is_locked ? 'rgba(10,138,74,0.28)' : 'rgba(196,125,0,0.28)'}`,
              color: entry.is_locked ? '#0a8a4a' : '#c47d00',
            }}>
              <i className={`fa-solid ${entry.is_locked ? 'fa-lock' : 'fa-lock-open'}`} style={{ marginRight: '0.3rem', fontSize: '0.6rem' }} />
              {entry.is_locked ? 'Locked' : 'Not locked'}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{entry.kit_slug}</span>
          </div>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: 'var(--muted)' }}>
            Captain: {entry.captainName || entry.captainEmail} &nbsp;·&nbsp; {completedOrders} order{completedOrders !== 1 ? 's' : ''} submitted
          </p>
        </div>

        <i
          className={`fa-solid fa-chevron-${expanded ? 'up' : 'down'}`}
          style={{ color: 'var(--muted)', fontSize: '0.8rem', flexShrink: 0 }}
        />
      </div>

      {/* Orders table */}
      {expanded && (
        <div className="ad-table-wrap">
          {entry.orders.length === 0 ? (
            <p style={{ padding: '1rem 1.25rem', color: 'var(--muted)', fontSize: '0.88rem', margin: 0 }}>
              No size orders submitted yet.
            </p>
          ) : (
            <table className="ad-table">
              <thead>
                <tr>
                  {['Player', 'Jersey', 'Shorts', 'Socks', 'Name on Kit', 'Number'].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {entry.orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <div className="ad-table__name">{order.userName || '—'}</div>
                      <div className="ad-table__meta">{order.userEmail}</div>
                    </td>
                    <td>
                      <SizeBadge label="J" value={order.jersey_size} />
                    </td>
                    <td>
                      <SizeBadge label="Sh" value={order.shorts_size} />
                    </td>
                    <td>
                      <SizeBadge label="So" value={order.socks_size} />
                    </td>
                    <td className={order.name_on_kit ? 'ad-table__name' : 'ad-table__empty'}>
                      {order.name_on_kit || '—'}
                    </td>
                    <td className={order.number_on_kit != null ? 'ad-table__num' : 'ad-table__empty'}>
                      {order.number_on_kit != null ? `#${order.number_on_kit}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminKitsPage() {
  const { user, loading: authLoading } = useAuth();

  const [entries,  setEntries]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  useEffect(() => {
    if (authLoading || !user) return;
    (async () => {
      try {
        const data = await getAdminKits();
        setEntries(data);
      } catch {
        setError('Failed to load kit orders.');
      } finally {
        setLoading(false);
      }
    })();
  }, [authLoading, user]);

  if (authLoading || loading) {
    return <AdminLoader />;
  }

  const totalOrders = entries.reduce((sum, e) => sum + (e.orders?.length ?? 0), 0);
  const lockedCount = entries.filter((e) => e.is_locked).length;

  return (
    <div className="ad-page" style={{ maxWidth: 900 }}>
      <div
        className="ad-photo-rail"
        style={{ backgroundImage: "url('/images/Hoodie.webp')" }}
      >
        <span className="ad-photo-rail__label">Kit lock · size pipeline <span className="ad-stencil">Merch</span></span>
      </div>

      <div className="ad-page-head">
        <p className="ad-kicker">Shopping</p>
        <h1 className="ad-title">Kit Orders</h1>
        <p className="ad-sub">Team selections, lock status, and submitted sizes.</p>
      </div>
      <AdminStarsDivider />

      <div className="ad-stats">
        <StatCard label="Teams" value={entries.length} icon="fa-solid fa-shield-halved" />
        <StatCard label="Total Orders" value={totalOrders} icon="fa-solid fa-shirt" />
        <StatCard label="Locked" value={lockedCount} icon="fa-solid fa-lock" />
      </div>

      <Banner type="error">{error}</Banner>

      {entries.length === 0 ? (
        <div className="ad-panel ad-empty">
          <i className="fa-solid fa-shirt" style={{ fontSize: '2.5rem', color: 'var(--muted)', marginBottom: '1rem', display: 'block' }} />
          <p style={{ color: 'var(--muted)', fontSize: '0.95rem', margin: 0 }}>
            No kit selections have been made yet.
          </p>
        </div>
      ) : (
        entries.map((entry) => <TeamKitCard key={entry.id} entry={entry} />)
      )}
    </div>
  );
}
