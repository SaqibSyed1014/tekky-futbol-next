import Link from 'next/link';
import GlowDivider from '@/components/ui/GlowDivider';

export const metadata = {
  title: 'TekkyFutbol — Dominion Rules',
  description: 'Dominion phase rules.',
};

export default function Page() {
  return (
    <>
      <header style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="hero" style={{ position: 'relative', zIndex: 2, maxWidth: 980, padding: '0 1rem' }}>
          <h1>Dominion</h1>
          <p className="tagline">For Ballers Who Create</p>
          <p className="subtext">
            The Playoff Phase. Top 2 from each division advance. Concrete decides everything.
          </p>
        </div>
      </header>

      <main className="spaced-content" style={{maxWidth: 1080, margin: '2.8rem auto 4rem', padding: '0 1.25rem'}}>
        <GlowDivider/>

        <section style={{margin: '3rem 0', textAlign: 'center'}}>
          <h2>DOMINION — THE PLAYOFF PHASE</h2>
          <ul>
            <li>Top 2 teams from each division qualify</li>
            <li>Single-elimination format</li>
            <li>Concrete-based postseason</li>
            <li>Neutral final venue</li>
            <li>Champion crowned at the Finale Ceremony</li>
          </ul>
          <p>This is where preparation is tested.</p>
          <p>This is where margins disappear.</p>
        </section>

        <GlowDivider/>

        <section style={{margin: '3rem 0', textAlign: 'center'}}>
          <h2>Setup</h2>
          <ul>
            <li>Each team may register up to 10 players per season.</li>
            <li>Managers and coaches are eligible to play as well.</li>
            <li>Games are 5v5 — no goalkeepers.</li>
            <li>Game duration: 30 minutes continuous play — no halftime.</li>
            <li>Substitutions are on the fly to keep tempo high.</li>
          </ul>
          <p>Goals are small, knee-height nets, rewarding precision, control, and composure over power.</p>
          <div className="sec-cta">
            <a className="cta" href="registration.html">Register Your Team</a>
          </div>
        </section>

        <GlowDivider/>

        <section style={{margin: '3rem 0', textAlign: 'center'}}>
          <h2>ATTENDANCE & FORFEITS</h2>
          <p>Ready-to-Play Standard:</p>
          <ul className="bullet-list">
            <li>A player counts only if they are checked in and on the field at kickoff.</li>
            <li>Late players may enter upon arrival but do not reverse any goals awarded due to absence.</li>
          </ul>
          <p>Missing-Player Penalty (Kickoff Only):</p>
          <ul className="bullet-list">
            <li>Dominion rewards preparation.</li>
            <li>For each missing rostered player at kickoff, the opponent is awarded +5 goals.</li>
            <li>Substitutes and coaches do not count toward the starting player requirement.</li>
            <li>Goals awarded due to absence are recorded immediately and count toward the official match result.</li>
            <li>No minimum amount of players.</li>
          </ul>
        </section>

        <GlowDivider/>

        <section style={{margin: '3rem 0', textAlign: 'center'}}>
          <h2>ADVANCEMENT FORMAT</h2>
          <p>Win and advance</p>
          <p>Lose and season ends</p>
          <p>No draws.</p>
          <p>If tied at full time:</p>
          <ul className="bullet-list small-list">
            <li>Full-court penalty shootout</li>
            <li>Best of 3 attempts per team</li>
            <li>Sudden death if tied after 3</li>
          </ul>
        </section>

        <GlowDivider/>

        <section style={{margin: '3rem 0', textAlign: 'center'}}>
          <h2>Gameplay Flow</h2>
          <ul>
            <li>Each successful skill move during a possession adds +1 impact goals.</li>
            <li>A clean nutmeg dribble adds +2 impact goals.</li>
            <li>If that possession results in a goal (including an own goal forced by attacking pressure), the total
              impact goals. is added to the scoring team’s goal count.
            </li>
            <li>After the goal is recorded, both teams’ impact goals. reset to zero.</li>
            <li>If a defender touches their own goal while defending, they receive a yellow card and the opponent gets
              an open shot from 12 steps.
            </li>
            <li>Slide tackles only allowed on turf</li>
          </ul>
          <div className="sec-cta">
            <a className="cta" href="About.html">Learn Our Inspiration</a>
          </div>
        </section>

        <GlowDivider/>

        <section style={{margin: '3rem 0', textAlign: 'center'}}>
          <h2>Discipline & Respect</h2>
          <ul>
            <li>Yellow card = warning.</li>
            <li>Red card = ejection + 1-game suspension.</li>
            <li>Covering and touching the goal results in a yellow card and penalty from 12 steps.</li>
            <li>Pushing or forcing a defender into the goal counts as aggressive conduct and results in a yellow card.
            </li>
            <li>Reckless or disrespectful behavior may result in suspension or league removal.</li>
          </ul>
          <div className="sec-cta">
            <a className="cta" href="registration.html">Play With Respect — Register</a>
          </div>
        </section>

        <GlowDivider/>

        <section style={{margin: '3rem 0', textAlign: 'center'}}>
          <h2>PLAYOFF STANDARD</h2>
          <ul>
            <li>All playoff-qualified players receive a hotel room for Championship Weekend</li>
            <li>Neutral city location</li>
            <li>Ceremony + Celebration included</li>
          </ul>
        </section>

        <GlowDivider/>

        <section>
          <div className="sec-cta">
            <a className="cta un-focused" href="#top">Back to Top</a>
            <a className="cta" href="registration.html">Register Now</a>
          </div>
        </section>
      </main>
    </>
  );
}
