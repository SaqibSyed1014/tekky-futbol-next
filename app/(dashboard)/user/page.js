'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function UserDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && user.role !== 'player') router.replace('/admin');
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'player') return null;

  return (
    <div style={{ maxWidth: 560, margin: '4rem auto', textAlign: 'center', padding: '0 1.25rem' }}>
      <div style={{
        background: 'rgba(0,0,0,0.45)',
        border: '1px solid rgba(0,116,255,0.4)',
        borderRadius: 16,
        padding: '3rem 2rem',
        boxShadow: '0 0 30px rgba(0,116,255,0.12)',
      }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1.25rem' }}>⚽</div>
        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          color: 'var(--tekky-blue)',
          fontSize: '2.2rem',
          letterSpacing: '2px',
          marginBottom: '0.75rem',
        }}>
          Dashboard Coming Soon
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.65, marginBottom: '2rem' }}>
          The player dashboard is currently under development.
          Your application is being reviewed and we&#39;ll notify you when the dashboard is live.
        </p>
      </div>
    </div>
  );
}
