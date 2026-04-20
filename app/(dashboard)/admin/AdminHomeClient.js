'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getApplications } from '@/services/adminApi';

// ─── Stat card ───────────────────────────────────────────────────────────────

function StatCard({ label, value, icon, color, loading }) {
  return (
    <div style={{
      background: '#000',
      border: `1px solid ${color}33`,
      borderRadius: 12,
      padding: '1.4rem 1.6rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1.1rem',
      boxShadow: `0 0 20px ${color}14`,
      transition: 'box-shadow 0.2s, transform 0.2s',
    }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 28px ${color}30`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = `0 0 20px ${color}14`; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 10,
        background: `${color}18`,
        border: `1px solid ${color}40`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <i className={icon} style={{ color, fontSize: '1.2rem' }} />
      </div>
      <div>
        <p style={{ fontSize: '0.78rem', color: 'var(--muted)', letterSpacing: '0.5px', textTransform: 'uppercase', margin: 0, fontWeight: 600 }}>
          {label}
        </p>
        <p style={{ fontSize: '2rem', fontFamily: "'Bebas Neue', sans-serif", color: '#fff', margin: '0.1rem 0 0', letterSpacing: '1px', lineHeight: 1 }}>
          {loading ? '—' : value}
        </p>
      </div>
    </div>
  );
}

// ─── Quick action card ────────────────────────────────────────────────────────

function ActionCard({ href, icon, title, description, color }) {
  return (
    <Link
      href={href}
      style={{
        display: 'block',
        background: '#000',
        border: '1px solid rgba(0,116,255,0.2)',
        borderRadius: 12,
        padding: '1.2rem 1.4rem',
        textDecoration: 'none',
        transition: 'all 0.2s',
        boxShadow: '0 0 14px rgba(0,116,255,0.08)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0,116,255,0.5)'; e.currentTarget.style.boxShadow = '0 0 22px rgba(0,116,255,0.2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0,116,255,0.2)'; e.currentTarget.style.boxShadow = '0 0 14px rgba(0,116,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.5rem' }}>
        <i className={icon} style={{ color: color || 'var(--tekky-blue)', fontSize: '1rem' }} />
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', color: '#fff', letterSpacing: '0.5px' }}>
          {title}
        </span>
      </div>
      <p style={{ color: 'var(--muted)', fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>
        {description}
      </p>
    </Link>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AdminHomeClient({ user }) {
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [totalRes, pendingRes, approvedRes, rejectedRes] = await Promise.all([
          getApplications({ limit: 1 }),
          getApplications({ status: 'pending',  limit: 1 }),
          getApplications({ status: 'approved', limit: 1 }),
          getApplications({ status: 'rejected', limit: 1 }),
        ]);
        setStats({
          total:    totalRes.total,
          pending:  pendingRes.total,
          approved: approvedRes.total,
          rejected: rejectedRes.total,
        });
      } catch {
        // Non-critical — leave zeros
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div>
      {/* Welcome */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '1.8rem',
          color: 'var(--fg)',
          margin: 0,
          textShadow: 'none',
          letterSpacing: '1px',
        }}>
          Welcome back, {user?.name || 'Admin'} 👋
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginTop: '0.35rem' }}>
          Here&apos;s an overview of the league applications.
        </p>
      </div>

      {/* Stats grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2.5rem',
      }}>
        <StatCard label="Total Applications" value={stats.total}    icon="fa-solid fa-layer-group"    color="#0074ff" loading={loading} />
        <StatCard label="Pending Review"      value={stats.pending}  icon="fa-solid fa-clock"           color="#ffb400" loading={loading} />
        <StatCard label="Approved"            value={stats.approved} icon="fa-solid fa-circle-check"   color="#00c864" loading={loading} />
        <StatCard label="Rejected"            value={stats.rejected} icon="fa-solid fa-circle-xmark"   color="#ff3c3c" loading={loading} />
      </div>

      {/* Section divider */}
      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(0,116,255,0.3), transparent)', marginBottom: '2rem' }} />

      {/* Quick actions */}
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', color: 'var(--muted)', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 1rem' }}>
          Quick Actions
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <ActionCard
            href="/admin/applications"
            icon="fa-solid fa-file-lines"
            title="Review Applications"
            description={loading ? 'Loading…' : `${stats.pending} application${stats.pending !== 1 ? 's' : ''} waiting for review`}
            color="var(--tekky-blue)"
          />
        </div>
      </div>
    </div>
  );
}
