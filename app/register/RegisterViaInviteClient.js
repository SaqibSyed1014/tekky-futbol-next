'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { validateLinkInvite, joinViaLink, registerAndJoin } from '@/services/teamsApi';
import { auth } from '@/services/api';

// ─── Layout shells ────────────────────────────────────────────────────────────

function PageShell({ children }) {
  return (
    <div style={{
      minHeight: '100vh', background: '#000',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1.25rem',
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '1.8rem', letterSpacing: '3px',
              color: 'var(--tekky-blue)',
              textShadow: '0 0 14px rgba(0,116,255,0.5)',
            }}>
              TekkyFutbol
            </span>
          </Link>
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
      padding: '2rem',
      boxShadow: '0 0 40px rgba(0,116,255,0.1)',
    }}>
      {children}
    </div>
  );
}

// ─── Team info banner ─────────────────────────────────────────────────────────

function TeamBanner({ team }) {
  return (
    <div style={{
      display: 'flex', gap: '1rem', alignItems: 'center',
      background: 'rgba(0,116,255,0.05)',
      border: '1px solid rgba(0,116,255,0.18)',
      borderRadius: 10, padding: '1rem 1.2rem',
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
        <p style={{ margin: 0, fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.3rem', letterSpacing: '1px', color: '#fff' }}>
          {team.name}
        </p>
        <p style={{ margin: '0.15rem 0 0', fontSize: '0.8rem', color: 'var(--muted)' }}>
          Captain: {team.captainName} &nbsp;·&nbsp; {team.playerCount}/{team.max_players} players
        </p>
      </div>
    </div>
  );
}

// ─── Shared form input ────────────────────────────────────────────────────────

function Field({ label, type = 'text', value, onChange, placeholder, required, children }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.35rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
        {label}{required && <span style={{ color: '#ff6b6b', marginLeft: 3 }}>*</span>}
      </label>
      {children ?? (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: '0.55rem 0.8rem',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(0,116,255,0.25)', borderRadius: 7,
            color: 'var(--fg)', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(0,116,255,0.6)'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,116,255,0.25)'; }}
        />
      )}
    </div>
  );
}

// ─── State panels (invalid / expired / done) ──────────────────────────────────

function StatePanel({ icon, color, title, message, action }) {
  return (
    <Card>
      <div style={{ textAlign: 'center', padding: '0.5rem 0 1rem' }}>
        <i className={icon} style={{ fontSize: '2.8rem', color, marginBottom: '1rem', display: 'block' }} />
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', color, margin: '0 0 0.6rem', letterSpacing: '1px' }}>
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

// ─── Logged-in player panel ───────────────────────────────────────────────────

function LoggedInPlayerPanel({ user, team, token }) {
  const router = useRouter();
  const [joining, setJoining] = useState(false);
  const [done,    setDone]    = useState(false);
  const [error,   setError]   = useState('');

  async function handleJoin() {
    setJoining(true);
    setError('');
    try {
      await joinViaLink(token);
      setDone(true);
      setTimeout(() => router.push('/user?joined=1'), 1800);
    } catch (err) {
      setError(err.message || 'Failed to join. Please try again.');
    } finally {
      setJoining(false);
    }
  }

  if (done) {
    return (
      <StatePanel
        icon="fa-solid fa-circle-check"
        color="#00c864"
        title="You're In!"
        message={`You've joined ${team.name}. Your membership is pending admin approval. Redirecting to your dashboard…`}
        action={<Link href="/user" style={{ color: 'var(--tekky-blue)', fontSize: '0.88rem', textDecoration: 'underline' }}>Go to Dashboard</Link>}
      />
    );
  }

  return (
    <Card>
      <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', margin: '0 0 0.4rem', letterSpacing: '1px', textAlign: 'center' }}>
        Team Invitation
      </h2>
      <p style={{ color: 'var(--muted)', fontSize: '0.88rem', textAlign: 'center', margin: '0 0 1.5rem' }}>
        You've been invited to join a team.
      </p>

      <TeamBanner team={team} />

      {/* Logged-in as block */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.6rem',
        background: 'rgba(0,116,255,0.06)', border: '1px solid rgba(0,116,255,0.2)',
        borderRadius: 8, padding: '0.7rem 0.9rem', marginBottom: '1.25rem',
      }}>
        <i className="fa-solid fa-user-check" style={{ color: 'var(--tekky-blue)', flexShrink: 0 }} />
        <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--fg)' }}>
          Joining as <strong>{user.name || user.email}</strong>
        </p>
      </div>

      {error && (
        <div style={{ background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.3)', borderRadius: 8, padding: '0.6rem 0.8rem', marginBottom: '1rem', color: '#ff6b6b', fontSize: '0.88rem' }}>
          {error}
        </div>
      )}

      <button
        onClick={handleJoin}
        disabled={joining}
        style={{
          width: '100%', padding: '0.75rem',
          background: 'var(--tekky-blue)', color: '#fff',
          border: 'none', borderRadius: 8,
          fontSize: '0.95rem', fontWeight: 700,
          cursor: joining ? 'not-allowed' : 'pointer',
          opacity: joining ? 0.7 : 1,
          fontFamily: 'inherit', transition: 'opacity 0.15s',
        }}
      >
        {joining ? 'Joining…' : `✓ Join ${team.name}`}
      </button>

      <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.82rem', color: 'var(--muted)' }}>
        Not you?{' '}
        <Link href="/login" style={{ color: 'var(--tekky-blue)', textDecoration: 'underline' }}>
          Log in with a different account
        </Link>
      </p>
    </Card>
  );
}

// ─── Registration form (unauthenticated) ─────────────────────────────────────

function RegisterForm({ team, token }) {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({ name: '', email: '', password: '', password2: '', gender: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]   = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPw, setShowPw] = useState(false);

  function set(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (form.password !== form.password2) {
      setFieldErrors({ password2: 'Passwords do not match.' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await registerAndJoin(token, {
        name:      form.name,
        email:     form.email,
        password:  form.password,
        password2: form.password2,
        gender:    form.gender || undefined,
        phone:     form.phone  || undefined,
      });
      // Store the returned JWT and sync user state
      if (res.access) {
        auth.setToken(res.access);
      }
      router.push('/user?joined=1');
    } catch (err) {
      // Surface field-level errors from DRF if present
      if (err.data?.email)    setFieldErrors((f) => ({ ...f, email:    err.data.email[0] }));
      if (err.data?.password) setFieldErrors((f) => ({ ...f, password: err.data.password[0] }));
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', margin: '0 0 0.3rem', letterSpacing: '1px', textAlign: 'center' }}>
        Join {team.name}
      </h2>
      <p style={{ color: 'var(--muted)', fontSize: '0.85rem', textAlign: 'center', margin: '0 0 1.5rem' }}>
        Create your account to join the team. Your spot is pending admin approval.
      </p>

      <TeamBanner team={team} />

      {error && (
        <div style={{ background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.3)', borderRadius: 8, padding: '0.7rem 0.9rem', marginBottom: '1.25rem', color: '#ff6b6b', fontSize: '0.88rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Field label="Full Name" value={form.name} onChange={set('name')} placeholder="Your name" required />

        <Field label="Email" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required>
          <input
            type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required
            style={{
              width: '100%', boxSizing: 'border-box', padding: '0.55rem 0.8rem',
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${fieldErrors.email ? '#ff6b6b' : 'rgba(0,116,255,0.25)'}`,
              borderRadius: 7, color: 'var(--fg)', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(0,116,255,0.6)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = fieldErrors.email ? '#ff6b6b' : 'rgba(0,116,255,0.25)'; }}
          />
          {fieldErrors.email && <p style={{ margin: '0.3rem 0 0', fontSize: '0.78rem', color: '#ff6b6b' }}>{fieldErrors.email}</p>}
        </Field>

        <Field label="Password" required>
          <div style={{ position: 'relative' }}>
            <input
              type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')}
              placeholder="Min. 8 characters" required
              style={{
                width: '100%', boxSizing: 'border-box', padding: '0.55rem 2.4rem 0.55rem 0.8rem',
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${fieldErrors.password ? '#ff6b6b' : 'rgba(0,116,255,0.25)'}`,
                borderRadius: 7, color: 'var(--fg)', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(0,116,255,0.6)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = fieldErrors.password ? '#ff6b6b' : 'rgba(0,116,255,0.25)'; }}
            />
            <button type="button" onClick={() => setShowPw((v) => !v)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '0.85rem', padding: 0 }}>
              <i className={`fa-solid fa-eye${showPw ? '-slash' : ''}`} />
            </button>
          </div>
          {fieldErrors.password && <p style={{ margin: '0.3rem 0 0', fontSize: '0.78rem', color: '#ff6b6b' }}>{fieldErrors.password}</p>}
        </Field>

        <Field label="Confirm Password" required>
          <input
            type={showPw ? 'text' : 'password'} value={form.password2} onChange={set('password2')}
            placeholder="Repeat password" required
            style={{
              width: '100%', boxSizing: 'border-box', padding: '0.55rem 0.8rem',
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${fieldErrors.password2 ? '#ff6b6b' : 'rgba(0,116,255,0.25)'}`,
              borderRadius: 7, color: 'var(--fg)', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(0,116,255,0.6)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = fieldErrors.password2 ? '#ff6b6b' : 'rgba(0,116,255,0.25)'; }}
          />
          {fieldErrors.password2 && <p style={{ margin: '0.3rem 0 0', fontSize: '0.78rem', color: '#ff6b6b' }}>{fieldErrors.password2}</p>}
        </Field>

        {/* Optional fields */}
        <Field label="Phone" type="tel" value={form.phone} onChange={set('phone')} placeholder="+1 (555) 000-0000" />

        <Field label="Gender">
          <select
            value={form.gender} onChange={set('gender')}
            style={{
              width: '100%', padding: '0.55rem 0.8rem',
              background: '#0a0a0a', border: '1px solid rgba(0,116,255,0.25)', borderRadius: 7,
              color: form.gender ? 'var(--fg)' : 'var(--muted)', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none', cursor: 'pointer',
            }}
          >
            <option value="">Prefer not to say</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </Field>

        <button
          type="submit"
          disabled={submitting}
          style={{
            width: '100%', marginTop: '0.5rem', padding: '0.75rem',
            background: 'var(--tekky-blue)', color: '#fff',
            border: 'none', borderRadius: 8,
            fontSize: '0.95rem', fontWeight: 700,
            cursor: submitting ? 'not-allowed' : 'pointer',
            opacity: submitting ? 0.7 : 1,
            fontFamily: 'inherit', transition: 'opacity 0.15s',
          }}
        >
          {submitting ? 'Creating account…' : `Join ${team.name}`}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.82rem', color: 'var(--muted)' }}>
        Already have an account?{' '}
        <Link href={`/login?next=${encodeURIComponent(`/register?invite=${token}`)}`} style={{ color: 'var(--tekky-blue)', textDecoration: 'underline' }}>
          Log in instead
        </Link>
      </p>
    </Card>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function RegisterViaInviteClient() {
  const searchParams  = useSearchParams();
  const token         = searchParams.get('invite');
  const { user, loading: authLoading } = useAuth();

  const [pageData,  setPageData]  = useState(null);  // { valid, team, expiresAt }
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    validateLinkInvite(token)
      .then(setPageData)
      .catch(() => setPageData({ valid: false }))
      .finally(() => setLoading(false));
  }, [token]);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading || authLoading) {
    return (
      <PageShell>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <span className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
        </div>
      </PageShell>
    );
  }

  // ── No invite token in URL ───────────────────────────────────────────────
  if (!token) {
    return (
      <PageShell>
        <StatePanel
          icon="fa-solid fa-link-slash"
          color="#ff6b6b"
          title="No Invite Found"
          message="This link doesn't contain a valid team invite. If you want to apply to the league, use the registration page."
          action={
            <Link href="/registration" style={{ display: 'inline-block', padding: '0.65rem 1.8rem', background: 'var(--tekky-blue)', color: '#fff', borderRadius: 8, fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none' }}>
              Go to Registration
            </Link>
          }
        />
      </PageShell>
    );
  }

  // ── Invalid / expired token ──────────────────────────────────────────────
  if (!pageData?.valid || !pageData?.team) {
    return (
      <PageShell>
        <StatePanel
          icon="fa-solid fa-clock"
          color="#ffb400"
          title="Invite Expired or Invalid"
          message={pageData?.error || 'This invite link has expired or is no longer valid. Ask your captain for a new one.'}
          action={
            <Link href="/" style={{ color: 'var(--muted)', fontSize: '0.88rem', textDecoration: 'underline' }}>
              Return Home
            </Link>
          }
        />
      </PageShell>
    );
  }

  const { team } = pageData;

  // ── Logged in as admin ───────────────────────────────────────────────────
  if (user?.role === 'admin') {
    return (
      <PageShell>
        <StatePanel
          icon="fa-solid fa-shield-halved"
          color="var(--tekky-blue)"
          title="Admin Account"
          message="You're logged in as an admin. This invite link is for players. Log out to join as a player, or go to your dashboard."
          action={
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/admin" style={{ display: 'inline-block', padding: '0.6rem 1.5rem', background: 'var(--tekky-blue)', color: '#fff', borderRadius: 8, fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>
                Admin Dashboard
              </Link>
              <Link href="/login" style={{ display: 'inline-block', padding: '0.6rem 1.5rem', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--muted)', borderRadius: 8, fontSize: '0.9rem', textDecoration: 'none' }}>
                Switch Account
              </Link>
            </div>
          }
        />
      </PageShell>
    );
  }

  // ── Logged in as player ──────────────────────────────────────────────────
  if (user?.role === 'player') {
    return (
      <PageShell>
        <LoggedInPlayerPanel user={user} team={team} token={token} />
      </PageShell>
    );
  }

  // ── Not logged in — show registration form ───────────────────────────────
  return (
    <PageShell>
      <RegisterForm team={team} token={token} />
    </PageShell>
  );
}
