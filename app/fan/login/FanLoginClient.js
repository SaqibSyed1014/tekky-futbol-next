'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import GlowDivider from '@/components/ui/GlowDivider';
import FanOAuthButtons from '@/components/fan/FanOAuthButtons';
import { formatApiError } from '@/services/api';

const cardStyle = {
  background: 'var(--card)',
  border: '1px solid var(--line-blue)',
  borderRadius: 16,
  padding: '2rem',
  boxShadow: 'var(--shadow)',
  backdropFilter: 'blur(18px)',
};

export default function FanLoginClient() {
  const router = useRouter();
  const { loginFan, loading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    clearError();
    setLocalError('');
    setSubmitting(true);
    try {
      await loginFan({ email, password });
      router.push('/fan');
    } catch (err) {
      setLocalError(formatApiError(err, 'Login failed. Please try again.'));
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
          <h1>FAN LOGIN</h1>
          <p className="tagline">For The Culture</p>
          <p className="subtext">Sign in to manage your profile, sizes, and shop orders.</p>
        </div>
      </header>

      <main style={{ maxWidth: 480, margin: '2.8rem auto 5rem', padding: '0 1.25rem' }}>
        <GlowDivider />

        <section style={{ margin: '2.5rem 0' }}>
          <div style={cardStyle}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", color: 'var(--tekky-blue)', fontSize: '1.8rem', marginBottom: '1.25rem' }}>
              Sign In
            </h2>

            <FanOAuthButtons
              disabled={busy}
              onSuccess={() => router.push('/fan')}
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

              <label htmlFor="fan-login-email">Email</label>
              <input
                id="fan-login-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={busy}
              />

              <label htmlFor="fan-login-password">Password</label>
              <div style={{ position: 'relative', marginBottom: '1.2rem' }}>
                <input
                  id="fan-login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
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

              <button
                type="submit"
                className="cta"
                disabled={busy}
                style={{ width: '100%', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                {submitting ? <><span className="spinner" /> Signing in…</> : 'Sign In'}
              </button>
            </form>
          </div>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <span>
              New here?{' '}
              <Link href="/fan/register" style={{ color: 'var(--tekky-blue)', fontWeight: 600 }}>
                Create a fan account
              </Link>
            </span>
            <span>
              <Link href="/forgot-password?from=fan" style={{ color: 'var(--muted)', fontWeight: 500 }}>
                Forgot your password?
              </Link>
            </span>
            <span>
              Player or captain?{' '}
              <Link href="/login" style={{ color: 'var(--tekky-blue)', fontWeight: 600 }}>
                Player login
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
