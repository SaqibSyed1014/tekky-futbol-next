'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getPublicTeamProfile } from '@/services/profilesApi';
import LeagueFrame from '@/components/league/LeagueFrame';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(val, fallback = '—') {
  if (val === null || val === undefined || val === '') return fallback;
  return val;
}

// ─── Shared card ─────────────────────────────────────────────────────────────

function SectionCard({ title, children }) {
  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--line-blue)',
      borderRadius: 16,
      padding: '2rem',
      boxShadow: 'var(--shadow)',
      lineHeight: 1.8,
      color: 'var(--type-slate)',
    }}>
      <h2 style={{ marginBottom: '1rem' }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <p style={{ marginBottom: '0.5rem', lineHeight: 1.7 }}>
      <strong style={{ color: 'var(--type-silver)', fontWeight: 500 }}>{label}:</strong>{' '}
      <span style={{ color: 'var(--type-slate)' }}>{value}</span>
    </p>
  );
}

// ─── Roster table ─────────────────────────────────────────────────────────────

function RosterTable({ roster }) {
  if (!roster || roster.length === 0) {
    return (
      <p style={{ fontSize: '0.9rem' }}>No public players yet.</p>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(0,116,255,0.2)' }}>
            {['#', 'Name', 'Position', 'Profile'].map((h) => (
              <th key={h} style={{
                padding: '0.55rem 0.85rem', textAlign: 'left',
                fontFamily: 'var(--font-ui)', color: 'var(--type-icy)', fontWeight: 500, fontSize: '0.75rem',
                textTransform: 'uppercase', letterSpacing: '0.1em',
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {roster.map((p, i) => (
            <tr key={p.user_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <td style={{ padding: '0.65rem 0.85rem', color: 'var(--type-cyan)', fontWeight: 500, fontFamily: 'var(--font-tactical)', fontSize: '0.9rem', width: 40 }}>
                {p.number_on_kit != null ? p.number_on_kit : `${i + 1}`}
              </td>
              <td style={{ padding: '0.65rem 0.85rem', color: 'var(--type-silver)', fontWeight: 500 }}>
                {fmt(p.name)}
              </td>
              <td style={{ padding: '0.65rem 0.85rem', color: 'var(--type-slate)' }}>
                {fmt(p.position)}
              </td>
              <td style={{ padding: '0.65rem 0.85rem' }}>
                <Link
                  href={`/profile/${p.user_id}`}
                  style={{
                    color: 'var(--tekky-blue)', textDecoration: 'none',
                    fontSize: '0.8rem', fontWeight: 600,
                    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                  }}
                >
                  <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '0.7rem' }} />
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PublicTeamProfilePage() {
  const { slug } = useParams();
  const [team,     setTeam]     = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getPublicTeamProfile(slug);
        setTeam(data);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ display: 'inline-block', width: 40, height: 40, border: '3px solid rgba(61,139,255,0.2)', borderTopColor: 'var(--tekky-blue)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (notFound || !team) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, var(--navy) 0%, var(--royal) 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-ui)', color: 'var(--type-slate)',
        padding: '2rem', textAlign: 'center',
      }}>
        <i className="fa-solid fa-shield-halved" style={{ fontSize: '3rem', color: 'rgba(0,116,255,0.3)', marginBottom: '1rem', display: 'block' }} />
        <h1 style={{ marginBottom: '0.5rem' }}>
          Team Not Found
        </h1>
        <p style={{ marginBottom: '1.5rem' }}>
          This team does not exist or is not available.
        </p>
        <Link href="/" className="cta">
          Back to Home
        </Link>
      </div>
    );
  }

  const isOfficial = team.status === 'official';

  return (
    <LeagueFrame>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: var(--font-ui); background: linear-gradient(180deg, #050b14 0%, #081026 100%); color: #fff; overflow-x: hidden; }
      `}</style>

      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, width: '100%',
        display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.9rem 1.25rem',
        background: 'rgba(7, 26, 69, 0.72)', backdropFilter: 'blur(18px)',
        borderBottom: '1px solid var(--line)', zIndex: 100,
      }}>
        <Link href="/" style={{ color: 'var(--type-white)', textDecoration: 'none', fontFamily: 'var(--font-hero)', fontSize: '1.4rem', letterSpacing: '0.12em', textTransform: 'uppercase', textShadow: 'var(--type-keyline)' }}>
          TekkyFutbol
        </Link>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem', fontFamily: 'var(--font-ui)', fontWeight: 500, fontSize: '0.74rem', textTransform: 'uppercase' }}>
          <Link href="/" style={{ color: 'var(--type-silver)', textDecoration: 'none', letterSpacing: '0.06em' }}>Home</Link>
        </div>
      </nav>

      {/* Hero */}
      <header style={{
        position: 'relative', minHeight: '52vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', paddingTop: '6.5rem',
      }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 900, padding: '0 1rem' }}>

          {/* Kit thumbnail or shield icon */}
          {team.kit_slug ? (
            <div style={{ position: 'relative', width: 110, height: 110, margin: '0 auto 1rem' }}>
              <Image src={`/images/tf-kits/${team.kit_slug}.JPEG`} alt={team.kit_slug} fill style={{ objectFit: 'contain' }} />
            </div>
          ) : (
            <div style={{
              width: 90, height: 90, borderRadius: '50%',
              background: 'linear-gradient(135deg, #3d8bff, #1553d1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.2rem', margin: '0 auto 1rem',
              boxShadow: '0 12px 32px rgba(21, 83, 209, 0.45)',
            }}>
              <i className="fa-solid fa-shield-halved" style={{ color: '#fff' }} />
            </div>
          )}

          <h1>
            {team.name}
          </h1>

          <p style={{ marginTop: '0.4rem', fontFamily: 'var(--font-tactical)', color: 'var(--type-cyan)', fontWeight: 500, fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {isOfficial ? '✅ Official Team' : '⏳ Forming'}
            {team.captain_name ? ` — Captain: ${team.captain_name}` : ''}
          </p>

          {/* Team link button */}
          {team.team_link && (
            <a
              href={team.team_link}
              target="_blank"
              rel="noreferrer"
              className="cta"
            >
              Team Page
            </a>
          )}
        </div>
      </header>

      {/* Glow divider */}
      <div style={{
        width: '80%', height: 4, margin: '2rem auto',
        background: 'linear-gradient(90deg, transparent, var(--tekky-blue), transparent)',
        borderRadius: 4, 
      }} />

      {/* Cards */}
      <main style={{
        maxWidth: 1100, margin: '0 auto 5rem', padding: '0 1.25rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
      }}>

        {/* Team Info */}
        <SectionCard title="Team Info">
          <InfoRow label="Team Name" value={team.name} />
          <InfoRow label="Captain"   value={fmt(team.captain_name)} />
          <InfoRow label="Status"    value={isOfficial ? 'Official' : 'Forming'} />
          {team.kit_slug && <InfoRow label="Kit" value={team.kit_slug} />}
          {team.description && (
            <p style={{ marginTop: '0.75rem', fontSize: '0.88rem', lineHeight: 1.7 }}>
              {team.description}
            </p>
          )}
        </SectionCard>

        {/* Roster */}
        <SectionCard title={`Roster (${team.roster?.length ?? 0})`}>
          <RosterTable roster={team.roster} />
        </SectionCard>

      </main>

      {/* Footer */}
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
    </LeagueFrame>
  );
}
