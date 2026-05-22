'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import PoolClient from './PoolClient';

export default function PoolPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
    if (!loading && user?.role === 'admin') router.replace('/admin');
  }, [user, loading, router]);

  if (loading || !user || user.role === 'admin') return null;
  return <PoolClient user={user} />;
}
