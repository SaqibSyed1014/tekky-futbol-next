import Link from 'next/link';
import GlowDivider from '@/components/ui/GlowDivider';

export const metadata = {
  title: 'TekkyFutbol — Pre-Season 2',
  description: 'TekkyFutbol Pre-Season matchday 2 results.',
};

export default function PreSeason2Page() {
  return (
    <>
      <header style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="hero" style={{ position: 'relative', zIndex: 2, maxWidth: 980, padding: '0 1rem' }}>
          <h1>PRE-SEASON</h1>
          <p className="tagline">For Ballers Who Create</p>
          <p className="subtext">Matchday 2 — Sunday, March 9</p>
        </div>
      </header>

      <main style={{ maxWidth: 1080, margin: '2.8rem auto 4rem', padding: '0 1.25rem', textAlign: 'center' }}>
        <GlowDivider />

        <section style={{ margin: '3rem 0' }}>
          <h2>TEKKY NORTH</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Match</th><th>Time</th><th>Date</th></tr>
              </thead>
              <tbody>
                <tr><td>North FC vs Tekky United</td><td>6:00 PM</td><td>Sunday, March 9</td></tr>
                <tr><td>East Kings vs Flow FC</td><td>7:00 PM</td><td>Sunday, March 9</td></tr>
                <tr><td>Phantom XI vs South Crew</td><td>8:00 PM</td><td>Sunday, March 9</td></tr>
                <tr><td>Drip FC vs West Legends</td><td>9:00 PM</td><td>Sunday, March 9</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <GlowDivider />

        <section style={{ margin: '3rem 0' }}>
          <h2>TEKKY SOUTH</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Match</th><th>Time</th><th>Date</th></tr>
              </thead>
              <tbody>
                <tr><td>Rebels vs Alpha Squad</td><td>6:00 PM</td><td>Sunday, March 9</td></tr>
                <tr><td>City Stars vs Tekky Wolves</td><td>7:00 PM</td><td>Sunday, March 9</td></tr>
                <tr><td>Street Lions vs Ballistic FC</td><td>8:00 PM</td><td>Sunday, March 9</td></tr>
                <tr><td>Crew 23 vs Iron Eleven</td><td>9:00 PM</td><td>Sunday, March 9</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <GlowDivider />

        <div className="sec-cta">
          <Link className="cta" href="/pre-season/1">Pre-Season 1</Link>
          <Link className="cta" href="/results">View Results</Link>
          <Link className="cta" href="/">Back to Home</Link>
        </div>
      </main>
    </>
  );
}
