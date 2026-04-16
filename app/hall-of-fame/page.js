import Link from 'next/link';
import GlowDivider from '@/components/ui/GlowDivider';

export const metadata = {
  title: 'Hall of Fame — TekkyFutbol',
  description: 'The history makers of TekkyFutbol.',
};

export default function HallOfFamePage() {
  return (
    <>
      <header style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="hero" style={{ position: 'relative', zIndex: 2, maxWidth: 980, padding: '0 1rem' }}>
          <h1>HALL OF FAME</h1>
          <p className="tagline">For Ballers Who Create</p>
          <p className="subtext">The names the league never forgets.</p>
        </div>
      </header>

      <main style={{ maxWidth: 1080, margin: '2.8rem auto 4rem', padding: '0 1.25rem', textAlign: 'center' }}>
        <GlowDivider />

        <section style={{ margin: '3rem 0' }}>
          <h2>SEASON CHAMPIONS</h2>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            The teams that conquered the season. Crowned at the Finale.
          </p>
          <div className="grid two-columns">
            <div className="card">
              <div className="img-placeholder show">
                <img src="/images/logo.webp" alt="Champion" width={100} height={100} />
              </div>
              <h3>Season 01 Champion</h3>
              <span className="muted">TBD — 2026 Season</span>
            </div>
            <div className="card">
              <div className="img-placeholder show">
                <img src="/images/logo.webp" alt="Runner Up" width={100} height={100} />
              </div>
              <h3>Season 01 Runner Up</h3>
              <span className="muted">TBD — 2026 Season</span>
            </div>
          </div>
        </section>

        <GlowDivider />

        <section style={{ margin: '3rem 0' }}>
          <h2>MOST VALUABLE PLAYERS</h2>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            Individual excellence recognized at the highest level.
          </p>
          <div className="grid">
            <div className="card">
              <div className="img-placeholder show">
                <img src="/images/logo.webp" alt="MVP" width={80} height={80} />
              </div>
              <h3>Season 01 MVP</h3>
              <span className="muted">TBD — 2026 Season</span>
            </div>
            <div className="card">
              <div className="img-placeholder show">
                <img src="/images/logo.webp" alt="Golden Creator" width={80} height={80} />
              </div>
              <h3>Golden Creator Award</h3>
              <span className="muted">TBD — 2026 Season</span>
            </div>
            <div className="card">
              <div className="img-placeholder show">
                <img src="/images/logo.webp" alt="Best Goalkeeper" width={80} height={80} />
              </div>
              <h3>Best Goalkeeper</h3>
              <span className="muted">TBD — 2026 Season</span>
            </div>
          </div>
        </section>

        <GlowDivider />

        <section style={{ margin: '3rem 0' }}>
          <h2>THE LEGACY</h2>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            TekkyFutbol is built on the players and teams that show up, compete, and create.
          </p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            This hall is not just about winning. It&#39;s about leaving a mark on the culture.
          </p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            As seasons pass, this hall grows. The names here are permanent.
          </p>
        </section>

        <GlowDivider />

        <div className="sec-cta">
          <Link className="cta" href="/standings">View Current Standings</Link>
          <Link className="cta" href="/top-scorers">Top Scorers</Link>
          <Link className="cta" href="/">Back to Home</Link>
        </div>
      </main>
    </>
  );
}
