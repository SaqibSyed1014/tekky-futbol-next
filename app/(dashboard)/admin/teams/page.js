'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminTeamsClient from './AdminTeamsClient';

export default function AdminTeamsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && user.role !== 'admin') router.replace('/user');
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') return null;

  return <AdminTeamsClient />;
}
