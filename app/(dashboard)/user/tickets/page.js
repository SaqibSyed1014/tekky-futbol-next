'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import TicketWalletList from '@/components/tickets/TicketWalletList';

export default function PlayerTicketsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user && user.role !== 'player') {
      router.replace(user.role === 'admin' ? '/admin' : '/fan');
    }
  }, [authLoading, user, router]);

  if (authLoading || !user || user.role !== 'player') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
        <span className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 780 }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2>My Tickets</h2>
        <p>Every match pass purchased with this account.</p>
      </div>
      <TicketWalletList browseHref="/tickets" />
    </div>
  );
}
