'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import WaiverSigningClient from './WaiverSigningClient';

export default function WaiverPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
    if (!loading && user?.role === 'admin') router.replace('/admin');
  }, [user, loading, router]);

  if (loading || !user || user.role === 'admin') return null;
  return <WaiverSigningClient />;
}
