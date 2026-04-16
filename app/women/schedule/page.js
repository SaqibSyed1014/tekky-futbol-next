import Link from 'next/link';
import GlowDivider from '@/components/ui/GlowDivider';

export const metadata = {
  title: 'Women Schedule — TekkyFutbol',
  description: "Full match schedule for the Women's league.",
};

export default function WomenSchedulePage() {
  return (
    <>
      <header style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="hero" style={{ position: 'relative', zIndex: 2, maxWidth: 980, padding: '0 1rem' }}>
          <h1>2026 LEAGUE SCHEDULE</h1>
          <p className="tagline">For Ballers Who Create</p>
          <p className="subtext">The action this week — two venues, one flow.</p>
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: '2.8rem auto 4rem', padding: '0 1.25rem', textAlign: 'center' }}>
        <GlowDivider />

        <div className="tabs">
          <Link className="cta" href="/schedule">Men</Link>
          <Link className="cta active" href="/women/schedule">Women</Link>
        </div>

        <section>
          <h2 className="week-label">Matchweek 1</h2>
        </section>

        <section>
          <h2>Tekky North</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Venue</th><th>Match</th><th>Time</th><th>Date</th></tr>
              </thead>
              <tbody>
                <tr><td className="venue-cell">Tekky North</td><td></td><td></td><td></td></tr>
                <tr><td className="venue-cell">Tekky North</td><td></td><td></td><td></td></tr>
                <tr><td className="venue-cell">Tekky North</td><td></td><td></td><td></td></tr>
                <tr><td className="venue-cell">Tekky North</td><td></td><td></td><td></td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <GlowDivider />

        <section>
          <h2>Tekky South</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Venue</th><th>Match</th><th>Time</th><th>Date</th></tr>
              </thead>
              <tbody>
                <tr><td className="venue-cell">Tekky South</td><td></td><td></td><td></td></tr>
                <tr><td className="venue-cell">Tekky South</td><td></td><td></td><td></td></tr>
                <tr><td className="venue-cell">Tekky South</td><td></td><td></td><td></td></tr>
                <tr><td className="venue-cell">Tekky South</td><td></td><td></td><td></td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <GlowDivider />

        <div className="sec-cta">
          <Link className="cta" href="/registration">Register Your Squad</Link>
          <Link className="cta" href="/rules">League Rules</Link>
          <Link className="cta" href="/women/next-fixtures">Next Fixtures</Link>
        </div>
      </main>
    </>
  );
}
