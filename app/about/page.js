import Link from 'next/link';
import GlowDivider from '@/components/ui/GlowDivider';

export const metadata = {
  title: 'TekkyFutbol — About',
};

export default function AboutPage() {
  return (
    <>
      <header style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="hero" style={{ position: 'relative', zIndex: 2, maxWidth: 980, padding: '0 1rem' }}>
          <h1>ABOUT TEKKYFUTBOL</h1>
          <p className="tagline">For Ballers Who Create</p>
          <p className="subtext">
            TekkyFutbol is Chicago&apos;s competitive 5v5 league built around creativity, pressure, and
            controlled chaos.
          </p>
        </div>
      </header>

      <main className="tight-list-content" style={{ maxWidth: 1080, margin: '2.8rem auto 4rem', padding: '0 1.25rem' }}>
        <GlowDivider />

        <section style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', color: 'var(--tekky-blue)', marginBottom: '0.5rem' }}>Our Story</h2>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            TekkyFutbol was founded to redefine small-sided competition. Every touch, every play,
            every moment — built around creative flow and passion for the game.
          </p>
        </section>

        <GlowDivider />

        <section id="structure" style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', color: 'var(--tekky-blue)', marginBottom: '0.5rem' }}>Structure</h2>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            TekkyFutbol runs a structured 16-matchweek season with 8 teams per division — North and South.
          </p>
          <ul className="bullet-list" style={{ maxWidth: 550, margin: '0 auto' }}>
            <li style={{ textAlign: 'left' }}>16 regular matchweeks</li>
            <li style={{ textAlign: 'left' }}>1 semifinal week</li>
            <li style={{ textAlign: 'left' }}>1 championship week (Final + Third Place)</li>
          </ul>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            Matchdays alternate between futsal courts and indoor turf, challenging teams to adapt their
            style across surfaces throughout the season.
          </p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            The season concludes with a championship environment built to celebrate performance, culture,
            and the moments that define the league.
          </p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            Championship Week rotates between East and West Chicago each season — reinforcing the
            territorial energy of North vs South and grounding the finale in the city&apos;s culture.
          </p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            Every match is recorded and archived — documenting the pressure, the rivalries, and the
            moments that build Tekky history.
          </p>
        </section>

        <GlowDivider />

        <section id="evolution" style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', color: 'var(--tekky-blue)', marginBottom: '0.5rem' }}>EVOLUTION</h2>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>TekkyFutbol is built for growth.</p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            The long-term vision includes permanent clubs, true home venues, expanded divisions, and
            structured age groups — creating a full competitive pyramid rooted in street principles.
          </p>
          <ul className="bullet-list" style={{ maxWidth: 550, margin: '0 auto' }}>
            <li style={{ textAlign: 'left' }}>North vs South will evolve into home territories.</li>
            <li style={{ textAlign: 'left' }}>Seasonal play will evolve into year-round identity.</li>
            <li style={{ textAlign: 'left' }}>Temporary venues will evolve into lasting football homes.</li>
          </ul>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>This is only the beginning.</p>
        </section>

        <GlowDivider />

        <section style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', color: 'var(--tekky-blue)', marginBottom: '0.5rem' }}>Mission</h2>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            Our mission is simple: reward the players who take risks, adapt under pressure, and finish
            what they start.
          </p>
        </section>

        <GlowDivider />

        <section style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', color: 'var(--tekky-blue)', marginBottom: '0.5rem' }}>Movement</h2>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            TekkyFutbol is rooted in street principles — adaptability under pressure, confidence
            without permission, and moments that decide everything.
          </p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            Different environments expose different weaknesses.
          </p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            TekkyFutbol rewards those who adapt.
          </p>
          <div className="sec-cta">
            <Link className="cta" href="/registration">Join the League</Link>
          </div>
        </section>
      </main>
    </>
  );
}
