import Link from 'next/link';
import GlowDivider from '@/components/ui/GlowDivider';

export const metadata = {
  title: 'TekkyFutbol — Match Passes',
  description: 'North Division, South Division, and League match passes.',
};

const CHOICES = [
  {
    href: '/tickets/north-division',
    title: 'North Division',
    description: 'Single Match Passes and Supporter Bundles for North Division fixtures.',
  },
  {
    href: '/tickets/south-division',
    title: 'South Division',
    description: 'Single Match Passes and Supporter Bundles for South Division fixtures.',
  },
  {
    href: '/tickets/league-passes',
    title: 'League Passes',
    description: 'Season Access, Playoff, and Finale Celebration passes.',
  },
];

export default function TicketsPage() {
  return (
    <>
      <header style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="hero" style={{ position: 'relative', zIndex: 2, maxWidth: 980, padding: '0 1rem' }}>
          <h1>MATCH PASSES</h1>
          <p className="tagline">For Ballers Who Create</p>
          <p className="subtext">Get in the stands. Feel the game live.</p>
        </div>
      </header>

      <main style={{ maxWidth: 1080, margin: '2.8rem auto 4rem', padding: '0 1.25rem', textAlign: 'center' }}>
        <GlowDivider />

        <div className="grid">
          {CHOICES.map((choice) => (
            <div className="card" key={choice.href}>
              <h3>{choice.title}</h3>
              <p className="muted">{choice.description}</p>
              <div className="sec-cta">
                <Link className="cta" href={choice.href}>View Passes</Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
