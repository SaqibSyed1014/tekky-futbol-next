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
  return new Date(val).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}

function fmtRecord(wins, losses, draws) {
  return `${wins}W - ${losses}L - ${draws}D`;
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ value, label }) {
  return (
    <div style={{
      background: 'rgba(0,0,0,0.35)',
      border: '1px solid rgba(0,116,255,0.4)',
      borderRadius: 12,
      padding: '1rem',
      textAlign: 'center',
    }}>
      <strong style={{ display: 'block', fontSize: '1.5rem', color: 'var(--tekky-blue)', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '1px' }}>
        {value}
      </strong>
      <span style={{ fontSize: '0.8rem', color: '#b6c2d3', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label}
      </span>
    </div>
  );
}

// ─── Info row ─────────────────────────────────────────────────────────────────

function InfoRow({ label, value }) {
  return (
    <p style={{ marginBottom: '0.5rem', lineHeight: 1.7 }}>
      <strong style={{ color: '#b6c2d3' }}>{label}:</strong>{' '}
      <span style={{ color: '#e9eef7' }}>{value}</span>
    </p>
  );
}

// ─── Section card ─────────────────────────────────────────────────────────────

function SectionCard({ title, children, style }) {
  return (
    <div style={{
      background: 'rgba(0,0,0,0.45)',
      border: '1px solid rgba(0,116,255,0.4)',
      borderRadius: 16,
      padding: '2rem',
      boxShadow: '0 0 25px rgba(0,116,255,0.12)',
      lineHeight: 1.8,
      color: '#e2e8f3',
      ...style,
    }}>
      <h2 style={{
        fontFamily: "'Bebas Neue', sans-serif",
        color: 'var(--tekky-blue)',
        fontSize: '1.6rem',
        letterSpacing: '1.5px',
        textShadow: '0 0 12px var(--tekky-blue)',
        marginBottom: '1rem',
      }}>
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
        minHeight: '100vh', background: '#000',
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
        background: 'linear-gradient(180deg,#000 0%,#020b18 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Montserrat', sans-serif", color: '#e9eef7',
        padding: '2rem', textAlign: 'center',
      }}>
        <i className="fa-solid fa-user-slash" style={{ fontSize: '3rem', color: 'rgba(0,116,255,0.4)', marginBottom: '1rem' }} />
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', letterSpacing: '2px', marginBottom: '0.5rem' }}>
          Profile Not Found
        </h1>
        <p style={{ color: '#b6c2d3', marginBottom: '1.5rem' }}>
          This player's profile is not public yet or does not exist.
        </p>
        <Link href="/" style={{
          padding: '0.65rem 1.5rem', border: '2px solid var(--tekky-blue)',
          borderRadius: 40, color: '#fff', textDecoration: 'none',
          fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '1px',
          boxShadow: '0 0 12px var(--tekky-blue)',
        }}>
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
        :root { --tekky-blue: #0074ff; --bg: #000000; --fg: #e9eef7; --muted: #b6c2d3; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Montserrat', sans-serif; background: linear-gradient(180deg,#000 0%,#020b18 100%); color: var(--fg); overflow-x: hidden; }
        @keyframes pulseGlow { 0% { text-shadow: 0 0 15px var(--tekky-blue) } 100% { text-shadow: 0 0 40px var(--tekky-blue) } }
        @keyframes buttonPulse { 0% { box-shadow: 0 0 10px var(--tekky-blue) } 100% { box-shadow: 0 0 25px var(--tekky-blue) } }
        .spinner { display: inline-block; width: 32px; height: 32px; border: 3px solid rgba(0,116,255,0.2); border-top-color: #0074ff; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .profile-cards-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; }
        @media (max-width: 700px) { .profile-cards-grid { grid-template-columns: 1fr; } }
      `}</style>

      {/* ── Nav ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, width: '100%',
        display: 'flex', alignItems: 'center', gap: '1rem',
        padding: '0.9rem 1.25rem',
        background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0,116,255,0.2)', zIndex: 100,
      }}>
        <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', letterSpacing: '2px', color: 'var(--tekky-blue)', textShadow: '0 0 10px var(--tekky-blue)' }}>
          TekkyFutbol
        </Link>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem', fontFamily: "'Bebas Neue', sans-serif" }}>
          <Link href="/" style={{ color: '#fff', textDecoration: 'none', letterSpacing: '1px' }}>Home</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <header style={{
        position: 'relative', minHeight: '52vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', paddingTop: '6.5rem',
        background: 'radial-gradient(60% 50% at 50% 35%, rgba(0,116,255,0.3), rgba(0,0,0,0.95) 60%)',
      }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 900, padding: '0 1rem' }}>
          {/* Avatar */}
          <div style={{
            width: 90, height: 90, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--tekky-blue), #0044cc)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', color: '#fff',
            boxShadow: '0 0 30px rgba(0,116,255,0.5)',
            margin: '0 auto 1rem',
          }}>
            {(profile.name || profile.email || '?')[0].toUpperCase()}
          </div>

          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif", fontSize: '3rem',
            letterSpacing: '2px',
            animation: 'pulseGlow 3s ease-in-out infinite alternate',
          }}>
            {fmt(profile.name, 'PLAYER PROFILE')}
          </h1>

          <p style={{ marginTop: '0.4rem', color: 'var(--tekky-blue)', fontWeight: 700, fontSize: '1rem', letterSpacing: '1px' }}>
            {profile.is_captain ? '⚽ Captain' : '⚽ Player'}
            {profile.team_name ? ` — ${profile.team_name}` : ''}
          </p>

        </div>
      </header>

      {/* ── Glow divider ── */}
      <div style={{
        width: '80%', height: 4, margin: '2rem auto',
        background: 'linear-gradient(90deg, transparent, var(--tekky-blue), transparent)',
        borderRadius: 4, boxShadow: '0 0 20px var(--tekky-blue)',
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
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.55rem 1.25rem',
                  border: '2px solid var(--tekky-blue)', borderRadius: 40,
                  color: '#fff', textDecoration: 'none',
                  fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '1px', fontSize: '0.95rem',
                  animation: 'buttonPulse 2s infinite alternate',
                }}
              >
                <i className="fa-solid fa-arrow-up-right-from-square" />
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
        padding: '2rem 1rem', textAlign: 'center', background: '#000',
        fontFamily: "'Montserrat', sans-serif", fontSize: '0.85rem', color: '#b6c2d3',
      }}>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.6rem', fontSize: '1.3rem' }}>
          <a href="https://www.tiktok.com/@TekkyFutbol_23" target="_blank" rel="noreferrer" style={{ color: '#dfe7ff' }}><i className="fab fa-tiktok" /></a>
          <a href="https://instagram.com/tekkyfutbol" target="_blank" rel="noreferrer" style={{ color: '#dfe7ff' }}><i className="fab fa-instagram" /></a>
          <a href="https://x.com/TekkyFutbol" target="_blank" rel="noreferrer" style={{ color: '#dfe7ff' }}><i className="fab fa-x-twitter" /></a>
          <a href="https://youtube.com/@TekkyFutbol" target="_blank" rel="noreferrer" style={{ color: '#dfe7ff' }}><i className="fab fa-youtube" /></a>
        </div>
        <p>© 2025 TekkyFutbol — For Ballers Who Create.</p>
      </footer>
    </>
  );
}
