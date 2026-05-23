'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import CaptainDashboardClient from '../CaptainDashboardClient';
import PoolClient from './PoolClient';

export default function PoolPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) { router.replace('/login'); return; }
      if (user.role === 'admin') router.replace('/admin');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role === 'admin') return null;

  // Captains get the real free-agent search + invite UI (the pool section of
  // the captain dashboard, rendered standalone via soloSection prop).
  if (user.is_captain) {
    return <CaptainDashboardClient user={user} defaultSection="pool" soloSection />;
  }

  // Regular players see their pool visibility status (waiver-gated).
  return <PoolClient user={user} />;
}
