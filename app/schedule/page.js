import Link from 'next/link';
import GlowDivider from '@/components/ui/GlowDivider';

export const metadata = {
  title: '2026 League Schedule — TekkyFutbol',
  description: 'The 2026 TekkyFutbol league schedule.',
};

export default function SchedulePage() {
  return (
    <>
      <header style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="hero" style={{ position: 'relative', zIndex: 2, maxWidth: 980, padding: '0 1rem' }}>
          <h1>2026 LEAGUE SCHEDULE</h1>
          <p className="tagline">For Ballers Who Create</p>
          <p className="subtext">The action this week — two venues, one flow.</p>
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: '3rem auto 4rem', padding: '0 1.25rem', textAlign: 'center' }}>
        <GlowDivider />

        <div className="tabs">
          <Link className="cta active" href="/schedule">Men</Link>
          <Link className="cta" href="/women/schedule">Women</Link>
        </div>

        <h2 className="week-label">Matchweek 1</h2>

        <section>
          <div className="table-wrap">
            <h2>Tekky North</h2>
            <table>
              <thead>
                <tr>
                  <th>Venue</th><th>Match</th><th>Time</th><th>Date</th>
                </tr>
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
          <div className="table-wrap">
            <h2>Tekky South</h2>
            <table>
              <thead>
                <tr>
                  <th>Venue</th><th>Match</th><th>Time</th><th>Date</th>
                </tr>
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
          <Link className="cta" href="/rules">View League Rules</Link>
          <Link className="cta" href="/next-fixtures">View Next Week&#39;s Fixtures</Link>
        </div>
      </main>
    </>
  );
}
