'use client';

import { useState } from 'react';
import Link from 'next/link';
import GlowDivider from '@/components/ui/GlowDivider';

const weeks = Array.from({ length: 18 }, (_, i) => i + 1);

export default function WomenNextFixturesPage() {
  const [week, setWeek] = useState(1);

  const weekLabel = week === 17 ? '17 (semis)' : String(week);
  const showAll = week >= 1 && week <= 16;
  const showSemis = week === 17;
  const showFinal = week === 18;

  return (
    <>
      <header style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="hero" style={{ position: 'relative', zIndex: 2, maxWidth: 980, padding: '0 1rem' }}>
          <h1>NEXT FIXTURES</h1>
          <p className="tagline">For Ballers Who Create</p>
          <p className="subtext">See what&#39;s coming up next week across Tekky North and South.</p>
        </div>
      </header>

      <main style={{ maxWidth: 1000, margin: '3rem auto 4rem', padding: '0 1.25rem', textAlign: 'center' }}>
        <GlowDivider />

        <div className="tabs">
          <Link className="cta" href="/next-fixtures">Men</Link>
          <Link className="cta active" href="/women/next-fixtures">Women</Link>
        </div>

        <section>
          <div className="dropdown-wrap">
            <label htmlFor="matchday" className="venue-cell">Select Matchweek</label>
            <select
              id="matchday"
              name="matchday"
              value={week}
              onChange={(e) => setWeek(Number(e.target.value))}
            >
              {weeks.map((w) => (
                <option key={w} value={w}>Week {w}</option>
              ))}
            </select>
          </div>
          <h2>Matchweek {weekLabel}</h2>
        </section>

        {showAll && (
          <>
            <section>
              <h2>Tekky North</h2>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>Venue</th><th>Match</th><th>Score</th><th>Week</th><th>Date</th></tr>
                  </thead>
                  <tbody>
                    <tr><td className="venue-cell">Tekky North</td><td></td><td></td><td></td><td></td></tr>
                    <tr><td className="venue-cell">Tekky North</td><td></td><td></td><td></td><td></td></tr>
                    <tr><td className="venue-cell">Tekky North</td><td></td><td></td><td></td><td></td></tr>
                    <tr><td className="venue-cell">Tekky North</td><td></td><td></td><td></td><td></td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            <GlowDivider />

            <section>
              <div className="table-wrap">
                <h2>Tekky South</h2>
                <table>
                  <thead>
                    <tr><th>Venue</th><th>Match</th><th>Score</th><th>Week</th><th>Date</th></tr>
                  </thead>
                  <tbody>
                    <tr><td className="venue-cell">Tekky South</td><td></td><td></td><td></td><td></td></tr>
                    <tr><td className="venue-cell">Tekky South</td><td></td><td></td><td></td><td></td></tr>
                    <tr><td className="venue-cell">Tekky South</td><td></td><td></td><td></td><td></td></tr>
                    <tr><td className="venue-cell">Tekky South</td><td></td><td></td><td></td><td></td></tr>
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {showSemis && (
          <section>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Venue</th><th>Match</th><th>Score</th><th>Week</th><th>Date</th></tr>
                </thead>
                <tbody>
                  <tr><td className="venue-cell">Tekky North</td><td></td><td></td><td></td><td></td></tr>
                  <tr><td className="venue-cell">Tekky South</td><td></td><td></td><td></td><td></td></tr>
                </tbody>
              </table>
            </div>
          </section>
        )}

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
                    <tr><td className="venue-cell">Tekky North</td><td></td><td></td><td></td><td></td></tr>
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
                    <tr><td className="venue-cell">Tekky South</td><td></td><td></td><td></td><td></td></tr>
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        <GlowDivider />

        <div className="sec-cta">
          <Link className="cta" href="/women/results">View Results</Link>
          <Link className="cta" href="/registration">Register Your Squad</Link>
          <Link className="cta" href="/">Back to Home</Link>
        </div>
      </main>
    </>
  );
}
