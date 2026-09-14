'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import GlowDivider from '@/components/ui/GlowDivider';
import FanOAuthButtons from '@/components/fan/FanOAuthButtons';

/** Only allow same-site relative paths — never an absolute/protocol-relative URL. */
function safeNext(next) {
  if (next && next.startsWith('/') && !next.startsWith('//')) return next;
  return '';
}

function homeForRole(role) {
  if (role === 'admin') return '/admin';
  if (role === 'fan') return '/fan';
  return '/user';
}

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams?.get('next'));
  const { login, loading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');
  const [comingSoon, setComingSoon] = useState(false);

  function afterLogin(loggedInUser) {
    if (next) {
      router.push(next);
      return;
    }
    if (loggedInUser?.role === 'admin' || loggedInUser?.role === 'fan') {
      router.push(homeForRole(loggedInUser.role));
    } else {
      setComingSoon(true);
      router.push('/user');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    clearError();
    setLocalError('');
    setSubmitting(true);

    try {
      const loggedInUser = await login({ email, password });
      afterLogin(loggedInUser);
    } catch (err) {
      setLocalError(err.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const displayError = localError || error;

  return (
    <>
      <header style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="hero" style={{ position: 'relative', zIndex: 2, maxWidth: 980, padding: '0 1rem' }}>
          <h1>LOG IN</h1>
          <p className="tagline">For Ballers Who Create</p>
          <p className="subtext">Sign in to your TekkyFutbol account — player, captain, admin, or fan.</p>
        </div>
      </header>

      <main style={{ maxWidth: 480, margin: '2.8rem auto 5rem', padding: '0 1.25rem' }}>
        <GlowDivider />

        {!comingSoon && <section style={{ margin: '2.5rem 0' }}>
          <div
            style={{
              background: 'var(--card)',
              border: '1px solid var(--line-blue)',
              borderRadius: 16,
              padding: '2rem',
              boxShadow: 'var(--shadow)',
              backdropFilter: 'blur(18px)',
            }}
          >
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", color: 'var(--tekky-blue)', fontSize: '1.8rem', marginBottom: '1.25rem' }}>
              Sign In
            </h2>

            <FanOAuthButtons
              disabled={submitting || loading}
              onSuccess={(user) => afterLogin(user)}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.4rem 0' }}>
              <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
              <span style={{ color: 'var(--muted)', fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>or</span>
              <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
            </div>

            <form onSubmit={handleSubmit}>
            {/* Error banner */}
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

            <label htmlFor="login-email" style={{ display: 'block', textAlign: 'left', marginBottom: '0.4rem', fontWeight: 600, color: 'var(--fg)' }}>
              Email
            </label>
            <input
              id="login-email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={submitting}
            />

            <label htmlFor="login-password" style={{ display: 'block', textAlign: 'left', marginBottom: '0.4rem', fontWeight: 600, color: 'var(--fg)', marginTop: '0.8rem' }}>
              Password
            </label>
            <div style={{ position: 'relative', marginBottom: "1.2rem" }}>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                disabled={submitting}
                style={{ paddingRight: '2.6rem', marginBottom: "0" }}
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
              disabled={submitting || loading}
              style={{ width: '100%', marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              {submitting ? (
                <>
                  <span className="spinner" />
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </button>
            </form>
          </div>

          {/* Links below the form */}
          <div style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <span>
              Want to play?{' '}
              <Link href="/registration" style={{ color: 'var(--tekky-blue)', fontWeight: 600 }}>
                Player registration
              </Link>
            </span>
            <span>
              Just here for the culture?{' '}
              <Link href="/fan/register" style={{ color: 'var(--tekky-blue)', fontWeight: 600 }}>
                Create a fan account
              </Link>
            </span>
            <span>
              <Link href="/forgot-password" style={{ color: 'var(--muted)', fontWeight: 500 }}>
                Forgot your password?
              </Link>
            </span>
          </div>
        </section>}

        <GlowDivider />

        <div className="sec-cta">
          <Link className="cta" href="/">Back to Home</Link>
        </div>
      </main>
    </>
  );
}
