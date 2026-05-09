'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getAdminTeams } from '@/services/adminApi';

const ITEMS_PER_PAGE = 20;

function StatusBadge({ status }) {
  const s = status === 'official'
    ? { bg: 'rgba(0,200,100,0.12)', border: 'rgba(0,200,100,0.4)', text: '#00c864', label: 'Official' }
    : { bg: 'rgba(255,180,0,0.12)',  border: 'rgba(255,180,0,0.4)',  text: '#ffb400', label: 'Forming'  };
  return (
    <span style={{
      display: 'inline-block', padding: '0.22rem 0.65rem', borderRadius: 40,
      fontSize: '0.8rem', fontWeight: 600,
      background: s.bg, border: `1px solid ${s.border}`, color: s.text,
      whiteSpace: 'nowrap',
    }}>
      {s.label}
    </span>
  );
}

function RosterBar({ approved, max }) {
  const pct = max > 0 ? Math.min(100, (approved / max) * 100) : 0;
  const color = pct >= 100 ? '#00c864' : pct >= 60 ? '#ffb400' : 'var(--tekky-blue)';
  return (
    <div style={{ minWidth: 120 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
        <span style={{ fontSize: '0.82rem', color, fontWeight: 700 }}>{approved}/{max}</span>
        {max - approved > 0 && (
          <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{max - approved} left</span>
        )}
      </div>
      <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 999, transition: 'width 0.3s' }} />
      </div>
    </div>
  );
}

function FilterTab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '0.4rem 1rem', borderRadius: 40,
        border: `1px solid ${active ? 'var(--tekky-blue)' : 'rgba(0,116,255,0.25)'}`,
        background: active ? 'rgba(0,116,255,0.15)' : 'transparent',
        color: active ? 'var(--tekky-blue)' : 'var(--muted)',
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: '0.9rem', letterSpacing: '0.5px',
        cursor: 'pointer', transition: 'all 0.15s',
      }}
    >
      {label}
    </button>
  );
}

export default function AdminTeamsClient() {
  const [teams,        setTeams]        = useState([]);
  const [total,        setTotal]        = useState(0);
  const [page,         setPage]         = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [search,       setSearch]       = useState('');
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState('');

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getAdminTeams({ status: statusFilter, search, page });
      setTeams(res.results ?? []);
      setTotal(res.count ?? 0);
    } catch (err) {
      setError(err.message || 'Failed to load teams.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search, page]);

  useEffect(() => { fetchTeams(); }, [fetchTeams]);
  useEffect(() => { setPage(1); }, [statusFilter, search]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div style={{ maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.4rem', marginBottom: '0.25rem' }}>
          Teams
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
          {loading ? 'Loading…' : `${total} team${total !== 1 ? 's' : ''} registered`}
        </p>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Status filters */}
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {[
            { value: '',         label: 'All'      },
            { value: 'forming',  label: 'Forming'  },
            { value: 'official', label: 'Official' },
          ].map((f) => (
            <FilterTab key={f.value} label={f.label} active={statusFilter === f.value} onClick={() => setStatusFilter(f.value)} />
          ))}
        </div>

        {/* Search */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search team name…"
          style={{
            padding: '0.45rem 0.8rem',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(0,116,255,0.25)', borderRadius: 6,
            color: 'var(--fg)', fontSize: '0.88rem', fontFamily: 'inherit', outline: 'none',
            minWidth: 200,
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(0,116,255,0.6)'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,116,255,0.25)'; }}
        />

        <button
          onClick={fetchTeams}
          style={{
            marginLeft: 'auto', background: 'none',
            border: '1px solid rgba(0,116,255,0.3)', borderRadius: 6,
            padding: '0.45rem 0.9rem', color: 'var(--muted)',
            cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'inherit',
          }}
        >
          <i className="fa-solid fa-rotate-right" style={{ marginRight: '0.4rem' }} />Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.35)', borderRadius: 8, padding: '0.8rem 1rem', color: '#ff6b6b', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ height: 52, borderRadius: 8, background: 'rgba(0,116,255,0.06)', border: '1px solid rgba(0,116,255,0.1)', animation: 'pulse 1.5s ease-in-out infinite' }} />
          ))}
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        teams.length === 0 ? (
          <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '3rem 0' }}>
            No teams found{statusFilter ? ` with status "${statusFilter}"` : ''}.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(0,116,255,0.3)' }}>
                  {['Team', 'Captain', 'Status', 'Roster', 'Pending', 'Registered', 'Actions'].map((h) => (
                    <th key={h} style={{
                      textAlign: 'left', padding: '0.55rem 0.8rem',
                      color: 'var(--tekky-blue)', fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: '0.9rem', letterSpacing: '0.5px', whiteSpace: 'nowrap',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {teams.map((t) => (
                  <tr
                    key={t.id}
                    style={{ borderBottom: '1px solid rgba(0,116,255,0.08)', transition: 'background 0.12s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,116,255,0.04)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <td style={{ padding: '0.7rem 0.8rem', fontWeight: 700, color: 'var(--fg)', fontSize: '0.92rem' }}>
                      {t.name}
                    </td>
                    <td style={{ padding: '0.7rem 0.8rem' }}>
                      <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--fg)' }}>{t.captainName || '—'}</p>
                      <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--muted)' }}>{t.captainEmail}</p>
                    </td>
                    <td style={{ padding: '0.7rem 0.8rem' }}>
                      <StatusBadge status={t.status} />
                    </td>
                    <td style={{ padding: '0.7rem 0.8rem' }}>
                      <RosterBar approved={t.playerCount} max={t.max_players} />
                    </td>
                    <td style={{ padding: '0.7rem 0.8rem', color: t.pendingCount > 0 ? '#ffb400' : 'var(--muted)', fontWeight: t.pendingCount > 0 ? 700 : 400, fontSize: '0.9rem' }}>
                      {t.pendingCount > 0 ? `${t.pendingCount} pending` : '—'}
                    </td>
                    <td style={{ padding: '0.7rem 0.8rem', color: 'var(--muted)', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                      {t.created_at ? new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                    </td>
                    <td style={{ padding: '0.7rem 0.8rem' }}>
                      {t.pendingCount > 0 && (
                        <Link
                          href={`/admin/memberships?team=${t.id}`}
                          style={{
                            padding: '0.28rem 0.7rem', borderRadius: 6,
                            border: '1px solid #ffb400', color: '#ffb400',
                            fontSize: '0.8rem', fontWeight: 600,
                            textDecoration: 'none', whiteSpace: 'nowrap',
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,180,0,0.12)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                        >
                          Review ({t.pendingCount})
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', marginTop: '2rem', alignItems: 'center' }}>
          <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}
            style={{ background: 'none', border: '1px solid rgba(0,116,255,0.3)', borderRadius: 6, padding: '0.4rem 0.9rem', color: page === 1 ? 'var(--muted)' : 'var(--fg)', cursor: page === 1 ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
            ← Prev
          </button>
          <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Page {page} of {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages}
            style={{ background: 'none', border: '1px solid rgba(0,116,255,0.3)', borderRadius: 6, padding: '0.4rem 0.9rem', color: page === totalPages ? 'var(--muted)' : 'var(--fg)', cursor: page === totalPages ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
            Next →
          </button>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}
