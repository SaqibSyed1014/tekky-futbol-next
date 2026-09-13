'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import FanHomeClient from './FanHomeClient';

export default function FanDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && user.role !== 'fan') {
      router.replace(user.role === 'admin' ? '/admin' : '/user');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'fan') return null;

  return <FanHomeClient user={user} />;
}
