'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getMyApplications } from '@/services/applicationsApi';
import { getMyMembership } from '@/services/teamsApi';

// ─── Status badge ────────────────────────────────────────────────────────────

const STATUS_STYLES = {
  pending:  { bg: 'rgba(255,180,0,0.12)',  border: 'rgba(255,180,0,0.45)',  text: '#ffb400', icon: 'fa-solid fa-clock'         },
  approved: { bg: 'rgba(0,200,100,0.12)',  border: 'rgba(0,200,100,0.45)',  text: '#00c864', icon: 'fa-solid fa-circle-check'  },
  rejected: { bg: 'rgba(255,60,60,0.12)',  border: 'rgba(255,60,60,0.45)', text: '#ff3c3c',  icon: 'fa-solid fa-circle-xmark'  },
  waitlist: { bg: 'rgba(160,100,255,0.12)',border: 'rgba(160,100,255,0.4)',  text: '#a064ff', icon: 'fa-solid fa-hourglass-half' },
  interview:{ bg: 'rgba(0,200,255,0.12)',  border: 'rgba(0,200,255,0.4)',   text: '#00c8ff', icon: 'fa-solid fa-comments'       },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.pending;
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.4rem',
      padding: '0.3rem 0.8rem',
      borderRadius: 40,
      fontSize: '0.8rem',
      fontWeight: 600,
      background: s.bg,
      border: `1px solid ${s.border}`,
      color: s.text,
      whiteSpace: 'nowrap',
    }}>
      <i className={s.icon} style={{ fontSize: '0.75rem' }} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// ─── Application card ─────────────────────────────────────────────────────────

function AppCard({ app }) {
  const typeLabel = app.type === 'captain' ? 'Full Team' : 'Free Agent';
  const date = app.created_at ? new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  return (
    <div style={{
      background: '#000',
      border: '1px solid rgba(0,116,255,0.2)',
      borderRadius: 12,
      padding: '1.3rem 1.5rem',
      boxShadow: '0 0 16px rgba(0,116,255,0.07)',
      transition: 'box-shadow 0.2s',
    }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 24px rgba(0,116,255,0.15)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 0 16px rgba(0,116,255,0.07)'; }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.9rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <span style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '0.8rem',
            letterSpacing: '1px',
            color: 'var(--tekky-blue)',
            background: 'rgba(0,116,255,0.1)',
            border: '1px solid rgba(0,116,255,0.25)',
            borderRadius: 4,
            padding: '0.15rem 0.5rem',
          }}>
            {typeLabel}
          </span>
        </div>
        <StatusBadge status={app.status} />
      </div>

      {/* Details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem 1.5rem' }}>
        <Detail label="Submitted" value={date} />
        <Detail label="Division" value={app.preferred_division || '—'} capitalize />
        {app.type === 'captain' && app.metadata?.team_name && (
          <Detail label="Team Name" value={app.metadata.team_name} />
        )}
        {app.admin_notes && (
          <div style={{ gridColumn: '1 / -1' }}>
            <Detail label="Admin Notes" value={app.admin_notes} />
          </div>
        )}
      </div>

      {/* Status message */}
      {app.status === 'pending' && (
        <p style={{ marginTop: '1rem', fontSize: '0.82rem', color: 'var(--muted)', borderTop: '1px solid rgba(0,116,255,0.1)', paddingTop: '0.8rem' }}>
          Your application is under review. We&apos;ll be in touch once a decision has been made.
        </p>
      )}
      {app.status === 'approved' && (
        <p style={{ marginTop: '1rem', fontSize: '0.82rem', color: '#00c864', borderTop: '1px solid rgba(0,200,100,0.15)', paddingTop: '0.8rem' }}>
          🎉 Congratulations! Your application was approved. Check your email for next steps.
        </p>
      )}
      {app.status === 'rejected' && (
        <p style={{ marginTop: '1rem', fontSize: '0.82rem', color: '#ff6b6b', borderTop: '1px solid rgba(255,60,60,0.15)', paddingTop: '0.8rem' }}>
          Your application was not approved this time.{app.admin_notes ? '' : ' Feel free to apply again next season.'}
        </p>
      )}
      {app.status === 'waitlist' && (
        <p style={{ marginTop: '1rem', fontSize: '0.82rem', color: '#a064ff', borderTop: '1px solid rgba(160,100,255,0.15)', paddingTop: '0.8rem' }}>
          You&apos;re on the waitlist. We&apos;ll reach out if a spot opens up.{app.admin_notes ? '' : ' Stay tuned.'}
        </p>
      )}
      {app.status === 'interview' && (
        <p style={{ marginTop: '1rem', fontSize: '0.82rem', color: '#00c8ff', borderTop: '1px solid rgba(0,200,255,0.15)', paddingTop: '0.8rem' }}>
          You&apos;ve been selected for an interview. Check your email for scheduling details.
        </p>
      )}
    </div>
  );
}

function Detail({ label, value, capitalize }) {
  return (
    <div>
      <p style={{ fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 0.15rem', fontWeight: 600 }}>
        {label}
      </p>
      <p style={{ fontSize: '0.9rem', color: 'var(--fg)', margin: 0, textTransform: capitalize ? 'capitalize' : 'none' }}>
        {value || '—'}
      </p>
    </div>
  );
}

// ─── Team card (shown when player is on a team) ───────────────────────────────

const MEMBERSHIP_STYLE = {
  pending_admin: { bg: 'rgba(255,180,0,0.12)', border: 'rgba(255,180,0,0.4)', text: '#ffb400', label: 'Pending Admin Approval', icon: 'fa-solid fa-clock' },
  approved:      { bg: 'rgba(0,200,100,0.12)', border: 'rgba(0,200,100,0.4)', text: '#00c864', label: 'Approved',               icon: 'fa-solid fa-circle-check' },
};

function TeamCard({ membership, teammates }) {
  const s = MEMBERSHIP_STYLE[membership.membershipBucket] ?? MEMBERSHIP_STYLE.pending_admin;
  return (
    <div style={{
      background: '#000', border: '1px solid rgba(0,116,255,0.25)',
      borderRadius: 12, padding: '1.4rem 1.5rem',
      boxShadow: '0 0 20px rgba(0,116,255,0.08)', marginBottom: '2rem',
    }}>
      {/* Team header */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {membership.teamLogoUrl ? (
          <img
            src={membership.teamLogoUrl}
            alt="Team logo"
            style={{ width: 60, height: 60, objectFit: 'contain', borderRadius: 8, border: '1px solid rgba(0,116,255,0.2)', padding: 4, flexShrink: 0 }}
          />
        ) : (
          <div style={{ width: 60, height: 60, borderRadius: 8, border: '1px solid rgba(0,116,255,0.15)', background: 'rgba(0,116,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i className="fa-solid fa-shield-halved" style={{ color: 'rgba(0,116,255,0.4)', fontSize: '1.5rem' }} />
          </div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', margin: 0, letterSpacing: '1px' }}>
              {membership.teamName}
            </h3>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
              padding: '0.2rem 0.6rem', borderRadius: 40, fontSize: '0.75rem', fontWeight: 600,
              background: membership.teamStatus === 'official' ? 'rgba(0,200,100,0.1)' : 'rgba(255,180,0,0.1)',
              border: `1px solid ${membership.teamStatus === 'official' ? 'rgba(0,200,100,0.35)' : 'rgba(255,180,0,0.35)'}`,
              color: membership.teamStatus === 'official' ? '#00c864' : '#ffb400',
            }}>
              {membership.teamStatus === 'official' ? 'Official' : 'Forming'}
            </span>
          </div>
          {/* Own membership status */}
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
            padding: '0.25rem 0.7rem', borderRadius: 40, fontSize: '0.8rem', fontWeight: 600,
            background: s.bg, border: `1px solid ${s.border}`, color: s.text,
          }}>
            <i className={s.icon} style={{ fontSize: '0.72rem' }} />
            Your Status: {s.label}
          </span>
        </div>
      </div>

      {membership.membershipBucket === 'pending_admin' && (
        <p style={{
          fontSize: '0.82rem', color: '#ffb400',
          background: 'rgba(255,180,0,0.07)', border: '1px solid rgba(255,180,0,0.2)',
          borderRadius: 6, padding: '0.6rem 0.8rem', margin: '0 0 1rem',
        }}>
          <i className="fa-solid fa-circle-info" style={{ marginRight: '0.4rem' }} />
          You&apos;ve joined the team! An admin will review and approve your membership shortly.
        </p>
      )}

      {/* Teammates */}
      {teammates.length > 0 && (
        <>
          <p style={{ fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, margin: '0 0 0.6rem' }}>
            Teammates ({teammates.length})
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {teammates.map((t) => (
              <div key={t.id} style={{
                background: 'rgba(0,116,255,0.06)',
                border: '1px solid rgba(0,116,255,0.15)',
                borderRadius: 8, padding: '0.4rem 0.75rem',
                fontSize: '0.85rem', color: 'var(--fg)',
              }}>
                <span style={{ fontWeight: 600 }}>{t.name || t.email}</span>
                {t.division && (
                  <span style={{ marginLeft: '0.4rem', fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'capitalize' }}>
                    · {t.division}
                  </span>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function PlayerHomeClient({ user }) {
  const searchParams = useSearchParams();
  const justJoined  = searchParams?.get('joined') === '1';

  const [applications,  setApplications]  = useState([]);
  const [membership,    setMembership]    = useState(null);   // null = not on a team
  const [teammates,     setTeammates]     = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState('');

  useEffect(() => {
    Promise.all([
      getMyApplications().catch(() => ({ results: [] })),
      getMyMembership().catch(() => null),
    ]).then(([appRes, membershipRes]) => {
      setApplications(appRes?.results ?? []);
      if (membershipRes) {
        setMembership(membershipRes.membership);
        setTeammates(membershipRes.teammates ?? []);
      }
    }).catch((err) => {
      setError(err.message || 'Failed to load dashboard data.');
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Welcome */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '1.8rem',
          color: 'var(--fg)',
          margin: 0,
          textShadow: 'none',
          letterSpacing: '1px',
        }}>
          Welcome, {user?.name || 'Player'} 👋
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginTop: '0.35rem' }}>
          {membership ? 'Your team and application status.' : 'Track your league application status below.'}
        </p>
      </div>

      {/* Join success banner */}
      {justJoined && (
        <div style={{
          background: 'rgba(0,200,100,0.1)', border: '1px solid rgba(0,200,100,0.35)',
          borderRadius: 8, padding: '0.8rem 1rem', color: '#00c864',
          marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', gap: '0.6rem', alignItems: 'center',
        }}>
          <i className="fa-solid fa-circle-check" />
          You&apos;ve successfully joined the team! Your membership is pending admin approval.
        </div>
      )}

      {/* Error */}
      {error && (
        <div role="alert" style={{ background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.35)', borderRadius: 8, padding: '0.8rem 1rem', color: '#ff6b6b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[1, 2].map((i) => (
            <div key={i} style={{ height: 140, borderRadius: 12, background: 'rgba(0,116,255,0.05)', border: '1px solid rgba(0,116,255,0.1)', animation: 'playerPulse 1.5s ease-in-out infinite' }} />
          ))}
        </div>
      )}

      {/* Team card — shown when player has a committed membership */}
      {!loading && membership && (
        <TeamCard membership={membership} teammates={teammates} />
      )}

      {/* Applications */}
      {!loading && !error && (
        applications.length === 0 ? (
          <div style={{
            background: '#000',
            border: '1px dashed rgba(0,116,255,0.3)',
            borderRadius: 12,
            padding: '3rem 2rem',
            textAlign: 'center',
          }}>
            <i className="fa-solid fa-inbox" style={{ fontSize: '2.5rem', color: 'rgba(0,116,255,0.3)', marginBottom: '1rem', display: 'block' }} />
            <p style={{ color: 'var(--muted)', marginBottom: '1.2rem' }}>
              You haven&apos;t submitted an application yet.
            </p>
            <Link
              href="/registration"
              style={{
                display: 'inline-block',
                padding: '0.6rem 1.4rem',
                border: '2px solid var(--tekky-blue)',
                borderRadius: 40,
                color: '#fff',
                fontFamily: "'Bebas Neue', sans-serif",
                letterSpacing: '1px',
                boxShadow: '0 0 12px var(--tekky-blue)',
                transition: '0.2s',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--tekky-blue)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              Apply Now
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ color: 'var(--muted)', fontSize: '0.82rem', marginBottom: '0.25rem' }}>
              {applications.length} application{applications.length !== 1 ? 's' : ''} found
            </p>
            {applications.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        )
      )}

      <style>{`
        @keyframes playerPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
