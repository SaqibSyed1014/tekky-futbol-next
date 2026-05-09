'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import CaptainDashboardClient from './CaptainDashboardClient';
import PlayerHomeClient from './PlayerHomeClient';

export default function UserDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && user.role !== 'player') router.replace('/admin');
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'player') return null;

  // Captains get the team management dashboard; regular players get their own view
  if (user.is_captain) return <CaptainDashboardClient user={user} />;
  return <PlayerHomeClient user={user} />;
}
