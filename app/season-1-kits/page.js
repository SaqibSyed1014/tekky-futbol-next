import Link from 'next/link';
import GlowDivider from '@/components/ui/GlowDivider';

export const metadata = {
  title: 'Season 1 Kits — TekkyFutbol',
  description: 'One team. One kit. All season—designed for consistency, clarity, and presence at game speed.',
};

const northKits = Array.from({ length: 8 }, (_, i) => ({
  img: `/images/kits/north-${i + 1}.webp`,
  name: `North Division Kit ${i + 1}`,
  status: 'Available',
}));

const southKits = Array.from({ length: 8 }, (_, i) => ({
  img: `/images/kits/south-${i + 1}.webp`,
  name: `South Division Kit ${i + 1}`,
  status: 'Available',
}));

function KitCard({ kit }) {
  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div style={{ width: '100%', height: 200, borderRadius: 12, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', background: 'rgba(0,116,255,0.05)' }}>
        <img src={kit.img} alt={kit.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
      <div style={{ fontWeight: 600 }}>{kit.name}</div>
      <div style={{ boxShadow: '0 0 12px var(--tekky-blue)', border: '2px solid var(--tekky-blue)', borderRadius: 40, padding: '6px 20px', color: '#fff', fontSize: 14, display: 'inline-block' }}>{kit.status}</div>
    </div>
  );
}

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

        <section id="northKits" style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2>North Division Kits</h2>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Teams competing in the North Division will select their kit from the options below.</p>
          <div className="divisions-grid" style={{ marginTop: '1.5rem' }}>
            {northKits.map((kit) => <KitCard key={kit.name} kit={kit} />)}
          </div>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Secure your preferred kit early.</p>
          <div className="sec-cta">
            <Link className="cta" href="/registration">Register Your Team</Link>
            <Link className="cta" href="/registration">Free Agent</Link>
          </div>
        </section>

        <GlowDivider />

        <section id="southKits" style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2>South Division Kits</h2>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Teams competing in the South Division will select their kit from the options below.</p>
          <div className="divisions-grid" style={{ marginTop: '1.5rem' }}>
            {southKits.map((kit) => <KitCard key={kit.name} kit={kit} />)}
          </div>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Availability will not last once selection begins.</p>
          <div className="sec-cta">
            <Link className="cta" href="/registration">Register Your Team</Link>
            <Link className="cta" href="/registration">Free Agent</Link>
          </div>
        </section>

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
