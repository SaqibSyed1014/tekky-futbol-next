'use client';

import { useState } from 'react';
import Link from 'next/link';
import GlowDivider from '@/components/ui/GlowDivider';
import { forgotPassword } from '@/services/userApi';

export default function ForgotPasswordPage() {
  const [email,     setEmail]     = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent,      setSent]      = useState(false);
  const [error,     setError]     = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await forgotPassword(email.trim().toLowerCase());
      setSent(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <header style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="hero" style={{ position: 'relative', zIndex: 2, maxWidth: 980, padding: '0 1rem' }}>
          <h1>FORGOT PASSWORD</h1>
          <p className="tagline">Reset Your Access</p>
          <p className="subtext">Enter your email and we'll send you a reset link.</p>
        </div>
      </header>

      <main style={{ maxWidth: 480, margin: '2.8rem auto 5rem', padding: '0 1.25rem' }}>
        <GlowDivider />

        <section style={{ margin: '2.5rem 0' }}>
          {sent ? (
            <div style={{
              background: 'rgba(0,200,100,0.08)', border: '1px solid rgba(0,200,100,0.3)',
              borderRadius: 16, padding: '2.5rem 2rem', textAlign: 'center',
              boxShadow: '0 0 25px rgba(0,116,255,0.1)',
            }}>
              <i className="fa-solid fa-envelope-circle-check" style={{ fontSize: '3rem', color: '#00c864', marginBottom: '1rem', display: 'block' }} />
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", color: '#00c864', fontSize: '1.6rem', marginBottom: '0.75rem' }}>
                Check Your Inbox
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                If <strong style={{ color: 'var(--fg)' }}>{email}</strong> is registered with us, you'll receive a password reset link within a few minutes. Check your spam folder if you don't see it.
              </p>
              <Link href="/login" style={{ color: 'var(--tekky-blue)', fontWeight: 600, fontSize: '0.9rem' }}>
                ← Back to Login
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{
                background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(0,116,255,0.4)',
                borderRadius: 16, padding: '2rem',
                boxShadow: '0 0 25px rgba(0,116,255,0.15)',
              }}
            >
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", color: 'var(--tekky-blue)', fontSize: '1.8rem', marginBottom: '0.5rem' }}>
                Reset Password
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                We'll email you a secure link to reset your password.
              </p>

              {error && (
                <div role="alert" style={{
                  background: 'rgba(255,60,60,0.12)', border: '1px solid rgba(255,60,60,0.4)',
                  borderRadius: 8, padding: '0.75rem 1rem', color: '#ff6b6b',
                  fontSize: '0.9rem', marginBottom: '1.2rem',
                }}>
                  {error}
                </div>
              )}

              <label htmlFor="fp-email" style={{ display: 'block', textAlign: 'left', marginBottom: '0.4rem', fontWeight: 600, color: 'var(--fg)' }}>
                Email Address
              </label>
              <input
                id="fp-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                autoComplete="email"
                disabled={submitting}
              />

              <button
                type="submit"
                className="cta"
                disabled={submitting}
                style={{ width: '100%', marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                {submitting ? (
                  <><span className="spinner" /> Sending…</>
                ) : (
                  <>Send Reset Link</>
                )}
              </button>

              <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.88rem', color: 'var(--muted)' }}>
                Remembered it?{' '}
                <Link href="/login" style={{ color: 'var(--tekky-blue)', fontWeight: 600 }}>
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </section>

        <GlowDivider />
      </main>
    </>
  );
}
