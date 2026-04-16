import Link from 'next/link';
import GlowDivider from '@/components/ui/GlowDivider';

export const metadata = {
  title: 'TekkyFutbol Shop — Player Dashboard',
  description: 'Your personal player dashboard.',
};

export default function PlayerDashboardPage() {
  return (
    <>
      <header style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="hero" style={{ position: 'relative', zIndex: 2, maxWidth: 980, padding: '0 1rem' }}>
          <h1>PLAYER DASHBOARD</h1>
          <p className="tagline">For Ballers Who Create</p>
          <p className="subtext">Your season at a glance.</p>
        </div>
      </header>

      <main style={{ maxWidth: 1080, margin: '2.8rem auto 4rem', padding: '0 1.25rem', textAlign: 'center' }}>
        <GlowDivider />

        <div className="grid">
          <div className="card">
            <h3>Player Info</h3>
            <p style={{ margin: '0.4rem 0', lineHeight: 1.8 }}><strong>Name:</strong> —</p>
            <p style={{ margin: '0.4rem 0', lineHeight: 1.8 }}><strong>Team:</strong> —</p>
            <p style={{ margin: '0.4rem 0', lineHeight: 1.8 }}><strong>Division:</strong> —</p>
            <p style={{ margin: '0.4rem 0', lineHeight: 1.8 }}><strong>Position:</strong> —</p>
          </div>

          <div className="card">
            <h3>Stats Overview</h3>
            <div className="stat-grid">
              <div className="stat-item">
                <span className="stat-value">—</span>
                <span className="stat-label">Goals</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">—</span>
                <span className="stat-label">Assists</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">—</span>
                <span className="stat-label">Matches</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">—</span>
                <span className="stat-label">Wins</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3>Upcoming Match</h3>
            <p style={{ margin: '0.4rem 0', lineHeight: 1.8 }}><strong>Opponent:</strong> —</p>
            <p style={{ margin: '0.4rem 0', lineHeight: 1.8 }}><strong>Date:</strong> —</p>
            <p style={{ margin: '0.4rem 0', lineHeight: 1.8 }}><strong>Time:</strong> —</p>
            <p style={{ margin: '0.4rem 0', lineHeight: 1.8 }}><strong>Venue:</strong> —</p>
          </div>

          <div className="card">
            <h3>Team Standing</h3>
            <p style={{ margin: '0.4rem 0', lineHeight: 1.8 }}><strong>Position:</strong> —</p>
            <p style={{ margin: '0.4rem 0', lineHeight: 1.8 }}><strong>Points:</strong> —</p>
            <p style={{ margin: '0.4rem 0', lineHeight: 1.8 }}><strong>W/L:</strong> —</p>
            <p style={{ margin: '0.4rem 0', lineHeight: 1.8 }}><strong>GD:</strong> —</p>
          </div>
        </div>

        <GlowDivider />

        <div className="sec-cta">
          <Link className="cta" href="/standings">View Standings</Link>
          <Link className="cta" href="/next-fixtures">Next Fixtures</Link>
          <Link className="cta" href="/">Back to Home</Link>
        </div>
      </main>
    </>
  );
}
