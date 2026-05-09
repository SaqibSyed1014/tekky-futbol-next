'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getJoinPage, respondToInvite } from '@/services/teamsApi';
import { auth } from '@/services/api';

// ─── Sub-components ───────────────────────────────────────────────────────────

function PageShell({ children }) {
  return (
    <div style={{
      minHeight: '100vh', background: '#000',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1.25rem',
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '1.8rem', letterSpacing: '3px',
            color: 'var(--tekky-blue)',
            textShadow: '0 0 14px rgba(0,116,255,0.5)',
          }}>
            TekkyFutbol
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}

function Card({ children }) {
  return (
    <div style={{
      background: '#0a0a0a',
      border: '1px solid rgba(0,116,255,0.25)',
      borderRadius: 16,
      padding: '2rem 2rem',
      boxShadow: '0 0 40px rgba(0,116,255,0.1)',
    }}>
      {children}
    </div>
  );
}

function TeamInfo({ team }) {
  return (
    <div style={{
      background: 'rgba(0,116,255,0.05)',
      border: '1px solid rgba(0,116,255,0.18)',
      borderRadius: 10, padding: '1rem 1.2rem',
      display: 'flex', gap: '1rem', alignItems: 'center',
      marginBottom: '1.5rem',
    }}>
      {team.logo_url ? (
        <img src={team.logo_url} alt="logo" style={{ width: 52, height: 52, objectFit: 'contain', borderRadius: 6, flexShrink: 0 }} />
      ) : (
        <div style={{ width: 52, height: 52, borderRadius: 6, background: 'rgba(0,116,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <i className="fa-solid fa-shield-halved" style={{ color: 'rgba(0,116,255,0.5)', fontSize: '1.4rem' }} />
        </div>
      )}
      <div>
        <p style={{ margin: 0, fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.3rem', letterSpacing: '1px' }}>
          {team.name}
        </p>
        <p style={{ margin: '0.15rem 0 0', fontSize: '0.8rem', color: 'var(--muted)' }}>
          Captain: {team.captainName} &nbsp;·&nbsp; {team.playerCount}/{team.max_players} players
        </p>
      </div>
    </div>
  );
}

function ActionBtn({ onClick, disabled, color, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        flex: 1, padding: '0.7rem 1rem',
        borderRadius: 8, border: `1px solid ${color}`,
        background: `${color}15`, color,
        fontSize: '0.95rem', fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transition: 'background 0.15s', fontFamily: 'inherit',
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = `${color}30`; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = `${color}15`; }}
    >
      {children}
    </button>
  );
}

// ─── State renderers ──────────────────────────────────────────────────────────

function StatePanel({ icon, color, title, message, action }) {
  return (
    <Card>
      <div style={{ textAlign: 'center', padding: '0.5rem 0 1.25rem' }}>
        <i className={icon} style={{ fontSize: '2.8rem', color, marginBottom: '1rem', display: 'block' }} />
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.6rem', color, margin: '0 0 0.6rem', letterSpacing: '1px' }}>
          {title}
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
          {message}
        </p>
        {action}
      </div>
    </Card>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function JoinPageClient({ token }) {
  const router  = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [pageData,  setPageData]  = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [acting,    setActing]    = useState(null); // 'accept' | 'reject'
  const [done,      setDone]      = useState(null); // 'accepted' | 'rejected'
  const [actionErr, setActionErr] = useState('');

  useEffect(() => {
    getJoinPage(token)
      .then(setPageData)
      .catch(() => setPageData({ valid: false, error: 'Invite not found.' }))
      .finally(() => setLoading(false));
  }, [token]);

  async function handleAction(action) {
    setActing(action);
    setActionErr('');
    try {
      await respondToInvite(token, action);
      setDone(action === 'accept' ? 'accepted' : 'rejected');
      if (action === 'accept') {
        // Redirect to dashboard with success flag after short delay
        setTimeout(() => router.push('/user?joined=1'), 1800);
      }
    } catch (err) {
      setActionErr(err.message || 'Something went wrong. Please try again.');
    } finally {
      setActing(null);
    }
  }

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading || authLoading) {
    return (
      <PageShell>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <span className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
        </div>
      </PageShell>
    );
  }

  // ── Not logged in ────────────────────────────────────────────────────────────
  if (!user) {
    const returnUrl = encodeURIComponent(`/join/${token}`);
    return (
      <PageShell>
        <StatePanel
          icon="fa-solid fa-lock"
          color="var(--tekky-blue)"
          title="Login Required"
          message="You need to be logged in to respond to this team invite. Please log in and you'll be brought back here."
          action={
            <Link
              href={`/login?next=${returnUrl}`}
              style={{
                display: 'inline-block', padding: '0.65rem 1.8rem',
                background: 'var(--tekky-blue)', color: '#fff',
                borderRadius: 8, fontWeight: 700, fontSize: '0.95rem',
                textDecoration: 'none', letterSpacing: '0.3px',
              }}
            >
              Log In to Continue
            </Link>
          }
        />
      </PageShell>
    );
  }

  // ── Done: accepted ───────────────────────────────────────────────────────────
  if (done === 'accepted') {
    return (
      <PageShell>
        <StatePanel
          icon="fa-solid fa-circle-check"
          color="#00c864"
          title="You're In!"
          message={`You've accepted the invitation to join ${pageData?.team?.name ?? 'the team'}. Your membership is pending admin approval. Redirecting you to your dashboard…`}
          action={
            <Link href="/user" style={{ color: 'var(--tekky-blue)', fontSize: '0.88rem', textDecoration: 'underline' }}>
              Go to Dashboard
            </Link>
          }
        />
      </PageShell>
    );
  }

  // ── Done: rejected ────────────────────────────────────────────────────────────
  if (done === 'rejected') {
    return (
      <PageShell>
        <StatePanel
          icon="fa-solid fa-circle-xmark"
          color="#ff6b6b"
          title="Invite Declined"
          message="You've declined the invitation. You can close this page."
          action={
            <Link href="/user" style={{ color: 'var(--muted)', fontSize: '0.88rem', textDecoration: 'underline' }}>
              Back to Dashboard
            </Link>
          }
        />
      </PageShell>
    );
  }

  // ── Invalid / not found ───────────────────────────────────────────────────────
  if (!pageData?.valid && !pageData?.team) {
    return (
      <PageShell>
        <StatePanel
          icon="fa-solid fa-link-slash"
          color="#ff6b6b"
          title="Invalid Invite"
          message={pageData?.error || 'This invite link is invalid or has already been used.'}
          action={
            <Link href="/" style={{ color: 'var(--muted)', fontSize: '0.88rem', textDecoration: 'underline' }}>
              Return Home
            </Link>
          }
        />
      </PageShell>
    );
  }

  // ── Expired / already used — show team but disable actions ───────────────────
  const isExpired    = pageData?.isExpired;
  const inviteStatus = pageData?.inviteStatus;
  const isUsed       = inviteStatus && inviteStatus !== 'pending';
  const canAct       = pageData?.valid && !isExpired && !isUsed;

  let stateMessage = null;
  if (isExpired) {
    stateMessage = { icon: 'fa-solid fa-clock', color: '#ffb400', text: 'This invite has expired. Ask your captain to send a new one.' };
  } else if (inviteStatus === 'accepted') {
    stateMessage = { icon: 'fa-solid fa-circle-check', color: '#00c864', text: 'You have already accepted this invite.' };
  } else if (inviteStatus === 'rejected') {
    stateMessage = { icon: 'fa-solid fa-circle-xmark', color: '#ff6b6b', text: 'You have already declined this invite.' };
  } else if (inviteStatus === 'revoked') {
    stateMessage = { icon: 'fa-solid fa-ban', color: '#ff6b6b', text: 'This invite has been revoked by the captain.' };
  }

  return (
    <PageShell>
      <Card>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.6rem', margin: '0 0 0.4rem', letterSpacing: '1px', textAlign: 'center' }}>
          Team Invitation
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.88rem', textAlign: 'center', margin: '0 0 1.5rem' }}>
          {canAct ? 'You have been invited to join a team.' : 'This invitation is no longer active.'}
        </p>

        {/* Team info */}
        {pageData?.team && <TeamInfo team={pageData.team} />}

        {/* State message */}
        {stateMessage && (
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
            background: `${stateMessage.color}12`,
            border: `1px solid ${stateMessage.color}35`,
            borderRadius: 8, padding: '0.7rem 0.9rem', marginBottom: '1.25rem',
          }}>
            <i className={stateMessage.icon} style={{ color: stateMessage.color, marginTop: '0.1rem', flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: '0.88rem', color: stateMessage.color }}>
              {stateMessage.text}
            </p>
          </div>
        )}

        {/* Action error */}
        {actionErr && (
          <div style={{
            background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.3)',
            borderRadius: 8, padding: '0.6rem 0.8rem', marginBottom: '1rem',
            color: '#ff6b6b', fontSize: '0.88rem',
          }}>
            {actionErr}
          </div>
        )}

        {/* Accept / Reject */}
        {canAct && (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <ActionBtn
              color="#00c864"
              disabled={!!acting}
              onClick={() => handleAction('accept')}
            >
              {acting === 'accept' ? '…' : '✓ Accept Invite'}
            </ActionBtn>
            <ActionBtn
              color="#ff3c3c"
              disabled={!!acting}
              onClick={() => handleAction('reject')}
            >
              {acting === 'reject' ? '…' : '✕ Decline'}
            </ActionBtn>
          </div>
        )}

        {!canAct && (
          <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
            <Link href="/user" style={{ color: 'var(--muted)', fontSize: '0.88rem', textDecoration: 'underline' }}>
              Go to Dashboard
            </Link>
          </div>
        )}
      </Card>
    </PageShell>
  );
}
