'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getPublicProfile } from '@/services/profilesApi';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(val, fallback = '—') {
  if (val === null || val === undefined || val === '') return fallback;
  return val;
}

function fmtDate(val) {
  if (!val) return '—';
  return new Date(val).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
}

function fmtRecord(wins, losses, draws) {
  return `${wins}W - ${losses}L - ${draws}D`;
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ value, label }) {
  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--line-blue)',
      borderRadius: 12,
      padding: '1rem',
      textAlign: 'center',
    }}>
      <strong style={{ display: 'block', fontSize: '1.5rem', color: 'var(--type-white)', fontFamily: 'var(--font-hero)', fontWeight: 400, letterSpacing: '0.03em' }}>
        {value}
      </strong>
      <span style={{ fontFamily: 'var(--font-tactical)', fontSize: '0.7rem', color: 'var(--type-cyan)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {label}
      </span>
    </div>
  );
}

// ─── Info row ─────────────────────────────────────────────────────────────────

function InfoRow({ label, value }) {
  return (
    <p style={{ marginBottom: '0.5rem', lineHeight: 1.7 }}>
      <strong style={{ color: 'var(--type-silver)', fontWeight: 500 }}>{label}:</strong>{' '}
      <span style={{ color: 'var(--type-slate)' }}>{value}</span>
    </p>
  );
}

// ─── Section card ─────────────────────────────────────────────────────────────

function SectionCard({ title, children, style }) {
  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--line-blue)',
      borderRadius: 16,
      padding: '2rem',
      boxShadow: 'var(--shadow)',
      lineHeight: 1.8,
      color: 'var(--type-slate)',
      ...style,
    }}>
      <h2 style={{ marginBottom: '1rem' }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

// ─── Link status badge ────────────────────────────────────────────────────────

function LinkStatusBadge({ status }) {
  const map = {
    none:     { color: '#666',    label: 'Not submitted' },
    pending:  { color: '#ffb400', label: 'Pending approval' },
    approved: { color: '#00c864', label: 'Live' },
    rejected: { color: '#ff6b6b', label: 'Rejected' },
  };
  const s = map[status] || map.none;
  return (
    <span style={{
      fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.3px',
      padding: '0.15rem 0.55rem', borderRadius: 4,
      background: `${s.color}18`, border: `1px solid ${s.color}50`,
      color: s.color,
    }}>
      {s.label}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PublicProfilePage() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getPublicProfile(userId);
        setProfile(data);
      } catch (err) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  // ── Loading
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', background: 'var(--bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span className="spinner" style={{ width: 40, height: 40, borderWidth: 4 }} />
      </div>
    );
  }

  // ── Not found
  if (notFound || !profile) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, var(--navy) 0%, var(--royal) 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-ui)', color: 'var(--type-slate)',
        padding: '2rem', textAlign: 'center',
      }}>
        <i className="fa-solid fa-user-slash" style={{ fontSize: '3rem', color: 'rgba(0,116,255,0.4)', marginBottom: '1rem' }} />
        <h1 style={{ marginBottom: '0.5rem' }}>
          Profile Not Found
        </h1>
        <p style={{ marginBottom: '1.5rem' }}>
          This player's profile is not public yet or does not exist.
        </p>
        <Link href="/" className="cta">
          Back to Home
        </Link>
      </div>
    );
  }

  // Use !! to ensure boolean — avoids React rendering falsy numbers as text nodes
  const hasStats         = !!(profile.goals || profile.assists || profile.matches_played || profile.mvps);
  const hasUpcomingMatch = !!(profile.upcoming_opponent || profile.upcoming_date);
  const hasTeamStanding  = !!(profile.team_rank != null || profile.team_wins || profile.team_losses || profile.team_draws);

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: var(--font-ui); background: linear-gradient(180deg, #050b14 0%, #081026 100%); color: var(--fg); overflow-x: hidden; }
        .spinner { display: inline-block; width: 32px; height: 32px; border: 3px solid rgba(61,139,255,0.2); border-top-color: var(--tekky-blue); border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .profile-cards-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; }
        @media (max-width: 700px) { .profile-cards-grid { grid-template-columns: 1fr; } }
      `}</style>

      {/* ── Hero ── */}
      <header style={{
        position: 'relative', minHeight: '50vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', paddingTop: '6.5rem',
        background: 'linear-gradient(180deg, #081026 0%, #050b14 100%)',
      }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 900, padding: '0 1rem' }}>
          {/* Avatar */}
          <div style={{
            width: 90, height: 90, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--tekky-blue), #1553d1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-hero)', fontSize: '2.5rem', color: '#fff',
            boxShadow: '0 12px 32px rgba(21, 83, 209, 0.45)',
            margin: '0 auto 1rem',
          }}>
            {(profile.name || profile.email || '?')[0].toUpperCase()}
          </div>

          <h1>
            {fmt(profile.name, 'PLAYER PROFILE')}
          </h1>

          <p style={{ marginTop: '0.4rem', fontFamily: 'var(--font-tactical)', color: 'var(--type-cyan)', fontWeight: 500, fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {profile.is_captain ? '⚽ Captain' : '⚽ Player'}
            {profile.team_name ? ` — ${profile.team_name}` : ''}
          </p>

        </div>
      </header>

      {/* ── Glow divider ── */}
      <div style={{
        width: '80%', height: 4, margin: '2rem auto',
        background: 'linear-gradient(90deg, transparent, var(--tekky-blue), transparent)',
        borderRadius: 4, 
      }} />

      {/* ── Cards grid — always 2×2 on desktop ── */}
      <main className="profile-cards-grid" style={{ maxWidth: 1100, margin: '0 auto 5rem', padding: '0 1.25rem' }}>

        {/* Player Info — always shown */}
        <SectionCard title="Player Info">
          <InfoRow label="Name"     value={fmt(profile.name)} />
          <InfoRow label="Team"     value={fmt(profile.team_name)} />
          <InfoRow label="Division" value={profile.preferred_division ? profile.preferred_division.charAt(0).toUpperCase() + profile.preferred_division.slice(1) : '—'} />
          {profile.number_on_kit != null && (
            <InfoRow label="Jersey #" value={`#${profile.number_on_kit}`} />
          )}
          {profile.instagram && (
            <InfoRow label="Instagram" value={
              <a href={`https://instagram.com/${profile.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" style={{ color: 'var(--tekky-blue)' }}>
                {profile.instagram}
              </a>
            } />
          )}
          {profile.team_link && (
            <p style={{ marginTop: '0.75rem' }}>
              <a href={profile.team_link} target="_blank" rel="noreferrer" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                color: 'var(--tekky-blue)', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600,
              }}>
                <i className="fa-solid fa-link" /> Team Page
              </a>
            </p>
          )}
          {profile.profile_link && (
            <div style={{ marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid rgba(0,116,255,0.15)' }}>
              <a
                href={profile.profile_link}
                target="_blank"
                rel="noreferrer"
                className="cta"
              >
                My Profile Link
              </a>
            </div>
          )}
        </SectionCard>

        {/* Stats Overview — only when at least one stat > 0 */}
        {hasStats ? (
          <SectionCard title="Stats Overview">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <StatCard value={profile.goals}          label="Goals" />
              <StatCard value={profile.assists}        label="Assists" />
              <StatCard value={profile.matches_played} label="Matches" />
              <StatCard value={profile.mvps}           label="MVPs" />
            </div>
          </SectionCard>
        ) : null}

        {/* Upcoming Match */}
        {hasUpcomingMatch ? (
          <SectionCard title="Upcoming Match">
            <InfoRow label="Opponent" value={fmt(profile.upcoming_opponent)} />
            <InfoRow label="Date"     value={fmtDate(profile.upcoming_date)} />
            <InfoRow label="Kickoff"  value={fmt(profile.upcoming_kickoff)} />
            <InfoRow label="Location" value={fmt(profile.upcoming_location)} />
          </SectionCard>
        ) : null}

        {/* Team Standing */}
        {hasTeamStanding ? (
          <SectionCard title="Team Standing">
            {profile.team_rank != null && (
              <InfoRow label="Rank" value={`${profile.team_rank}${['st','nd','rd'][((profile.team_rank+90)%100-10)%10-1]||'th'}`} />
            )}
            <InfoRow label="Record"          value={fmtRecord(profile.team_wins, profile.team_losses, profile.team_draws)} />
            <InfoRow label="Goal Difference" value={profile.team_goal_difference > 0 ? `+${profile.team_goal_difference}` : `${profile.team_goal_difference}`} />
          </SectionCard>
        ) : null}

      </main>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: '1px solid rgba(0,116,255,0.2)',
        padding: '2rem 1rem', textAlign: 'center', background: 'rgba(5, 16, 48, 0.78)',
        fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: 'var(--type-slate)',
      }}>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.6rem', fontSize: '1.3rem' }}>
          <a href="https://www.tiktok.com/@TekkyFutbol_23" target="_blank" rel="noreferrer" style={{ color: '#dfe7ff' }}><i className="fab fa-tiktok" /></a>
          <a href="https://instagram.com/tekkyfutbol" target="_blank" rel="noreferrer" style={{ color: '#dfe7ff' }}><i className="fab fa-instagram" /></a>
          <a href="https://x.com/TekkyFutbol" target="_blank" rel="noreferrer" style={{ color: '#dfe7ff' }}><i className="fab fa-x-twitter" /></a>
          <a href="https://youtube.com/@TekkyFutbol" target="_blank" rel="noreferrer" style={{ color: '#dfe7ff' }}><i className="fab fa-youtube" /></a>
        </div>
        <p>© 2027 TekkyFutbol — For Ballers Who Create.</p>
      </footer>
    </>
  );
}
