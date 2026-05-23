'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminWaiversClient from './AdminWaiversClient';

export default function AdminWaiversPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.replace('/user');
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') return null;
  return <AdminWaiversClient />;
}
