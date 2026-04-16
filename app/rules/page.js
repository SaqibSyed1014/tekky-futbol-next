import Link from 'next/link';
import GlowDivider from '@/components/ui/GlowDivider';

export const metadata = {
  title: 'Rules — TekkyFutbol',
  description: 'Structured battles. Tactical flow. Earn every point.',
};

export default function RulesPage() {
  return (
    <>
      <header style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="hero" style={{ position: 'relative', zIndex: 2, maxWidth: 980, padding: '0 1rem' }}>
          <h1>Attrition</h1>
          <p className="tagline">For Ballers Who Create</p>
          <p className="subtext">Structured battles. Tactical flow. Earn every point.</p>
        </div>
      </header>

      <main style={{ maxWidth: 1080, margin: '2.8rem auto 4rem', padding: '0 1.25rem', textAlign: 'center' }}>
        <GlowDivider />

        <section id="overview" style={{ margin: '3rem 0' }}>
          <h2>League Overview</h2>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            8 teams per division. 16 matchweeks. Every point earned under one unified rule set.
          </p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            North and South divisions battle through the season under one unified rule set designed for speed, creativity, and flow.
          </p>
          <Link className="cta" href="/registration">Join Next Season</Link>
        </section>

        <GlowDivider />

        <section style={{ margin: '3rem 0' }}>
          <h2>DOMINION — THE PLAYOFF PHASE</h2>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            Attrition earns your position. Dominion decides the champion.
          </p>
          <ul className="">
            <li>Top 2 teams from North qualify</li>
            <li>Top 2 teams from South qualify</li>
            <li>Single-elimination bracket</li>
            <li>Concrete-based postseason</li>
            <li>Champion crowned at Championship Weekend</li>
            <li>Qualified Dominion players receive hotel accommodations for Championship Weekend</li>
          </ul>
        </section>

        <GlowDivider />

        <section id="setup" style={{ margin: '3rem 0' }}>
          <h2>Setup</h2>
          <ul className="">
            <li>Each team may register up to 10 players per season.</li>
            <li>Managers and coaches are eligible to play as well.</li>
            <li>Games are 5v5 — no goalkeepers.</li>
            <li>Game duration: 30 minutes continuous play — no halftime.</li>
            <li>Substitutions are on the fly to keep tempo high.</li>
          </ul>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            Goals are small, knee-height nets, rewarding precision, control, and composure over power.
          </p>
          <div className="sec-cta">
            <Link className="cta" href="/registration">Register Your Team</Link>
          </div>
        </section>

        <GlowDivider />

        <section id="attendance" style={{ textAlign: 'left', maxWidth: '70ch', margin: '3rem auto' }}>
          <h2 style={{ textAlign: 'center' }}>ATTENDANCE & FORFEITS</h2>
          <p style={{ textAlign: 'center', margin: '0.6rem auto', lineHeight: 1.8 }}>
            Ready-to-play counts only. A player counts only if they are checked in and on the field by kickoff.
          </p>
          <p style={{ lineHeight: 1.8 }}>Missing-player handicap (kickoff only):</p>
          <ul className="bullet-list">
            <li>For each missing player at kickoff, the opponent is awarded +1 goal.</li>
            <li>For each goal awarded due to missing players, the opponent must also play down one player (sit one) to keep the game balanced.</li>
          </ul>
          <p style={{ lineHeight: 1.8 }}>Forfeit threshold:</p>
          <ul className="bullet-list">
            <li>If a team is missing more than 3 players at kickoff, it is an automatic forfeit.</li>
          </ul>
          <p style={{ lineHeight: 1.8 }}>Standings impact (forfeits):</p>
          <ul className="bullet-list">
            <li>Opponent receives 3 points and a 3–0 win recorded (+3 GD).</li>
            <li>Forfeiting team receives 0 points, a 0–3 loss recorded (−3 GD), plus a 1-point deduction.</li>
          </ul>
          <p style={{ lineHeight: 1.8 }}>Still play if you want:</p>
          <ul className="bullet-list">
            <li>If a forfeit occurs, teams may still scrimmage / practice for fun (does not affect standings).</li>
          </ul>
          <p style={{ lineHeight: 1.8 }}>ODD NUMBER OF TEAMS (BYE WEEK)</p>
          <ul className="bullet-list">
            <li>If there is an odd number of teams in the regular season, one team will have a bye each matchweek.</li>
            <li>Byes rotate in order from last place → first place, repeating as needed to keep it fair over the season.</li>
          </ul>
        </section>

        <GlowDivider />

        <section id="scoring" style={{ margin: '3rem 0' }}>
          <h2>Scoring System</h2>
          <ul className="">
            <li>Win = 3 points</li>
            <li>Tie = 0 points</li>
            <li>Loss = 0 points</li>
            <li>Matches must be won outright to count — no shared results.</li>
          </ul>
          <div className="sec-cta">
            <Link className="cta" href="/season-finale">See Finale Details</Link>
          </div>
        </section>

        <GlowDivider />

        <section id="gameplay" style={{ margin: '3rem 0' }}>
          <h2>Gameplay Flow</h2>
          <ul className="">
            <li>5v5 format — no goalkeepers.</li>
            <li>Small-sided matches prioritize skill, vision, and composure.</li>
            <li>After each goal or skillful nutmeg dribble (a clean nutmeg that counts as a goal), the scorer rotates out — keeping flow and creativity constant.</li>
            <li>If a defender touches their own goal while defending, they receive a yellow card and the opponent gets an open shot from 12 steps.</li>
            <li>Slide tackles only allowed on turf</li>
          </ul>
          <div className="sec-cta">
            <Link className="cta" href="/about">Learn Our Inspiration</Link>
          </div>
        </section>

        <GlowDivider />

        <section id="discipline" style={{ margin: '3rem 0' }}>
          <h2>Discipline & Respect</h2>
          <ul className="">
            <li>Yellow card = warning.</li>
            <li>Red card = ejection + 1-game suspension.</li>
            <li>Covering and touching the goal results in a yellow card and penalty for 12 steps.</li>
            <li>Pushing or forcing a defender into the goal counts as aggressive conduct and results in a yellow card.</li>
            <li>Reckless or disrespectful behavior may result in suspension or league removal.</li>
          </ul>
          <div className="sec-cta">
            <Link className="cta" href="/registration">Play With Respect — Register</Link>
          </div>
        </section>

        <GlowDivider />

        <div className="sec-cta">
          <Link className="cta" href="/registration">Register Now</Link>
          <Link className="cta" href="/">Back to Home</Link>
        </div>
      </main>
    </>
  );
}
