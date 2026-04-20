'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminClient from '../AdminClient';

export default function ApplicationsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && user.role !== 'admin') router.replace('/user');
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') return null;

  return <AdminClient />;
}
