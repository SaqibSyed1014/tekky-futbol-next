'use client';
import { useState, useEffect } from 'react';

export function useCheckoutCancelled() {
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('checkout') === 'cancelled') {
      setCancelled(true);
      const url = new URL(window.location.href);
      url.searchParams.delete('checkout');
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  return { cancelled, dismiss: () => setCancelled(false) };
}
