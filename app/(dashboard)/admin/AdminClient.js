'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getApplications, approveApplication, rejectApplication } from '@/services/adminApi';
import {
  APPLICATION_STATUS,
  STATUS_LABEL,
  STATUS_COLOR,
  STATUS_FILTERS,
  ITEMS_PER_PAGE,
} from '@/constants/admin';

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const colors = STATUS_COLOR[status] ?? STATUS_COLOR[APPLICATION_STATUS.PENDING];
  return (
    <span style={{
      display: 'inline-block',
      padding: '0.25rem 0.75rem',
      borderRadius: 40,
      fontSize: '0.8rem',
      fontWeight: 600,
      background: colors.bg,
      border: `1px solid ${colors.border}`,
      color: colors.text,
      whiteSpace: 'nowrap',
    }}>
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

function ActionButton({ onClick, disabled, color, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '0.35rem 0.9rem',
        borderRadius: 6,
        border: `1px solid ${color}`,
        background: 'transparent',
        color,
        fontSize: '0.82rem',
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transition: 'background 0.2s',
        fontFamily: 'inherit',
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = `${color}22`; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
    >
      {children}
    </button>
  );
}

function FilterTab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '0.45rem 1.1rem',
        borderRadius: 40,
        border: '1px solid',
        borderColor: active ? 'var(--tekky-blue)' : 'rgba(0,116,255,0.25)',
        background: active ? 'rgba(0,116,255,0.15)' : 'transparent',
        color: active ? 'var(--tekky-blue)' : 'var(--muted)',
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: '0.95rem',
        letterSpacing: '0.5px',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      {label}
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AdminClient() {
  const { user, loading: authLoading } = useAuth();

  const [applications, setApplications] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  // Track which row is mid-action: { [id]: 'approving' | 'rejecting' }
  const [actionPending, setActionPending] = useState({});
  // Inline action errors: { [id]: string }
  const [actionErrors, setActionErrors] = useState({});

  // ── Fetch applications ─────────────────────────────────────────────────────
  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setFetchError('');
    try {
      const res = await getApplications({ status: statusFilter, page });
      setApplications(res.data);
      setTotal(res.total);
    } catch (err) {
      setFetchError(err.message || 'Failed to load applications.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page]);

  useEffect(() => {
    if (user?.role === 'admin') fetchApplications();
  }, [fetchApplications, user]);

  // Reset to page 1 when filter changes
  useEffect(() => { setPage(1); }, [statusFilter]);

  // ── Approve / Reject ───────────────────────────────────────────────────────
  async function handleApprove(id) {
    setActionPending((p) => ({ ...p, [id]: 'approving' }));
    setActionErrors((e) => { const n = { ...e }; delete n[id]; return n; });
    try {
      const updated = await approveApplication(id);
      setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)));
    } catch (err) {
      setActionErrors((e) => ({ ...e, [id]: err.message || 'Approve failed.' }));
    } finally {
      setActionPending((p) => { const n = { ...p }; delete n[id]; return n; });
    }
  }

  async function handleReject(id) {
    setActionPending((p) => ({ ...p, [id]: 'rejecting' }));
    setActionErrors((e) => { const n = { ...e }; delete n[id]; return n; });
    try {
      const updated = await rejectApplication(id);
      setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)));
    } catch (err) {
      setActionErrors((e) => ({ ...e, [id]: err.message || 'Reject failed.' }));
    } finally {
      setActionPending((p) => { const n = { ...p }; delete n[id]; return n; });
    }
  }

  // ── Derived ────────────────────────────────────────────────────────────────
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const isActionBusy = (id) => Boolean(actionPending[id]);

  // ── Render ─────────────────────────────────────────────────────────────────
  if (authLoading || !user) return null;

  return (
    <div style={{ maxWidth: 1200 }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.4rem', marginBottom: '0.25rem' }}>
          Applications
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
          {loading ? 'Loading…' : `${total} total application${total !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {STATUS_FILTERS.map((f) => (
          <FilterTab
            key={f.value}
            label={f.label}
            active={statusFilter === f.value}
            onClick={() => setStatusFilter(f.value)}
          />
        ))}
        <button
          onClick={fetchApplications}
          style={{ marginLeft: 'auto', background: 'none', border: '1px solid rgba(0,116,255,0.3)', borderRadius: 6, padding: '0.45rem 0.9rem', color: 'var(--muted)', cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'inherit' }}
        >
          ↺ Refresh
        </button>
      </div>

      {/* Fetch error */}
      {fetchError && (
        <div role="alert" style={{ background: 'rgba(255,60,60,0.12)', border: '1px solid rgba(255,60,60,0.4)', borderRadius: 8, padding: '0.8rem 1rem', color: '#ff6b6b', marginBottom: '1.5rem' }}>
          {fetchError}
          <button onClick={fetchApplications} style={{ marginLeft: '1rem', background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit' }}>
            Retry
          </button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ height: 56, borderRadius: 8, background: 'rgba(0,116,255,0.06)', border: '1px solid rgba(0,116,255,0.1)', animation: 'pulse 1.5s ease-in-out infinite' }} />
          ))}
        </div>
      )}

      {/* Applications table */}
      {!loading && !fetchError && (
        applications.length === 0 ? (
          <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '3rem 0' }}>
            No applications found{statusFilter ? ` with status "${STATUS_LABEL[statusFilter]}"` : ''}.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(0,116,255,0.3)' }}>
                  {['Name', 'Email', 'Type', 'Division', 'Status', 'Submitted', 'Actions'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.6rem 0.8rem', color: 'var(--tekky-blue)', fontFamily: "'Bebas Neue', sans-serif", fontSize: '0.95rem', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <>
                    <tr
                      key={app.id}
                      style={{ borderBottom: '1px solid rgba(0,116,255,0.1)', transition: 'background 0.15s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,116,255,0.05)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <td style={{ padding: '0.75rem 0.8rem', color: 'var(--fg)', fontWeight: 600 }}>{app.name}</td>
                      <td style={{ padding: '0.75rem 0.8rem', color: 'var(--muted)', fontSize: '0.88rem' }}>{app.email}</td>
                      <td style={{ padding: '0.75rem 0.8rem', color: 'var(--muted)', fontSize: '0.88rem', textTransform: 'capitalize' }}>
                        {app.applicationType?.replace('_', ' ')}
                      </td>
                      <td style={{ padding: '0.75rem 0.8rem', color: 'var(--muted)', fontSize: '0.88rem', textTransform: 'capitalize' }}>
                        {app.preferredDivision}
                      </td>
                      <td style={{ padding: '0.75rem 0.8rem' }}>
                        <StatusBadge status={app.status} />
                      </td>
                      <td style={{ padding: '0.75rem 0.8rem', color: 'var(--muted)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                        {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td style={{ padding: '0.75rem 0.8rem' }}>
                        {app.status === APPLICATION_STATUS.PENDING ? (
                          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                            <ActionButton
                              onClick={() => handleApprove(app.id)}
                              disabled={isActionBusy(app.id)}
                              color="#00c864"
                            >
                              {actionPending[app.id] === 'approving' ? '…' : 'Approve'}
                            </ActionButton>
                            <ActionButton
                              onClick={() => handleReject(app.id)}
                              disabled={isActionBusy(app.id)}
                              color="#ff3c3c"
                            >
                              {actionPending[app.id] === 'rejecting' ? '…' : 'Reject'}
                            </ActionButton>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>—</span>
                        )}
                      </td>
                    </tr>
                    {/* Inline action error for this row */}
                    {actionErrors[app.id] && (
                      <tr key={`${app.id}-err`}>
                        <td colSpan={7} style={{ padding: '0 0.8rem 0.5rem', color: '#ff6b6b', fontSize: '0.82rem' }}>
                          {actionErrors[app.id]}
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '2rem' }}>
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            style={{ background: 'none', border: '1px solid rgba(0,116,255,0.3)', borderRadius: 6, padding: '0.4rem 0.9rem', color: page === 1 ? 'var(--muted)' : 'var(--fg)', cursor: page === 1 ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}
          >
            ← Prev
          </button>
          <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            style={{ background: 'none', border: '1px solid rgba(0,116,255,0.3)', borderRadius: 6, padding: '0.4rem 0.9rem', color: page === totalPages ? 'var(--muted)' : 'var(--fg)', cursor: page === totalPages ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}
          >
            Next →
          </button>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
