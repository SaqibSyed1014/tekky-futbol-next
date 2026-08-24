'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { getAdminMemberships, actOnMembership } from '@/services/adminApi';
import { AdminStarsDivider } from '@/components/admin/ChicagoStar';
import StatusBadge from '@/components/admin/StatusBadge';

const ITEMS_PER_PAGE = 20;

// ─── Sub-components ───────────────────────────────────────────────────────────

function InviteTypeBadge({ type }) {
  const label = type === 'link' ? 'Link' : type === 'direct' ? 'Direct' : type ?? '—';
  const color = type === 'link' ? '#a78bfa' : '#38bdf8';
  return (
    <span style={{
      display: 'inline-block', padding: '0.18rem 0.55rem', borderRadius: 40,
      fontSize: '0.75rem', fontWeight: 600,
      background: `${color}18`, border: `1px solid ${color}40`, color,
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}

function FilterTab({ label, active, onClick }) {
  return (
    <button type="button" onClick={onClick} className={`ad-pill${active ? ' is-active' : ''}`}>
      {label}
    </button>
  );
}

function ActionButton({ label, color, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '0.28rem 0.7rem', borderRadius: 6,
        border: `1px solid ${color}`, color,
        fontSize: '0.8rem', fontWeight: 600,
        background: 'transparent',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transition: 'background 0.15s', whiteSpace: 'nowrap',
        fontFamily: 'inherit',
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = `${color}20`; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
    >
      {label}
    </button>
  );
}

// ─── Confirmation modal ───────────────────────────────────────────────────────

function ConfirmModal({ membership, action, onConfirm, onCancel, loading }) {
  const isApprove = action === 'approve';
  const color = isApprove ? '#00c864' : '#ff3c3c';
  const verb  = isApprove ? 'Approve' : 'Reject';

  return (
    <div className="ad-overlay ad-overlay--center" onClick={onCancel}>
      <div className="ad-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="ad-modal__title" style={{ color, marginBottom: '0.75rem' }}>
          {verb} Membership
        </h3>
        <p style={{ color: 'var(--ad-muted)', fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
          {isApprove
            ? <>Approve <strong style={{ color: 'var(--ad-fg)' }}>{membership.playerName}</strong> to join <strong style={{ color: 'var(--ad-fg)' }}>{membership.teamName}</strong>? They will be added to the official roster.</>
            : <>Reject <strong style={{ color: 'var(--ad-fg)' }}>{membership.playerName}</strong>'s request to join <strong style={{ color: 'var(--ad-fg)' }}>{membership.teamName}</strong>? This will remove their pending membership.</>
          }
        </p>
        <div className="ad-modal__actions">
          <button type="button" className="ad-btn" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button
            type="button"
            className="ad-btn"
            onClick={onConfirm}
            disabled={loading}
            style={{
              borderColor: color,
              background: `${color}20`,
              color,
              fontWeight: 700,
            }}
          >
            {loading ? 'Processing…' : verb}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AdminMembershipsClient() {
  const searchParams = useSearchParams();
  const teamFromUrl  = searchParams.get('team') ?? '';

  const [memberships,   setMemberships]   = useState([]);
  const [total,         setTotal]         = useState(0);
  const [page,          setPage]          = useState(1);
  const [statusFilter,  setStatusFilter]  = useState('pending');
  const [teamFilter,    setTeamFilter]    = useState(teamFromUrl);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState('');

  const [confirm, setConfirm] = useState(null); // { membership, action }
  const [acting,  setActing]  = useState(false);
  const [toast,   setToast]   = useState('');   // success message

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchMemberships = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getAdminMemberships({ status: statusFilter, team: teamFilter, page });
      setMemberships(res.results ?? []);
      setTotal(res.count ?? 0);
    } catch (err) {
      setError(err.message || 'Failed to load memberships.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, teamFilter, page]);

  useEffect(() => { fetchMemberships(); }, [fetchMemberships]);
  useEffect(() => { setPage(1); }, [statusFilter, teamFilter]);

  // Sync teamFilter with URL param on mount only
  useEffect(() => {
    if (teamFromUrl) setTeamFilter(teamFromUrl);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Action handlers ────────────────────────────────────────────────────────
  function openConfirm(membership, action) {
    setConfirm({ membership, action });
  }

  async function handleConfirm() {
    if (!confirm) return;
    setActing(true);
    try {
      await actOnMembership(confirm.membership.id, confirm.action);
      const verb = confirm.action === 'approve' ? 'approved' : 'rejected';
      showToast(`Membership ${verb} successfully.`);
      setConfirm(null);
      fetchMemberships();
    } catch (err) {
      setError(err.message || 'Action failed.');
      setConfirm(null);
    } finally {
      setActing(false);
    }
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  }

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="ad-page" style={{ maxWidth: 1200 }}>
      <div className="ad-page-head">
        <p className="ad-kicker">League</p>
        <h1 className="ad-title">Memberships</h1>
        <p className="ad-sub">
          {loading ? 'Loading…' : `${total} membership${total !== 1 ? 's' : ''} found`}
        </p>
      </div>
      <AdminStarsDivider />

      <div className="ad-toolbar">
        {/* Status filter tabs */}
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {[
            { value: 'pending',  label: 'Pending'  },
            { value: 'approved', label: 'Approved' },
            { value: 'all',      label: 'All'      },
          ].map((f) => (
            <FilterTab key={f.value} label={f.label} active={statusFilter === f.value} onClick={() => setStatusFilter(f.value)} />
          ))}
        </div>

        {/* Team ID filter (pre-filled from URL) */}
        <input
          value={teamFilter}
          onChange={(e) => setTeamFilter(e.target.value)}
          placeholder="Filter by Team ID…"
          style={{
            padding: '0.45rem 0.8rem',
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${teamFilter ? 'rgba(0,116,255,0.6)' : 'rgba(0,116,255,0.25)'}`,
            borderRadius: 6, color: 'var(--fg)', fontSize: '0.88rem',
            fontFamily: 'inherit', outline: 'none', minWidth: 240,
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(0,116,255,0.6)'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = teamFilter ? 'rgba(0,116,255,0.6)' : 'rgba(0,116,255,0.25)'; }}
        />
        {teamFilter && (
          <button
            onClick={() => setTeamFilter('')}
            style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'inherit', padding: '0.45rem 0.4rem' }}
          >
            ✕ Clear
          </button>
        )}

        <button
          type="button"
          onClick={fetchMemberships}
          className="cta ad-btn--ghost"
          style={{ padding: '0.55rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
        >
          <i className="fa-solid fa-rotate-right" /> Refresh
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
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="ad-skel" />
          ))}
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        memberships.length === 0 ? (
          <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '3rem 0' }}>
            No {statusFilter !== 'all' ? statusFilter : ''} memberships found{teamFilter ? ' for this team' : ''}.
          </p>
        ) : (
          <div className="ad-panel ad-table-wrap">
            <table className="ad-table">
              <thead>
                <tr>
                  {['Player', 'Team', 'Captain', 'Status', 'Via', 'Joined', 'Actions'].map((h) => (
                    <th key={h} className={h === 'Actions' ? 'ad-table__col-actions' : undefined}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {memberships.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <div className="ad-table__name">{m.playerName || '—'}</div>
                      <div className="ad-table__meta">{m.playerEmail}</div>
                    </td>
                    <td>
                      <div className="ad-table__name">{m.teamName || '—'}</div>
                      <div className="ad-table__meta" style={{ fontFamily: 'monospace' }}>{m.teamId?.slice(0, 8)}…</div>
                    </td>
                    <td className="ad-table__muted">{m.captainEmail || '—'}</td>
                    <td>
                      <StatusBadge bucket={m.membershipBucket} />
                    </td>
                    <td>
                      <InviteTypeBadge type={m.inviteType} />
                    </td>
                    <td className="ad-table__date">
                      {m.joinedAt ? new Date(m.joinedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                    </td>
                    <td className="ad-table__col-actions">
                      {m.membershipBucket === 'pending_admin' ? (
                        <div className="ad-table__actions">
                          <ActionButton
                            label="Approve"
                            color="#00c864"
                            disabled={acting}
                            onClick={() => openConfirm(m, 'approve')}
                          />
                          <ActionButton
                            label="Reject"
                            color="#ff3c3c"
                            disabled={acting}
                            onClick={() => openConfirm(m, 'reject')}
                          />
                        </div>
                      ) : (
                        <span className="ad-table__empty">—</span>
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
        <div className="ad-pager">
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

      {/* Confirm modal */}
      {confirm && (
        <ConfirmModal
          membership={confirm.membership}
          action={confirm.action}
          loading={acting}
          onConfirm={handleConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 2000,
          background: 'rgba(0,200,100,0.15)', border: '1px solid rgba(0,200,100,0.4)',
          borderRadius: 10, padding: '0.8rem 1.2rem',
          color: '#00c864', fontSize: '0.9rem', fontWeight: 600,
          boxShadow: '0 4px 20px rgba(0,200,100,0.2)',
          animation: 'fadeInUp 0.25s ease',
        }}>
          <i className="fa-solid fa-circle-check" style={{ marginRight: '0.5rem' }} />
          {toast}
        </div>
      )}

      <style>{`
        @keyframes pulse     { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes fadeInUp  { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
