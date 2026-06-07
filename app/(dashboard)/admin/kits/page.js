'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { getAdminKits, getKitExportUrl } from '@/services/kitsApi';

function Banner({ type, children }) {
  const styles = {
    error: { bg: 'rgba(255,60,60,0.1)', border: 'rgba(255,60,60,0.35)', color: '#ff6b6b', icon: 'fa-solid fa-circle-xmark' },
    info:  { bg: 'rgba(0,116,255,0.08)', border: 'rgba(0,116,255,0.3)', color: '#60a0ff', icon: 'fa-solid fa-circle-info' },
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
      background: 'rgba(0,116,255,0.08)',
      border: '1px solid rgba(0,116,255,0.2)',
      borderRadius: 4, fontSize: '0.75rem', color: '#aaa',
    }}>
      <span style={{ color: 'var(--muted)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{label}</span>
      <strong style={{ color: '#fff' }}>{value}</strong>
    </span>
  );
}

function TeamKitCard({ entry }) {
  const [expanded, setExpanded] = useState(true);

  const completedOrders = entry.orders?.length ?? 0;

  return (
    <div style={{
      background: '#000',
      border: '1px solid rgba(0,116,255,0.2)',
      borderRadius: 12,
      marginBottom: '1.25rem',
      overflow: 'hidden',
    }}>
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
            <strong style={{ fontSize: '1rem', color: '#fff' }}>{entry.teamName}</strong>
            <span style={{
              fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.3px',
              padding: '0.15rem 0.5rem', borderRadius: 4,
              background: entry.is_locked ? 'rgba(0,200,100,0.1)' : 'rgba(255,180,0,0.1)',
              border: `1px solid ${entry.is_locked ? 'rgba(0,200,100,0.3)' : 'rgba(255,180,0,0.3)'}`,
              color: entry.is_locked ? '#00c864' : '#ffb400',
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
        <div style={{ overflowX: 'auto' }}>
          {entry.orders.length === 0 ? (
            <p style={{ padding: '1rem 1.25rem', color: 'var(--muted)', fontSize: '0.88rem', margin: 0 }}>
              No size orders submitted yet.
            </p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(0,116,255,0.1)' }}>
                  {['Player', 'Jersey', 'Shorts', 'Socks', 'Name on Kit', 'Number'].map((h) => (
                    <th key={h} style={{
                      padding: '0.6rem 1rem', textAlign: 'left',
                      color: 'var(--muted)', fontWeight: 600, fontSize: '0.75rem',
                      textTransform: 'uppercase', letterSpacing: '0.4px', whiteSpace: 'nowrap',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {entry.orders.map((order) => (
                  <tr
                    key={order.id}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    <td style={{ padding: '0.65rem 1rem', color: '#fff', whiteSpace: 'nowrap' }}>
                      <div style={{ fontWeight: 500 }}>{order.userName || '—'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{order.userEmail}</div>
                    </td>
                    <td style={{ padding: '0.65rem 1rem' }}>
                      <SizeBadge label="J" value={order.jersey_size} />
                    </td>
                    <td style={{ padding: '0.65rem 1rem' }}>
                      <SizeBadge label="Sh" value={order.shorts_size} />
                    </td>
                    <td style={{ padding: '0.65rem 1rem' }}>
                      <SizeBadge label="So" value={order.socks_size} />
                    </td>
                    <td style={{ padding: '0.65rem 1rem', color: order.name_on_kit ? '#fff' : 'var(--muted)' }}>
                      {order.name_on_kit || '—'}
                    </td>
                    <td style={{ padding: '0.65rem 1rem', color: order.number_on_kit != null ? '#fff' : 'var(--muted)', fontWeight: order.number_on_kit != null ? 700 : 400 }}>
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
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
        <span className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
      </div>
    );
  }

  const totalOrders = entries.reduce((sum, e) => sum + (e.orders?.length ?? 0), 0);

  return (
    <div style={{ maxWidth: 900 }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{
            background: 'rgba(0,116,255,0.08)', border: '1px solid rgba(0,116,255,0.2)',
            borderRadius: 8, padding: '0.5rem 1rem', fontSize: '0.85rem',
          }}>
            <span style={{ color: 'var(--muted)' }}>Teams: </span>
            <strong style={{ color: '#fff' }}>{entries.length}</strong>
          </div>
          <div style={{
            background: 'rgba(0,116,255,0.08)', border: '1px solid rgba(0,116,255,0.2)',
            borderRadius: 8, padding: '0.5rem 1rem', fontSize: '0.85rem',
          }}>
            <span style={{ color: 'var(--muted)' }}>Total orders: </span>
            <strong style={{ color: '#fff' }}>{totalOrders}</strong>
          </div>
        </div>

        <a
          href={getKitExportUrl()}
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.55rem 1.25rem', borderRadius: 8,
            background: 'rgba(0,200,100,0.1)', border: '1px solid rgba(0,200,100,0.3)',
            color: '#00c864', fontSize: '0.88rem', fontWeight: 600,
            textDecoration: 'none', transition: 'all 0.15s',
          }}
        >
          <i className="fa-solid fa-file-csv" /> Export CSV
        </a>
      </div>

      <Banner type="error">{error}</Banner>

      {entries.length === 0 ? (
        <div style={{
          background: '#000', border: '1px solid rgba(0,116,255,0.2)',
          borderRadius: 12, padding: '3rem', textAlign: 'center',
        }}>
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
