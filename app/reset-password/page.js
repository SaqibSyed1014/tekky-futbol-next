'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import GlowDivider from '@/components/ui/GlowDivider';
import { resetPassword } from '@/services/userApi';

function ResetPasswordForm() {
  const searchParams  = useSearchParams();
  const uid           = searchParams.get('uid')   || '';
  const token         = searchParams.get('token') || '';

  const [newPassword,  setNewPassword]  = useState('');
  const [confirmPass,  setConfirmPass]  = useState('');
  const [showNew,      setShowNew]      = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [submitting,   setSubmitting]   = useState(false);
  const [done,         setDone]         = useState(false);
  const [error,        setError]        = useState('');

  // Detect missing / malformed link immediately
  const linkInvalid = !uid || !token;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPass) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword({ uid, token, newPassword, confirmPassword: confirmPass });
      setDone(true);
    } catch (err) {
      const data = err?.data;
      if (data?.detail)            setError(data.detail);
      else if (data?.new_password) setError(Array.isArray(data.new_password) ? data.new_password[0] : data.new_password);
      else                         setError('Failed to reset password. The link may have expired.');
    } finally {
      setSubmitting(false);
    }
  }

  if (linkInvalid) {
    return (
      <div style={{
        background: 'rgba(255,60,60,0.08)', border: '1px solid rgba(255,60,60,0.3)',
        borderRadius: 16, padding: '2.5rem 2rem', textAlign: 'center',
        boxShadow: '0 0 25px rgba(0,116,255,0.1)',
      }}>
        <i className="fa-solid fa-link-slash" style={{ fontSize: '3rem', color: '#ff6b6b', marginBottom: '1rem', display: 'block' }} />
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", color: '#ff6b6b', fontSize: '1.6rem', marginBottom: '0.75rem' }}>
          Invalid Reset Link
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          This link is missing required parameters. Please request a new password reset.
        </p>
        <Link href="/forgot-password" style={{ color: 'var(--tekky-blue)', fontWeight: 600, fontSize: '0.9rem' }}>
          Request New Link
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div style={{
        background: 'rgba(0,200,100,0.08)', border: '1px solid rgba(0,200,100,0.3)',
        borderRadius: 16, padding: '2.5rem 2rem', textAlign: 'center',
        boxShadow: '0 0 25px rgba(0,116,255,0.1)',
      }}>
        <i className="fa-solid fa-circle-check" style={{ fontSize: '3rem', color: '#00c864', marginBottom: '1rem', display: 'block' }} />
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", color: '#00c864', fontSize: '1.6rem', marginBottom: '0.75rem' }}>
          Password Reset!
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          Your password has been updated. You can now sign in with your new password.
        </p>
        <Link href="/login" className="cta" style={{ display: 'inline-block' }}>
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(0,116,255,0.4)',
        borderRadius: 16, padding: '2rem',
        boxShadow: '0 0 25px rgba(0,116,255,0.15)',
      }}
    >
      <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", color: 'var(--tekky-blue)', fontSize: '1.8rem', marginBottom: '0.5rem' }}>
        Set New Password
      </h2>
      <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
        Choose a strong password — at least 8 characters.
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

      {/* New password */}
      <label htmlFor="rp-new" style={{ display: 'block', textAlign: 'left', marginBottom: '0.4rem', fontWeight: 600, color: 'var(--fg)' }}>
        New Password
      </label>
      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <input
          id="rp-new"
          type={showNew ? 'text' : 'password'}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="At least 8 characters"
          required
          minLength={8}
          autoComplete="new-password"
          disabled={submitting}
          style={{ paddingRight: '2.6rem', marginBottom: 0 }}
        />
        <button
          type="button"
          onClick={() => setShowNew((v) => !v)}
          tabIndex={-1}
          style={{
            position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: 0,
            fontSize: '0.95rem', lineHeight: 1,
          }}
        >
          <i className={showNew ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'} />
        </button>
      </div>

      {/* Confirm password */}
      <label htmlFor="rp-confirm" style={{ display: 'block', textAlign: 'left', marginBottom: '0.4rem', fontWeight: 600, color: 'var(--fg)' }}>
        Confirm Password
      </label>
      <div style={{ position: 'relative', marginBottom: '1.2rem' }}>
        <input
          id="rp-confirm"
          type={showConfirm ? 'text' : 'password'}
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
          placeholder="Repeat new password"
          required
          autoComplete="new-password"
          disabled={submitting}
          style={{ paddingRight: '2.6rem', marginBottom: 0 }}
        />
        <button
          type="button"
          onClick={() => setShowConfirm((v) => !v)}
          tabIndex={-1}
          style={{
            position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: 0,
            fontSize: '0.95rem', lineHeight: 1,
          }}
        >
          <i className={showConfirm ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'} />
        </button>
      </div>

      <button
        type="submit"
        className="cta"
        disabled={submitting}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
      >
        {submitting ? (
          <><span className="spinner" /> Resetting…</>
        ) : (
          <>Reset Password</>
        )}
      </button>

      <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.88rem', color: 'var(--muted)' }}>
        Didn't request this?{' '}
        <Link href="/login" style={{ color: 'var(--tekky-blue)', fontWeight: 600 }}>
          Back to Login
        </Link>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <>
      <header style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="hero" style={{ position: 'relative', zIndex: 2, maxWidth: 980, padding: '0 1rem' }}>
          <h1>RESET PASSWORD</h1>
          <p className="tagline">Set Your New Password</p>
          <p className="subtext">This link expires in 24 hours.</p>
        </div>
      </header>

      <main style={{ maxWidth: 480, margin: '2.8rem auto 5rem', padding: '0 1.25rem' }}>
        <GlowDivider />
        <section style={{ margin: '2.5rem 0' }}>
          {/* useSearchParams must be wrapped in Suspense in Next.js 16 */}
          <Suspense fallback={
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <span className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
            </div>
          }>
            <ResetPasswordForm />
          </Suspense>
        </section>
        <GlowDivider />
      </main>
    </>
  );
}
