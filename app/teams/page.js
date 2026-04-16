import Link from 'next/link';
import GlowDivider from '@/components/ui/GlowDivider';

export const metadata = {
  title: 'TekkyFutbol — Teams',
  description: 'All teams competing in the TekkyFutbol league.',
};

const northTeams = [
  'North FC',
  'Tekky United',
  'Flow FC',
  'Drip FC',
  'East Kings',
  'West Legends',
  'City Stars',
  'Rebels',
];

const southTeams = [
  'Alpha Squad',
  'Tekky Wolves',
  'Iron Eleven',
  'Street Lions',
  'Ballistic FC',
  'Phantom XI',
  'Crew 23',
  'South Crew',
];

export default function TeamsPage() {
  return (
    <>
      <header style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="hero" style={{ position: 'relative', zIndex: 2, maxWidth: 980, padding: '0 1rem' }}>
          <h1>THE TEAMS</h1>
          <p className="tagline">For Ballers Who Create</p>
          <p className="subtext">16 squads. 2 divisions. 1 champion.</p>
        </div>
      </header>

      <main style={{ maxWidth: 1080, margin: '2.8rem auto 4rem', padding: '0 1.25rem', textAlign: 'center' }}>
        <GlowDivider />

        <section style={{ margin: '3rem 0' }}>
          <h2>TEKKY NORTH</h2>
          <div className="grid">
            {northTeams.map((team) => (
              <div className="card" key={team}>
                <div className="img-placeholder show">
                  <img src="/images/logo.webp" alt={team} width={80} height={80} />
                </div>
                <h3>{team}</h3>
                <span className="muted">Tekky North Division</span>
              </div>
            ))}
          </div>
        </section>

        <GlowDivider />

        <section style={{ margin: '3rem 0' }}>
          <h2>TEKKY SOUTH</h2>
          <div className="grid">
            {southTeams.map((team) => (
              <div className="card" key={team}>
                <div className="img-placeholder show">
                  <img src="/images/logo.webp" alt={team} width={80} height={80} />
                </div>
                <h3>{team}</h3>
                <span className="muted">Tekky South Division</span>
              </div>
            ))}
          </div>
        </section>

        <GlowDivider />

        <div className="sec-cta">
          <Link className="cta" href="/standings">View Standings</Link>
          <Link className="cta" href="/registration">Register Your Squad</Link>
          <Link className="cta" href="/">Back to Home</Link>
        </div>
      </main>
    </>
  );
}
