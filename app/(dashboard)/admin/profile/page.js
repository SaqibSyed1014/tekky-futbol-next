'use client';

import { useState, useEffect } from 'react';
import { fetchMyProfile } from '@/services/userApi';

function SectionHeading({ children }) {
  return (
    <h3 style={{
      fontFamily: "'Bebas Neue', sans-serif",
      fontSize: '1.15rem',
      letterSpacing: '1.5px',
      color: 'var(--tekky-blue)',
      textTransform: 'uppercase',
      margin: '0 0 1rem',
      paddingBottom: '0.4rem',
      borderBottom: '1px solid rgba(0,116,255,0.15)',
    }}>
      {children}
    </h3>
  );
}

function InfoField({ label, value }) {
  return (
    <div>
      <p style={{ fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 0.2rem', fontWeight: 600 }}>
        {label}
      </p>
      <p style={{ fontSize: '0.95rem', color: 'var(--fg)', margin: 0, wordBreak: 'break-word' }}>
        {value || <span style={{ color: 'var(--muted)', fontStyle: 'italic' }}>Not set</span>}
      </p>
    </div>
  );
}

function Card({ children, style }) {
  return (
    <div style={{
      background: '#000',
      border: '1px solid rgba(0,116,255,0.2)',
      borderRadius: 12,
      padding: '1.5rem',
      boxShadow: '0 0 20px rgba(0,116,255,0.05)',
      ...style,
    }}>
      {children}
    </div>
  );
}

export default function AdminProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyProfile()
      .then((u) => setProfile(u))
      .catch(() => setError('Failed to load profile.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
        <span className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.35)', borderRadius: 8, padding: '1rem', color: '#ff6b6b' }}>
        {error}
      </div>
    );
  }

  const initial = (profile?.name || profile?.email || '?')[0].toUpperCase();

  return (
    <div style={{ maxWidth: 560 }}>

      {/* Profile header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--tekky-blue), #0044cc)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '1.8rem',
          color: '#fff',
          boxShadow: '0 0 20px rgba(0,116,255,0.35)',
          flexShrink: 0,
        }}>
          {initial}
        </div>
        <div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.6rem', margin: '0 0 0.3rem', letterSpacing: '1px' }}>
            {profile?.name || profile?.email}
          </h2>
          <span style={{
            fontSize: '0.8rem',
            fontFamily: "'Bebas Neue', sans-serif",
            letterSpacing: '1.2px',
            color: 'var(--tekky-blue)',
            background: 'rgba(0,116,255,0.1)',
            border: '1px solid rgba(0,116,255,0.3)',
            borderRadius: 4,
            padding: '0.2rem 0.55rem',
          }}>
            Admin
          </span>
        </div>
      </div>

      {/* Account info */}
      <Card>
        <SectionHeading>Account Info</SectionHeading>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem 2rem' }}>
          <InfoField label="Email"       value={profile?.email} />
          <InfoField label="Role"        value="Administrator" />
          <InfoField label="Member Since" value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : null} />
          <InfoField label="Account Status" value={profile?.is_active ? 'Active' : 'Inactive'} />
        </div>

        <div style={{ marginTop: '1.5rem', padding: '0.85rem 1rem', background: 'rgba(0,116,255,0.05)', border: '1px solid rgba(0,116,255,0.15)', borderRadius: 8 }}>
          <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.5 }}>
            <i className="fa-solid fa-circle-info" style={{ marginRight: '0.4rem', color: 'var(--tekky-blue)' }} />
            Admin account details are managed by the system. Contact the platform owner to update credentials.
          </p>
        </div>
      </Card>

    </div>
  );
}
