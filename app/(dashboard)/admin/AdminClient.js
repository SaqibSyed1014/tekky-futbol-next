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

// ─── Application detail drawer ────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <p style={{
      fontFamily: "'Bebas Neue', sans-serif",
      fontSize: '1.2rem',
      letterSpacing: '1.5px',
      color: 'var(--tekky-blue)',
      textTransform: 'uppercase',
      margin: '1.4rem 0 0.6rem',
      borderBottom: '1px solid rgba(0,116,255,0.15)',
      paddingBottom: '0.35rem',
    }}>
      {children}
    </p>
  );
}

function DetailRow({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div style={{ marginBottom: '0.7rem' }}>
      <p style={{ fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 0.15rem', fontWeight: 600 }}>
        {label}
      </p>
      <p style={{ fontSize: '0.92rem', color: 'var(--fg)', margin: 0, wordBreak: 'break-word' }}>
        {value}
      </p>
    </div>
  );
}

function ApplicationDrawer({ app, onClose, onApprove, onReject, actionPending }) {
  if (!app) return null;

  const isPending = app.status === APPLICATION_STATUS.PENDING;
  const busy = Boolean(actionPending[app.id]);
  const date = app.createdAt
    ? new Date(app.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '—';

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.65)',
          zIndex: 200,
          animation: 'drawerFadeIn 0.2s ease',
        }}
      />

      {/* Panel */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: 420,
        maxWidth: '100vw',
        background: '#0a0a0a',
        borderLeft: '1px solid rgba(0,116,255,0.25)',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.7)',
        zIndex: 201,
        display: 'flex',
        flexDirection: 'column',
        animation: 'drawerSlideIn 0.25s ease',
      }}>

        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(0,116,255,0.15)',
          flexShrink: 0,
        }}>
          <div>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', margin: 0, letterSpacing: '1px' }}>
              Application Detail
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.75rem', margin: '0.15rem 0 0' }}>
              Submitted {date}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'none',
              border: '1px solid rgba(0,116,255,0.25)',
              borderRadius: 6,
              color: 'var(--muted)',
              padding: '0.35rem 0.6rem',
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0,116,255,0.6)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0,116,255,0.25)'; e.currentTarget.style.color = 'var(--muted)'; }}
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Status + type row */}
        <div style={{ padding: '0.85rem 1.5rem', borderBottom: '1px solid rgba(0,116,255,0.1)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <StatusBadge status={app.status} />
          <span style={{
            fontSize: '1rem',
            fontFamily: "'Bebas Neue', sans-serif",
            letterSpacing: '1px',
            color: 'var(--tekky-blue)',
            background: 'rgba(0,116,255,0.1)',
            border: '1px solid rgba(0,116,255,0.25)',
            borderRadius: 4,
            padding: '0.15rem 0.5rem',
          }}>
            {app.applicationType === 'full_team' ? 'Full Team' : 'Free Agent'}
          </span>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 1.5rem 1.5rem' }}>

          <SectionLabel>Personal Info</SectionLabel>
          <DetailRow label="Full Name" value={app.name} />
          <DetailRow label="Email"     value={app.email} />
          <DetailRow label="Phone"     value={app.phone} />
          <DetailRow label="Gender"    value={app.gender ? app.gender.charAt(0).toUpperCase() + app.gender.slice(1) : null} />
          <DetailRow label="Instagram" value={app.instagram} />

          <SectionLabel>League Info</SectionLabel>
          <DetailRow label="Preferred Division" value={app.preferredDivision ? app.preferredDivision.charAt(0).toUpperCase() + app.preferredDivision.slice(1) : null} />
          {app.applicationType === 'full_team' && (
            <>
              <DetailRow label="Team Name"   value={app.teamName}   />
              <DetailRow label="Roster Size" value={app.rosterSize} />
            </>
          )}

          <SectionLabel>Reason for Competing</SectionLabel>
          <p style={{ fontSize: '0.9rem', color: 'var(--fg)', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>
            {app.reasonForCompeting || '—'}
          </p>

          {app.adminNotes && (
            <>
              <SectionLabel>Admin Notes</SectionLabel>
              <p style={{ fontSize: '0.9rem', color: '#ffb400', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>
                {app.adminNotes}
              </p>
            </>
          )}

        </div>

        {/* Footer actions — only for pending */}
        {isPending && (
          <div style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid rgba(0,116,255,0.15)',
            display: 'flex',
            gap: '0.75rem',
            flexShrink: 0,
          }}>
            <ActionButton onClick={() => onApprove(app.id)} disabled={busy} color="#00c864">
              {actionPending[app.id] === 'approving' ? 'Approving…' : '✓ Approve'}
            </ActionButton>
            <ActionButton onClick={() => onReject(app.id)} disabled={busy} color="#ff3c3c">
              {actionPending[app.id] === 'rejecting' ? 'Rejecting…' : '✕ Reject'}
            </ActionButton>
          </div>
        )}
      </div>
    </>
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
  const [actionPending, setActionPending] = useState({});
  const [actionErrors, setActionErrors] = useState({});
  const [viewingApp, setViewingApp] = useState(null);

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

  useEffect(() => { setPage(1); }, [statusFilter]);

  // ── Approve / Reject ───────────────────────────────────────────────────────
  async function handleApprove(id) {
    setActionPending((p) => ({ ...p, [id]: 'approving' }));
    setActionErrors((e) => { const n = { ...e }; delete n[id]; return n; });
    try {
      const updated = await approveApplication(id);
      setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)));
      setViewingApp((prev) => (prev?.id === id ? updated : prev));
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
      setViewingApp((prev) => (prev?.id === id ? updated : prev));
    } catch (err) {
      setActionErrors((e) => ({ ...e, [id]: err.message || 'Reject failed.' }));
    } finally {
      setActionPending((p) => { const n = { ...p }; delete n[id]; return n; });
    }
  }

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const isActionBusy = (id) => Boolean(actionPending[id]);

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
          style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: 'auto', background: 'none', border: '1px solid rgba(0,116,255,0.3)', borderRadius: 6, padding: '0.45rem 0.9rem', color: 'var(--muted)', cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'inherit' }}
        >
          <svg width="25px" height="25px" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 19c-3.6 0 -6.5 -2.9 -6.5 -6.5 0 -1.6 0.6 -3.1 1.65 -4.3l0.75 0.65C7.5 9.85 7 11.15 7 12.5c0 3.05 2.45 5.5 5.5 5.5 0.8 0 1.55 -0.15 2.3 -0.5l0.4 0.9Q13.925 19 12.5 19" fill="currentColor"/><path d="m17.35 16.85 -0.75 -0.65c0.9 -1 1.4 -2.3 1.4 -3.65 0 -3.05 -2.45 -5.5 -5.5 -5.5 -0.8 0 -1.55 0.15 -2.3 0.5l-0.4 -0.9q1.275 -0.6 2.7 -0.6c3.6 0 6.5 2.9 6.5 6.5 0 1.55 -0.6 3.1 -1.65 4.3" fill="currentColor"/><path d="M9 12h-1v-3h-3v-1h4z" fill="currentColor"/><path d="M20 17h-4v-4h1v3h3z" fill="currentColor"/></svg>
          Refresh
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
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'nowrap' }}>
                          {/* View — always visible */}
                          <ActionButton onClick={() => setViewingApp(app)} color="var(--tekky-blue)">
                            View
                          </ActionButton>

                          {/* Approve / Reject — pending only */}
                          {app.status === APPLICATION_STATUS.PENDING && (
                            <>
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
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
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
          <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            style={{ background: 'none', border: '1px solid rgba(0,116,255,0.3)', borderRadius: 6, padding: '0.4rem 0.9rem', color: page === totalPages ? 'var(--muted)' : 'var(--fg)', cursor: page === totalPages ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}
          >
            Next →
          </button>
        </div>
      )}

      {/* Detail drawer */}
      <ApplicationDrawer
        app={viewingApp}
        onClose={() => setViewingApp(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        actionPending={actionPending}
      />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        @keyframes drawerSlideIn {
          from { transform: translateX(100%); }
          to   { transform: translateX(0);    }
        }
        @keyframes drawerFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
