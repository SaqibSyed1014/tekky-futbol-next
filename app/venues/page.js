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
          <h2>THE ATTRITION STAGE</h2>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Regular Season Matchdays</p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Chicago-Area Venues (Planned)</p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            The TekkyFutbol regular season unfolds during the Attrition stage — where teams build identity, earn points, and fight for postseason qualification.
          </p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            Throughout the season, matchdays intentionally alternate between premium turf venues and futsal-style courts, forcing teams to adapt across different football environments while maintaining TekkyFutbol’s fast, technical style.
          </p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            On turf, the game rewards speed, transitions, and intensity.
          </p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            On futsal courts, the game becomes tighter, faster, and more technical — demanding precision, intelligence, and quick decision-making under pressure.
          </p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            Only the teams that consistently adapt, compete, and evolve across both environments earn the right to advance.
          </p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Expect</p>
          <ul className="bullet-list centered">
            <li>Fast-tempo matches</li>
            <li>Alternating turf and futsal-style surfaces</li>
            <li>High-intensity league competition</li>
            <li>Different environments that test complete teams</li>
            <li>A competitive atmosphere that rewards intelligence and flair</li>
          </ul>
        </section>

        <GlowDivider />

        <section id="stage" style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2>THE DOMINION STAGE</h2>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Concrete Playoffs</p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Chicago Championship Venue (Planned)</p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            The TekkyFutbol postseason moves to true street concrete.
          </p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            The regular season’s Attrition phase gives way to Dominion — where every moment carries weight.
          </p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            Top teams meet at a neutral championship venue to decide who rises above the rest.
          </p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            Semifinals. Third Place. Final.
          </p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            Everything is decided on one defining championship weekend.
          </p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Postseason Format</p>
          <ul className="bullet-list centered">
            <li>Top North teams qualify</li>
            <li>Top South teams qualify</li>
            <li>Single-elimination bracket</li>
            <li>Concrete playing surface</li>
            <li>Weather backup venue</li>
          </ul>
        </section>

        <GlowDivider />

        <section style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2>Festival Venue</h2>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Festival Night (Planned)</p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            TekkyFutbol championship weekend extends beyond the court.
          </p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            Music, streetwear, creators, food, supporters, and football culture come together for one closing-night experience.
          </p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Planned Features</p>
          <ul className="bullet-list centered">
            <li>Live DJ/music</li>
            <li>Streetwear & merch pop-ups</li>
            <li>Food vendors</li>
            <li>Creator/media content</li>
            <li>Awards & celebration</li>
            <li>Community atmosphere</li>
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
