'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import GlowDivider from '@/components/ui/GlowDivider';
import FanOAuthButtons from '@/components/fan/FanOAuthButtons';
import { formatApiError } from '@/services/api';

/** Only allow same-site relative paths — never an absolute/protocol-relative URL. */
function safeNext(next) {
  if (next && next.startsWith('/') && !next.startsWith('//')) return next;
  return '/fan';
}

const cardStyle = {
  background: 'var(--card)',
  border: '1px solid var(--line-blue)',
  borderRadius: 16,
  padding: '2rem',
  boxShadow: 'var(--shadow)',
  backdropFilter: 'blur(18px)',
};

export default function FanRegisterClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams?.get('next'));
  const { registerFan, loading, error, clearError } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    clearError();
    setLocalError('');

    if (password !== password2) {
      setLocalError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await registerFan({
        email,
        name,
        password,
        password2,
      });
      router.push(next);
    } catch (err) {
      setLocalError(formatApiError(err, 'Registration failed. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  }

  const displayError = localError || error;
  const busy = submitting || loading;

  return (
    <>
      <header style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="hero" style={{ position: 'relative', zIndex: 2, maxWidth: 980, padding: '0 1rem' }}>
          <h1>FAN SIGN UP</h1>
          <p className="tagline">Join The Sideline</p>
          <p className="subtext">Create a fan account to save your sizes, division, and orders.</p>
        </div>
      </header>

      <main style={{ maxWidth: 480, margin: '2.8rem auto 5rem', padding: '0 1.25rem' }}>
        <GlowDivider />

        <section style={{ margin: '2.5rem 0' }}>
          <div style={cardStyle}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", color: 'var(--tekky-blue)', fontSize: '1.8rem', marginBottom: '1.25rem' }}>
              Create Account
            </h2>

            <FanOAuthButtons
              disabled={busy}
              onSuccess={() => router.push(next)}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.4rem 0' }}>
              <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
              <span style={{ color: 'var(--muted)', fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>or</span>
              <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
            </div>

            <form onSubmit={handleSubmit}>
              {displayError && (
                <div
                  role="alert"
                  style={{
                    background: 'rgba(255,60,60,0.12)',
                    border: '1px solid rgba(255,60,60,0.4)',
                    borderRadius: 8,
                    padding: '0.75rem 1rem',
                    color: '#ff6b6b',
                    fontSize: '0.9rem',
                    marginBottom: '1.2rem',
                    textAlign: 'left',
                  }}
                >
                  {displayError}
                </div>
              )}

              <label htmlFor="fan-reg-name">Full Name</label>
              <input
                id="fan-reg-name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                autoComplete="name"
                disabled={busy}
              />

              <label htmlFor="fan-reg-email">Email</label>
              <input
                id="fan-reg-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={busy}
              />

              <label htmlFor="fan-reg-password">Password</label>
              <div style={{ position: 'relative', marginBottom: '1.2rem' }}>
                <input
                  id="fan-reg-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  disabled={busy}
                  style={{ paddingRight: '2.6rem', marginBottom: 0 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--muted)',
                    cursor: 'pointer',
                    padding: 0,
                    fontSize: '0.95rem',
                    lineHeight: 1,
                  }}
                >
                  <i className={showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'} />
                </button>
              </div>

              <label htmlFor="fan-reg-password2">Confirm Password</label>
              <input
                id="fan-reg-password2"
                type={showPassword ? 'text' : 'password'}
                placeholder="Repeat your password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                disabled={busy}
              />

              <button
                type="submit"
                className="cta"
                disabled={busy}
                style={{ width: '100%', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                {submitting ? <><span className="spinner" /> Creating account…</> : 'Create Fan Account'}
              </button>
            </form>
          </div>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <span>
              Already have a fan account?{' '}
              <Link href={next !== '/fan' ? `/fan/login?next=${encodeURIComponent(next)}` : '/fan/login'} style={{ color: 'var(--tekky-blue)', fontWeight: 600 }}>
                Sign in
              </Link>
            </span>
            <span>
              Want to play?{' '}
              <Link href="/registration" style={{ color: 'var(--tekky-blue)', fontWeight: 600 }}>
                Player registration
              </Link>
            </span>
          </div>
        </section>

        <GlowDivider />

        <div className="sec-cta">
          <Link className="cta" href="/">Back to Home</Link>
        </div>
      </main>
    </>
  );
}
