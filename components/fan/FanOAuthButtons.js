'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
const APPLE_CLIENT_ID = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || '';
const GOOGLE_SCRIPT = 'https://accounts.google.com/gsi/client';
const APPLE_SCRIPT = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === 'true') {
        resolve();
        return;
      }
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Failed to load sign-in script.')), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve();
    };
    script.onerror = () => reject(new Error('Failed to load sign-in script.'));
    document.head.appendChild(script);
  });
}

const oauthBtnStyle = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.65rem',
  padding: '0.75rem 1rem',
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,0.18)',
  background: 'rgba(6, 18, 50, 0.85)',
  color: 'var(--fg)',
  fontFamily: 'inherit',
  fontSize: '0.92rem',
  fontWeight: 600,
  cursor: 'pointer',
};

function AppleIcon() {
  return (
    <svg width="16" height="18" viewBox="0 0 16 20" aria-hidden="true" fill="currentColor">
      <path d="M13.3 10.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.8-3.5.8-.7 0-1.9-.8-3.1-.8-1.6 0-3.1 1-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.6.8 1.1 1.7 2.4 3 2.4 1.2 0 1.6-.8 3.1-.8s1.8.8 3.1.8c1.3 0 2.1-1.2 2.9-2.3.9-1.3 1.3-2.5 1.3-2.6-.1 0-2.5-1-2.5-3.2zM11.2 3.8c.6-.8 1.1-1.9.9-3-.9 0-2 .6-2.7 1.4-.6.7-1.2 1.8-1 2.9 1 .1 2.1-.5 2.8-1.3z" />
    </svg>
  );
}

/**
 * Google + Apple 1-click sign-in for fan auth pages.
 * extraPayload is merged into the OAuth API body (favorite_division, zip_code).
 */
export default function FanOAuthButtons({ onSuccess, extraPayload = {}, disabled = false }) {
  const { oauthFan } = useAuth();
  const extraRef = useRef(extraPayload);
  extraRef.current = extraPayload;

  const [busy, setBusy] = useState('');
  const [localError, setLocalError] = useState('');
  const [googleReady, setGoogleReady] = useState(false);
  const googleBtnRef = useRef(null);
  const appleReady = useRef(false);
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !googleBtnRef.current) return undefined;
    let cancelled = false;

    loadScript(GOOGLE_SCRIPT)
      .then(() => {
        if (cancelled || !window.google?.accounts?.id || !googleBtnRef.current) return;
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response) => {
            setLocalError('');
            setBusy('google');
            try {
              const user = await oauthFan('google', {
                ...extraRef.current,
                id_token: response.credential,
              });
              onSuccessRef.current?.(user);
            } catch (err) {
              setLocalError(err.message || 'Google Sign-In failed. Please try again.');
            } finally {
              setBusy('');
            }
          },
          auto_select: false,
          ux_mode: 'popup',
        });
        googleBtnRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'filled_black',
          size: 'large',
          type: 'standard',
          text: 'continue_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: Math.min(googleBtnRef.current.offsetWidth || 384, 400),
        });
        setGoogleReady(true);
      })
      .catch(() => {
        if (!cancelled) setLocalError('Google Sign-In failed to load. Use email instead.');
      });

    return () => { cancelled = true; };
  }, [oauthFan]);

  useEffect(() => {
    if (!APPLE_CLIENT_ID) return undefined;
    let cancelled = false;
    loadScript(APPLE_SCRIPT)
      .then(() => {
        if (cancelled || !window.AppleID?.auth) return;
        window.AppleID.auth.init({
          clientId: APPLE_CLIENT_ID,
          scope: 'name email',
          redirectURI: `${window.location.origin}/fan/login`,
          usePopup: true,
        });
        appleReady.current = true;
      })
      .catch(() => {
        if (!cancelled) setLocalError('Apple Sign-In failed to load. Use email instead.');
      });
    return () => { cancelled = true; };
  }, []);

  async function handleApple() {
    if (!APPLE_CLIENT_ID) {
      setLocalError('Apple Sign-In is not configured yet.');
      return;
    }
    setLocalError('');
    setBusy('apple');
    try {
      if (!appleReady.current) {
        await loadScript(APPLE_SCRIPT);
        window.AppleID.auth.init({
          clientId: APPLE_CLIENT_ID,
          scope: 'name email',
          redirectURI: `${window.location.origin}/fan/login`,
          usePopup: true,
        });
        appleReady.current = true;
      }
      const response = await window.AppleID.auth.signIn();
      const idToken = response?.authorization?.id_token;
      if (!idToken) throw new Error('Apple Sign-In did not return an identity token.');
      const given = response?.user?.name?.firstName || '';
      const family = response?.user?.name?.lastName || '';
      const name = `${given} ${family}`.trim();
      const user = await oauthFan('apple', { ...extraRef.current, id_token: idToken, name });
      onSuccessRef.current?.(user);
    } catch (err) {
      if (err?.error === 'popup_closed_by_user' || err?.error === 'user_trigger_new_signin_flow') {
        return;
      }
      setLocalError(err.message || 'Apple Sign-In was cancelled.');
    } finally {
      setBusy('');
    }
  }

  function handleMissingGoogle() {
    setLocalError('Google Sign-In is not configured yet.');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
      {localError && (
        <div
          role="alert"
          style={{
            background: 'rgba(255,60,60,0.12)',
            border: '1px solid rgba(255,60,60,0.4)',
            borderRadius: 8,
            padding: '0.75rem 1rem',
            color: '#ff6b6b',
            fontSize: '0.88rem',
            textAlign: 'left',
          }}
        >
          {localError}
        </div>
      )}

      {GOOGLE_CLIENT_ID ? (
        <div
          ref={googleBtnRef}
          style={{
            minHeight: 44,
            display: 'flex',
            justifyContent: 'center',
            opacity: googleReady && !disabled && busy !== 'apple' ? 1 : 0.7,
            pointerEvents: disabled || busy === 'apple' ? 'none' : 'auto',
          }}
        />
      ) : (
        <button type="button" onClick={handleMissingGoogle} disabled={disabled} style={oauthBtnStyle}>
          Continue with Google
        </button>
      )}

      {APPLE_CLIENT_ID && (
        <button
          type="button"
          onClick={handleApple}
          disabled={disabled || !!busy}
          style={oauthBtnStyle}
        >
          {busy === 'apple' ? <span className="spinner" /> : <AppleIcon />}
          Continue with Apple
        </button>
      )}
    </div>
  );
}
