import Link from 'next/link';
import GlowDivider from '@/components/ui/GlowDivider';
import SeasonKitsBrowser from '@/components/shop/SeasonKitsBrowser';

export const metadata = {
  title: 'TekkyFutbol — Season 1 Kits',
  description: 'One team. One kit. All season—designed for consistency, clarity, and presence at game speed.',
};

export default function Season1KitsPage() {
  return (
    <>
      <header style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="hero" style={{ position: 'relative', zIndex: 2, maxWidth: 980, padding: '0 1rem' }}>
          <h1>Season 1 Kits</h1>
          <p className="tagline">For Ballers Who Create</p>
          <p className="subtext">One team. One kit. All season—designed for consistency, clarity, and presence at game speed.</p>
        </div>
      </header>

      <main className="tight-list-content" style={{ maxWidth: 1080, margin: '2.8rem auto 4rem', padding: '0 1.25rem' }}>
        <GlowDivider />

        <section style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2>Designed for the Game</h2>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Season 1 kits follow a structured design system focused on performance, visibility, and uniformity across the league.</p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Every kit is built to:</p>
          <ul className="bullet-list centered">
            <li>Maintain clarity at game speed</li>
            <li>Present clean, professional visuals</li>
            <li>Hold consistency across all teams</li>
          </ul>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Creative expression will expand beyond the pitch through future drops, collaborations, and limited releases.</p>
        </section>

        <GlowDivider />

        <SeasonKitsBrowser />

        <GlowDivider />

        <section style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2>One Team. One Kit.</h2>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Each team will select one official kit for Season 1.</p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Once a kit is selected within a division, it becomes exclusive to that team for the entire season and is removed from availability.</p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Selection is first come, first served.</p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>There are no duplicates. There are no alternate claims once a kit is taken.</p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Secure your team&#39;s kit before it&#39;s gone.</p>
          <div className="sec-cta">
            <Link className="cta" href="/registration">Register Your Team</Link>
          </div>
        </section>

        <GlowDivider />

        <section style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2>How Selection Works</h2>
          <ul className="bullet-list centered">
            <li>Teams are assigned to a division</li>
            <li>Each division has its own set of available kits</li>
            <li>Teams choose one kit from their division</li>
            <li>Selection is locked once confirmed</li>
          </ul>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Early commitment gives access to the best remaining options.</p>
        </section>

        <GlowDivider />

        <section style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2>Production Notice</h2>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>All kits shown represent the official direction for Season 1. Final production versions may include sponsor integration and minor refinements while maintaining the overall design.</p>
        </section>

        <GlowDivider />

        <section style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2>Limited Availability</h2>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Kits are reserved for confirmed teams only.</p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Once selection opens, availability will change quickly.</p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Waiting reduces your options.</p>
        </section>

        <GlowDivider />

        <section style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2>Lock It In</h2>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Choose your kit.</p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Lock it in.</p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Represent it all season.</p>
          <div className="sec-cta">
            <Link className="cta" href="/registration">Register Your Team</Link>
            <Link className="cta" href="/registration">Free Agent</Link>
          </div>
        </section>
      </main>
    </>
  );
}
