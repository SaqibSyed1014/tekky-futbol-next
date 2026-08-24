'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    const msg = error?.message || '';
    const staleChunk = /ChunkLoadError|Loading chunk|Failed to fetch dynamically imported module/i.test(msg);
    if (!staleChunk) return;
    try {
      const last = Number(sessionStorage.getItem('tf_chunk_reload_at') || '0');
      if (Date.now() - last < 15000) return;
      sessionStorage.setItem('tf_chunk_reload_at', String(Date.now()));
    } catch { /* ignore */ }
    window.location.reload();
  }, [error]);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#e8eef6',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      padding: '2rem',
      textAlign: 'center',
    }}>
      <p style={{ fontSize: '1rem', margin: 0 }}>The dashboard failed to load.</p>
      <button
        type="button"
        onClick={() => reset()}
        style={{
          background: 'transparent',
          border: '1px solid rgba(0,116,255,0.6)',
          color: '#fff',
          padding: '0.65rem 1.1rem',
          borderRadius: 8,
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        Try again
      </button>
    </div>
  );
}
