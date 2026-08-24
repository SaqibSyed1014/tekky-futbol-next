'use client';

import { useEffect } from 'react';

const RELOAD_KEY = 'tf_chunk_reload_at';

function isStaleChunkError(value) {
  const msg = value?.message || String(value || '');
  return /ChunkLoadError|Loading chunk|Failed to fetch dynamically imported module|Importing a module script failed/i.test(msg);
}

function reloadOnce() {
  try {
    const last = Number(sessionStorage.getItem(RELOAD_KEY) || '0');
    if (Date.now() - last < 15000) return;
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  } catch {
    // sessionStorage blocked — still try a single reload
  }
  window.location.reload();
}

/** Reloads once when a previous deploy's JS chunks 404 after a new rollout. */
export default function ChunkErrorRecovery() {
  useEffect(() => {
    function onError(event) {
      if (isStaleChunkError(event?.error || event?.message)) reloadOnce();
    }
    function onRejection(event) {
      if (isStaleChunkError(event?.reason)) reloadOnce();
    }
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);

  return null;
}
