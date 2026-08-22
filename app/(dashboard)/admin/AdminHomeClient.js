'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getApplications, getAdminMemberships, getAdminTeams } from '@/services/adminApi';
import { AdminStarsDivider, AdminStarCrop } from '@/components/admin/ChicagoStar';
import StatCard from '@/components/admin/StatCard';

function ActionCard({ href, icon, title, description }) {
  return (
    <Link href={href} className="ad-card">
      <div className="ad-card__title">
        <i className={icon} />
        {title}
      </div>
      <p>{description}</p>
    </Link>
  );
}

export default function AdminHomeClient({ user }) {
  const [stats, setStats] = useState({
    total: 0, pending: 0, approved: 0, rejected: 0,
    pendingMemberships: 0, totalTeams: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [totalRes, pendingRes, approvedRes, rejectedRes, membershipsRes, teamsRes] = await Promise.all([
          getApplications({ limit: 1 }),
          getApplications({ status: 'pending',  limit: 1 }),
          getApplications({ status: 'approved', limit: 1 }),
          getApplications({ status: 'rejected', limit: 1 }),
          getAdminMemberships({ status: 'pending', page: 1 }),
          getAdminTeams({ page: 1 }),
        ]);
        setStats({
          total:              totalRes.total    ?? totalRes.count    ?? 0,
          pending:            pendingRes.total  ?? pendingRes.count  ?? 0,
          approved:           approvedRes.total ?? approvedRes.count ?? 0,
          rejected:           rejectedRes.total ?? rejectedRes.count ?? 0,
          pendingMemberships: membershipsRes.count ?? 0,
          totalTeams:         teamsRes.count    ?? 0,
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
    <div className="ad-page">
      <div className="ad-hero">
        <div className="ad-hero__copy">
          <p className="ad-kicker">Operations</p>
          <h2 className="ad-title">Welcome back, {user?.name || 'Admin'}</h2>
          <p className="ad-sub">
            League applications, memberships, and team status — a clean read of the pipeline.
          </p>
        </div>
        <div
          className="ad-hero__media"
          style={{ backgroundImage: "url('/images/hero-bg.webp')" }}
        >
          <AdminStarCrop variant="official" size={150} />
        </div>
      </div>

      <div className="ad-stats">
        <StatCard label="Total Applications"    value={stats.total}              icon="fa-solid fa-layer-group"      loading={loading} />
        <StatCard label="Pending Applications" value={stats.pending}             icon="fa-solid fa-clock"            loading={loading} />
        <StatCard label="Approved Players"     value={stats.approved}            icon="fa-solid fa-circle-check"     loading={loading} />
        <StatCard label="Rejected"             value={stats.rejected}            icon="fa-solid fa-circle-xmark"     loading={loading} />
        <StatCard label="Teams"                value={stats.totalTeams}          icon="fa-solid fa-shield-halved"    loading={loading} />
        <StatCard label="Pending Memberships"  value={stats.pendingMemberships}  icon="fa-solid fa-user-clock"       loading={loading} />
      </div>

      <AdminStarsDivider />

      <p className="ad-section-label">Quick Actions</p>
      <div className="ad-card-grid">
        <ActionCard
          href="/admin/applications"
          icon="fa-solid fa-file-lines"
          title="Review Applications"
          description={loading ? 'Loading…' : `${stats.pending} application${stats.pending !== 1 ? 's' : ''} waiting for review`}
        />
        <ActionCard
          href="/admin/memberships"
          icon="fa-solid fa-user-clock"
          title="Approve Memberships"
          description={loading ? 'Loading…' : `${stats.pendingMemberships} membership${stats.pendingMemberships !== 1 ? 's' : ''} pending admin approval`}
        />
        <ActionCard
          href="/admin/teams"
          icon="fa-solid fa-shield-halved"
          title="Manage Teams"
          description={loading ? 'Loading…' : `${stats.totalTeams} team${stats.totalTeams !== 1 ? 's' : ''} registered in the league`}
        />
      </div>
    </div>
  );
}
