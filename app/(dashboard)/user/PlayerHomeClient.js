'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getMyApplications } from '@/services/applicationsApi';

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

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function PlayerHomeClient({ user }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyApplications()
      .then((res) => setApplications(res.results ?? []))
      .catch((err) => setError(err.message || 'Failed to load your applications.'))
      .finally(() => setLoading(false));
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
          Track your league application status below.
        </p>
      </div>

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
