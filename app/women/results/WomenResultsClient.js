'use client';

import { useState } from 'react';
import Link from 'next/link';
import GlowDivider from '@/components/ui/GlowDivider';

const MATCHWEEKS = Array.from({ length: 16 }, (_, i) => ({ value: i + 1, label: `Matchweek ${i + 1}` }));
const ALL_WEEKS  = [...MATCHWEEKS, { value: 17, label: 'Season Finale' }];

export default function WomenResultsClient() {
  const [week, setWeek] = useState(1);
  const showAll = week >= 1 && week <= 16;
  const showFinal = week === 17;

  const selected = ALL_WEEKS.find((w) => w.value === week);

  return (
      <>
        <header style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div className="hero" style={{ position: 'relative', zIndex: 2, maxWidth: 980, padding: '0 1rem' }}>
            <h1>Results</h1>
            <p className="tagline">For Ballers Who Create</p>
            <p className="subtext">Weekly results, league table, and top scorers updated throughout the season.</p>
          </div>
        </header>

        <main style={{ maxWidth: 1000, margin: '3rem auto 4rem', padding: '0 1.25rem', textAlign: 'center' }}>
          <GlowDivider />

          <div className="tabs">
            <Link className="cta active" href="/results">Men</Link>
            <Link className="cta" href="/women/results">Women</Link>
          </div>

          <section id="results">
            <div className="dropdown-wrap">
              <label htmlFor="matchday" className="venue-cell">Select Matchweek</label>
              <select
                  id="matchday"
                  name="matchday"
                  value={week}
                  onChange={(e) => setWeek(Number(e.target.value))}
              >
                {ALL_WEEKS.map((w) => (
                    <option key={w.value} value={w.value}>{w.label}</option>
                ))}
              </select>
            </div>

            {showAll && (<>
              <h2>{selected?.label}</h2>

              <div className="table-wrap">
                <table>
                  <thead>
                  <tr>
                    <th>Venue</th>
                    <th>Match</th>
                    <th>Score</th>
                    <th>Week</th>
                    <th>Date</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td className="venue-cell">Tekky North</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td className="venue-cell">Tekky North</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td className="venue-cell">Tekky North</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td className="venue-cell">Tekky North</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td className="venue-cell">Tekky South</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td className="venue-cell">Tekky South</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td className="venue-cell">Tekky South</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td className="venue-cell">Tekky South</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </>)}
          </section>

          {showFinal && (
              <>
                <section>
                  <h2>Third Place</h2>
                  <div className="table-wrap">
                    <table>
                      <thead>
                      <tr><th>Venue</th><th>Match</th><th>Score</th><th>Week</th><th>Date</th></tr>
                      </thead>
                      <tbody>
                      <tr><td></td><td></td><td></td><td></td><td></td></tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                <GlowDivider />

                <section>
                  <div className="table-wrap">
                    <h2>Championship</h2>
                    <table>
                      <thead>
                      <tr><th>Venue</th><th>Match</th><th>Score</th><th>Week</th><th>Date</th></tr>
                      </thead>
                      <tbody>
                      <tr><td></td><td></td><td></td><td></td><td></td></tr>
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
          )}

          <GlowDivider />

          <div className="sec-cta">
            <Link className="cta" href="/next-fixtures">View Next Fixtures</Link>
            <Link className="cta" href="/registration">Register Your Squad</Link>
            <Link className="cta" href="/">Back to Home</Link>
          </div>
        </main>
      </>
  );
}
