'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminMembershipsClient from './AdminMembershipsClient';

export default function AdminMembershipsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && user.role !== 'admin') router.replace('/user');
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') return null;

  return <AdminMembershipsClient />;
}
