'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import CaptainDashboardClient from './CaptainDashboardClient';
import PlayerHomeClient from './PlayerHomeClient';
import WaiverBanner from './WaiverBanner';

export default function UserDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && user.role !== 'player') router.replace('/admin');
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'player') return null;

  return (
    <div style={{ maxWidth: 760 }}>
      {/* Waiver reminder — hidden once signed */}
      {!user.waiver_signed && <WaiverBanner isCaptain={user.is_captain} />}

      {/* Application history — shown to all players */}
      <PlayerHomeClient user={user} />

      {/* Captain-only tools section */}
      {user.is_captain && <CaptainDashboardClient user={user} />}
    </div>
  );
}
