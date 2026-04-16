import Link from 'next/link';
import GlowDivider from '@/components/ui/GlowDivider';

export const metadata = {
  title: 'TekkyFutbol — Venues',
  description: 'From Regular Season Battles to the Final Stage.',
};

export default function VenuesPage() {
  return (
    <>
      <header style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="hero" style={{ position: 'relative', zIndex: 2, maxWidth: 980, padding: '0 1rem' }}>
          <h1>VENUES</h1>
          <p className="tagline">For Ballers Who Create</p>
          <p className="subtext">From Regular Season Battles to the Final Stage</p>
        </div>
      </header>

      <main className="tight-list-content" style={{ maxWidth: 1080, margin: '2.8rem auto 4rem', padding: '0 1.25rem' }}>
        <GlowDivider />

        <section id="venues" style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2>SKYLINE PITCH (planned)</h2>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Regular Season Home</p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Chicago Skyline Pitch</p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            The TekkyFutbol regular season begins at Skyline Pitch, where the Attrition phase of the league unfolds.
          </p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            This venue hosts the weekly matchdays where teams build identity, earn points, and fight for postseason qualification.
          </p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            Under the lights, the structure of the league sharpens creativity and rewards consistency.
          </p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            Matches rotate between turf and futsal-style surfaces, allowing the game to evolve across different environments while maintaining TekkyFutbol&#39;s fast, technical style.
          </p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Expect</p>
          <ul className="bullet-list centered">
            <li>Fast-tempo matches</li>
            <li>Alternating turf and futsal surfaces</li>
            <li>High-intensity league play</li>
            <li>A competitive atmosphere that rewards intelligence and flair</li>
          </ul>
        </section>

        <GlowDivider />

        <section id="stage" style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2>THE POSTSEASON STAGE</h2>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Concrete Playoffs</p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Harrison Park (planned)</p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            The TekkyFutbol postseason moves to true street concrete.
          </p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            At Harrison Park, the league shifts from the regular season&#39;s Attrition phase to the Dominion playoffs — where every moment carries weight.
          </p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            The top teams from each division meet on a neutral concrete court to decide the champions.
          </p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            Semifinals. Third Place. Final.
          </p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            Everything is decided on one defining championship day.
          </p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Postseason Format</p>
          <ul className="bullet-list centered">
            <li>Top 2 North Division qualify</li>
            <li>Top 2 South Division qualify</li>
            <li>Single elimination bracket</li>
            <li>Concrete playing surface</li>
            <li>Weather backup: futsal venue</li>
          </ul>
        </section>

        <GlowDivider />

        <div className="sec-cta">
          <Link className="cta" href="/schedule">View Schedule</Link>
          <Link className="cta" href="/registration">Register Your Squad</Link>
          <Link className="cta" href="/">Back to Home</Link>
        </div>
      </main>
    </>
  );
}
