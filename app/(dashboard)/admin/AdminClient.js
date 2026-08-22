'use client';

import { useState, useEffect, useCallback, Fragment } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  getApplications,
  approveApplication,
  rejectApplication,
  updateApplicationStatus,
} from '@/services/adminApi';
import {
  APPLICATION_STATUS,
  STATUS_LABEL,
  STATUS_COLOR,
  STATUS_FILTERS,
  ITEMS_PER_PAGE,
} from '@/constants/admin';
import { AdminStarsDivider } from '@/components/admin/ChicagoStar';
import StatusBadge from '@/components/admin/StatusBadge';

// ─── Allowed transitions (mirrors backend state machine) ─────────────────────

const ALLOWED_TRANSITIONS = {
  [APPLICATION_STATUS.PENDING]:   [APPLICATION_STATUS.APPROVED, APPLICATION_STATUS.REJECTED, APPLICATION_STATUS.WAITLIST, APPLICATION_STATUS.INTERVIEW],
  [APPLICATION_STATUS.INTERVIEW]: [APPLICATION_STATUS.APPROVED, APPLICATION_STATUS.REJECTED, APPLICATION_STATUS.WAITLIST],
  [APPLICATION_STATUS.WAITLIST]:  [APPLICATION_STATUS.APPROVED, APPLICATION_STATUS.REJECTED, APPLICATION_STATUS.INTERVIEW],
};

// ─── Sub-components ───────────────────────────────────────────────────────────

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
      type="button"
      onClick={onClick}
      className={`ad-pill${active ? ' is-active' : ''}`}
    >
      {label}
    </button>
  );
}

// ─── Status update modal (for waitlist / interview) ───────────────────────────

function StatusModal({ targetStatus, onConfirm, onCancel, loading }) {
  const [note, setNote] = useState('');
  const color = STATUS_COLOR[targetStatus]?.text ?? 'var(--tekky-blue)';
  const label = STATUS_LABEL[targetStatus] ?? targetStatus;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onCancel}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          zIndex: 300,
          animation: 'drawerFadeIn 0.15s ease',
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 440,
        maxWidth: 'calc(100vw - 2rem)',
        background: '#0a0a0a',
        border: `1px solid ${color}44`,
        borderRadius: 12,
        boxShadow: `0 0 40px rgba(0,0,0,0.8), 0 0 20px ${color}18`,
        zIndex: 301,
        padding: '1.75rem',
        animation: 'modalPop 0.2s ease',
      }}>

        {/* Header */}
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{
            fontFamily: 'var(--ad-impact)',
            fontSize: '1.4rem',
            letterSpacing: '1px',
            color,
            margin: 0,
          }}>
            Move to {label}
          </h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.82rem', margin: '0.3rem 0 0' }}>
            Add an optional note that will be visible to the applicant.
          </p>
        </div>

        {/* Note textarea */}
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={`Note for ${label} status (optional)…`}
          rows={4}
          style={{
            width: '100%',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 8,
            color: 'var(--fg)',
            fontSize: '0.9rem',
            padding: '0.7rem 0.9rem',
            resize: 'vertical',
            fontFamily: 'inherit',
            outline: 'none',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = `${color}66`; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
          autoFocus
        />

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              padding: '0.45rem 1.1rem',
              borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'transparent',
              color: 'var(--muted)',
              fontSize: '0.88rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              opacity: loading ? 0.5 : 1,
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(note)}
            disabled={loading}
            style={{
              padding: '0.45rem 1.2rem',
              borderRadius: 6,
              border: `1px solid ${color}`,
              background: `${color}18`,
              color,
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              opacity: loading ? 0.5 : 1,
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = `${color}30`; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = `${color}18`; }}
          >
            {loading ? 'Saving…' : `Confirm ${label}`}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Logo thumbnail (clickable) ───────────────────────────────────────────────

function LogoThumbnail({ url, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="View logo full size"
      style={{
        position: 'relative',
        width: 130,
        height: 130,
        borderRadius: 10,
        border: `1px solid ${hovered ? 'rgba(0,116,255,0.55)' : 'rgba(0,116,255,0.2)'}`,
        background: hovered ? 'rgba(0,116,255,0.08)' : 'rgba(0,116,255,0.03)',
        boxShadow: hovered ? '0 0 18px rgba(0,116,255,0.18)' : '0 0 0px transparent',
        cursor: 'zoom-in',
        padding: 0,
        overflow: 'hidden',
        transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
        display: 'block',
      }}
    >
      <img
        src={url}
        alt="Team logo"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          padding: 10,
          display: 'block',
          transition: 'opacity 0.2s',
          opacity: hovered ? 0.65 : 1,
        }}
      />
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.3rem',
        color: '#fff',
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.5px',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.2s',
        pointerEvents: 'none',
      }}>
        <i className="fa-solid fa-magnifying-glass-plus" style={{ fontSize: '1rem' }} />
        View
      </div>
    </button>
  );
}

// ─── Logo lightbox overlay ────────────────────────────────────────────────────

function LogoLightbox({ url, onClose }) {
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.88)',
          zIndex: 400,
          animation: 'lbFadeIn 0.18s ease',
          backdropFilter: 'blur(4px)',
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 401,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          animation: 'lbPop 0.2s ease',
        }}
      >
        <div style={{
          background: '#0d0d0d',
          border: '1px solid rgba(0,116,255,0.3)',
          borderRadius: 16,
          boxShadow: '0 0 60px rgba(0,116,255,0.15), 0 24px 48px rgba(0,0,0,0.7)',
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
          maxWidth: '90vw',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <span style={{ fontFamily: 'var(--ad-display)', fontSize: '1.1rem', letterSpacing: '1.5px', color: 'var(--tekky-blue)' }}>
              Team Logo
            </span>
            <button
              onClick={onClose}
              aria-label="Close lightbox"
              style={{
                background: 'none',
                border: '1px solid rgba(0,116,255,0.25)',
                borderRadius: 6,
                color: 'var(--muted)',
                padding: '0.3rem 0.55rem',
                cursor: 'pointer',
                fontSize: '0.85rem',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0,116,255,0.6)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0,116,255,0.25)'; e.currentTarget.style.color = 'var(--muted)'; }}
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
          <img
            src={url}
            alt="Team logo full size"
            style={{
              maxWidth: 'min(480px, 80vw)',
              maxHeight: 'min(480px, 70vh)',
              objectFit: 'contain',
              borderRadius: 8,
              background: 'rgba(255,255,255,0.03)',
              padding: 12,
              display: 'block',
            }}
          />
          <p style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: 0 }}>
            Click outside or press × to close
          </p>
        </div>
      </div>
    </>
  );
}

// ─── Application detail drawer ────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <p style={{
      fontFamily: 'var(--ad-impact)',
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

function ApplicationDrawer({ app, onClose, onApprove, onReject, onWaitlist, onInterview, actionPending, onLogoClick }) {
  if (!app) return null;

  const allowedNextStatuses = ALLOWED_TRANSITIONS[app.status] ?? [];
  const canAct = allowedNextStatuses.length > 0;
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
            <h3 style={{ fontFamily: 'var(--ad-impact)', fontSize: '1.4rem', margin: 0, letterSpacing: '1px' }}>
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
            fontFamily: 'var(--ad-display)',
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
              {app.logoUrl && (
                <div style={{ marginBottom: '0.9rem' }}>
                  <p style={{ fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 0.6rem', fontWeight: 600 }}>
                    Team Logo
                  </p>
                  <LogoThumbnail url={app.logoUrl} onClick={() => onLogoClick(app.logoUrl)} />
                </div>
              )}
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

        {/* Footer actions — shown for any non-terminal status */}
        {canAct && (
          <div style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid rgba(0,116,255,0.15)',
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap',
            flexShrink: 0,
          }}>
            {allowedNextStatuses.includes(APPLICATION_STATUS.APPROVED) && (
              <ActionButton onClick={() => onApprove(app.id)} disabled={busy} color="#00c864">
                {actionPending[app.id] === 'approving' ? 'Approving…' : '✓ Approve'}
              </ActionButton>
            )}
            {allowedNextStatuses.includes(APPLICATION_STATUS.REJECTED) && (
              <ActionButton onClick={() => onReject(app.id)} disabled={busy} color="#ff3c3c">
                {actionPending[app.id] === 'rejecting' ? 'Rejecting…' : '✕ Reject'}
              </ActionButton>
            )}
            {allowedNextStatuses.includes(APPLICATION_STATUS.WAITLIST) && (
              <ActionButton onClick={() => onWaitlist(app.id)} disabled={busy} color="#a064ff">
                {actionPending[app.id] === 'waitlisting' ? 'Saving…' : '⏳ Waitlist'}
              </ActionButton>
            )}
            {allowedNextStatuses.includes(APPLICATION_STATUS.INTERVIEW) && (
              <ActionButton onClick={() => onInterview(app.id)} disabled={busy} color="#00c8ff">
                {actionPending[app.id] === 'interviewing' ? 'Saving…' : '💬 Interview'}
              </ActionButton>
            )}
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

  // modal = { appId, status } when open, null when closed
  const [modal, setModal] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // lightbox URL — null = closed
  const [lightboxUrl, setLightboxUrl] = useState(null);

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

  // ── Helpers: update local state after a successful action ──────────────────
  function applyUpdate(id, updated) {
    setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)));
    setViewingApp((prev) => (prev?.id === id ? updated : prev));
  }

  // ── Approve ────────────────────────────────────────────────────────────────
  async function handleApprove(id) {
    setActionPending((p) => ({ ...p, [id]: 'approving' }));
    setActionErrors((e) => { const n = { ...e }; delete n[id]; return n; });
    try {
      const updated = await approveApplication(id);
      applyUpdate(id, updated);
    } catch (err) {
      setActionErrors((e) => ({ ...e, [id]: err.message || 'Approve failed.' }));
    } finally {
      setActionPending((p) => { const n = { ...p }; delete n[id]; return n; });
    }
  }

  // ── Reject ─────────────────────────────────────────────────────────────────
  async function handleReject(id) {
    setActionPending((p) => ({ ...p, [id]: 'rejecting' }));
    setActionErrors((e) => { const n = { ...e }; delete n[id]; return n; });
    try {
      const updated = await rejectApplication(id);
      applyUpdate(id, updated);
    } catch (err) {
      setActionErrors((e) => ({ ...e, [id]: err.message || 'Reject failed.' }));
    } finally {
      setActionPending((p) => { const n = { ...p }; delete n[id]; return n; });
    }
  }

  // ── Open modal for waitlist / interview ────────────────────────────────────
  function handleWaitlist(id)  { setModal({ appId: id, status: APPLICATION_STATUS.WAITLIST  }); }
  function handleInterview(id) { setModal({ appId: id, status: APPLICATION_STATUS.INTERVIEW }); }

  // ── Confirm modal action ───────────────────────────────────────────────────
  async function handleModalConfirm(note) {
    const { appId, status } = modal;
    const pendingKey = status === APPLICATION_STATUS.WAITLIST ? 'waitlisting' : 'interviewing';

    setModalLoading(true);
    setActionPending((p) => ({ ...p, [appId]: pendingKey }));
    setActionErrors((e) => { const n = { ...e }; delete n[appId]; return n; });
    try {
      const updated = await updateApplicationStatus(appId, status, note);
      applyUpdate(appId, updated);
      setModal(null);
    } catch (err) {
      setActionErrors((e) => ({ ...e, [appId]: err.message || 'Update failed.' }));
    } finally {
      setModalLoading(false);
      setActionPending((p) => { const n = { ...p }; delete n[appId]; return n; });
    }
  }

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const isActionBusy = (id) => Boolean(actionPending[id]);

  if (authLoading || !user) return null;

  return (
    <div className="ad-page" style={{ maxWidth: 1200 }}>

      <div className="ad-page-head">
        <p className="ad-kicker">League</p>
        <h1 className="ad-title">Applications</h1>
        <p className="ad-sub">
          {loading ? 'Loading…' : `${total} total application${total !== 1 ? 's' : ''}`}
        </p>
      </div>
      <AdminStarsDivider />

      <div className="ad-toolbar">
        {STATUS_FILTERS.map((f) => (
          <FilterTab
            key={f.value}
            label={f.label}
            active={statusFilter === f.value}
            onClick={() => setStatusFilter(f.value)}
          />
        ))}
        <button
          type="button"
          onClick={fetchApplications}
          className="ad-btn ad-btn--ghost"
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
            <div key={i} className="ad-skel" />
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
          <div className="ad-panel ad-table-wrap">
            <table className="ad-table">
              <thead>
                <tr>
                  {['Name', 'Email', 'Type', 'Division', 'Status', 'Submitted', 'Actions'].map((h) => (
                    <th key={h} className={h === 'Actions' ? 'ad-table__col-actions' : undefined}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <Fragment key={app.id}>
                    <tr>
                      <td><span className="ad-table__name">{app.name}</span></td>
                      <td className="ad-table__muted">{app.email}</td>
                      <td className="ad-table__muted" style={{ textTransform: 'capitalize' }}>
                        {app.applicationType?.replace('_', ' ')}
                      </td>
                      <td className="ad-table__muted" style={{ textTransform: 'capitalize' }}>
                        {app.preferredDivision}
                      </td>
                      <td>
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="ad-table__date">
                        {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="ad-table__col-actions">
                        <div className="ad-table__actions">
                          <ActionButton onClick={() => setViewingApp(app)} color="var(--tekky-blue)">
                            View
                          </ActionButton>
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
                      <tr className="ad-table__error">
                        <td colSpan={7}>{actionErrors[app.id]}</td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="ad-pager">
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
        onWaitlist={handleWaitlist}
        onInterview={handleInterview}
        actionPending={actionPending}
        onLogoClick={setLightboxUrl}
      />

      {lightboxUrl && (
        <LogoLightbox url={lightboxUrl} onClose={() => setLightboxUrl(null)} />
      )}

      {/* Status update modal (waitlist / interview) */}
      {modal && (
        <StatusModal
          targetStatus={modal.status}
          onConfirm={handleModalConfirm}
          onCancel={() => setModal(null)}
          loading={modalLoading}
        />
      )}

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
        @keyframes modalPop {
          from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1);    }
        }
        @keyframes lbFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes lbPop {
          from { opacity: 0; transform: translate(-50%, -46%) scale(0.94); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1);    }
        }
      `}</style>
    </div>
  );
}
