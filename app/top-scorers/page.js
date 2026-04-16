import Link from 'next/link';
import GlowDivider from '@/components/ui/GlowDivider';

export const metadata = {
  title: 'TekkyFutbol — Top Scorers',
  description: 'Goals change games. Creators change seasons.',
};

const ranks = [1, 2, 3, 4, 5];

export default function TopScorersPage() {
  return (
    <>
      <header style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="hero" style={{ position: 'relative', zIndex: 2, maxWidth: 980, padding: '0 1rem' }}>
          <h1>TOP SCORERS</h1>
          <p className="tagline">For Ballers Who Create</p>
          <p className="subtext">Goals change games. Creators change seasons.</p>
        </div>
      </header>

      <main className="spaced-content" style={{ maxWidth: 1080, margin: '2.8rem auto 4rem', padding: '0 1.25rem', textAlign: 'center' }}>
        <GlowDivider />

        <div className="tabs">
          <Link className="cta active" href="/top-scorers">Men</Link>
          <Link className="cta" href="/women/top-scorers">Women</Link>
        </div>

        <section id="overview" style={{ margin: '3rem 0' }}>
          <h2>HOW SCORING IS COUNTED</h2>
          <p className="text-left">Official Goal Rules:</p>
          <ul className="bullet-list">
            <li>Only goals scored in live match play are recorded</li>
            <li>Bonus / Dominion skill modifiers are not included in player totals</li>
            <li>Own goals do not count toward individual tallies</li>
            <li>Forfeit-awarded goals are not credited to individual players</li>
            <li>Ties are broken by fewer games played, then head-to-head</li>
          </ul>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>This is pure output.</p>
        </section>

        <GlowDivider />

        <section style={{ margin: '3rem 0' }}>
          <h2>2026 SEASON — SCORING LEADERS</h2>

          <div className="table-wrap">
            <h2>Tekky North</h2>
            <table>
              <thead>
                <tr><th>Rank</th><th>Player</th><th>Team</th><th>Goals</th><th>Matches</th></tr>
              </thead>
              <tbody>
                {ranks.map((rank) => (
                  <tr key={rank}><td className="venue-cell">{rank}</td><td></td><td></td><td></td><td></td></tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="table-wrap">
            <h2>Tekky South</h2>
            <table>
              <thead>
                <tr><th>Rank</th><th>Player</th><th>Team</th><th>Goals</th><th>Matches</th></tr>
              </thead>
              <tbody>
                {ranks.map((rank) => (
                  <tr key={rank}><td className="venue-cell">{rank}</td><td></td><td></td><td></td><td></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <GlowDivider />

        <section id="golden-creator" style={{ margin: '3rem 0' }}>
          <h2>GOLDEN CREATOR AWARD</h2>
          <p className="text-left">At the end of each season:</p>
          <ul className="bullet-list">
            <li>Highest official goal total wins the Golden Creator</li>
            <li>Award presented at the Finale</li>
            <li>Tiebreaker: Fewest matches played</li>
            <li>Secondary tiebreaker: Playoff goals</li>
          </ul>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Dominion may reward flair.</p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>But the Golden Creator rewards finishers.</p>
        </section>

        <GlowDivider />

        <section style={{ margin: '3rem 0' }}>
          <h2>WHY IT MATTERS</h2>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Goals change narratives.</p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>The league celebrates creativity — but this table celebrates execution.</p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>This is the scoreboard history remembers.</p>
        </section>

        <GlowDivider />

        <div className="sec-cta">
          <Link className="cta" href="/registration">JOIN THE LEAGUE</Link>
          <Link className="cta" href="/standings">VIEW FULL STANDINGS</Link>
        </div>
      </main>
    </>
  );
}
