'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { MILESTONE_2_ENABLED } from '@/constants/features';
import AdminClient from '../AdminClient';

export default function ApplicationsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && user.role !== 'admin') router.replace('/user');
    if (!loading && MILESTONE_2_ENABLED === false) router.replace('/admin');
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin' || !MILESTONE_2_ENABLED) return null;

  return <AdminClient />;
}
