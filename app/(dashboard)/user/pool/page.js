'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import CaptainDashboardClient from '../CaptainDashboardClient';

export default function CaptainPoolPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) { router.replace('/login'); return; }
      if (user.role !== 'player' || !user.is_captain) router.replace('/user');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'player' || !user.is_captain) return null;

  return <CaptainDashboardClient user={user} defaultSection="pool" />;
}
