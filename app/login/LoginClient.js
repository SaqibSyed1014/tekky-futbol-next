'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import GlowDivider from '@/components/ui/GlowDivider';

export default function LoginClient() {
  const router = useRouter();
  const { login, loading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    clearError();
    setLocalError('');
    setSubmitting(true);

    try {
      const loggedInUser = await login({ email, password });
      router.push(loggedInUser?.role === 'admin' ? '/admin' : '/user');
    } catch (err) {
      // error is already set in AuthContext; mirror it locally so it shows
      // even if the component re-renders before context propagates
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
          <h1>PLAYER LOGIN</h1>
          <p className="tagline">For Ballers Who Create</p>
          <p className="subtext">Access your dashboard, stats, and upcoming fixtures.</p>
        </div>
      </header>

      <main style={{ maxWidth: 480, margin: '2.8rem auto 5rem', padding: '0 1.25rem' }}>
        <GlowDivider />

        <section style={{ margin: '2.5rem 0' }}>
          <form
            onSubmit={handleSubmit}
            style={{
              background: 'rgba(0,0,0,0.45)',
              border: '1px solid rgba(0,116,255,0.4)',
              borderRadius: 16,
              padding: '2rem',
              boxShadow: '0 0 25px rgba(0,116,255,0.15)',
            }}
          >
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", color: 'var(--tekky-blue)', fontSize: '1.8rem', marginBottom: '1.5rem' }}>
              Sign In
            </h2>

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
            <input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={submitting}
            />

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

          {/* Links below the form */}
          <div style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <span>
              Don&#39;t have an account?{' '}
              <Link href="/registration" style={{ color: 'var(--tekky-blue)', fontWeight: 600 }}>
                Register here
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
