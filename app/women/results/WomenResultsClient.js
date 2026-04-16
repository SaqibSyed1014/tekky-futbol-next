'use client';

import { useState } from 'react';
import Link from 'next/link';
import GlowDivider from '@/components/ui/GlowDivider';

const weeks = [{ value: 1, label: 'Week 1' }];

export default function WomenResultsClient() {
  const [selectedWeek, setSelectedWeek] = useState('Week 1');

  function weekLabel(val) {
    if (val === 'Week 1') return 'Preseason';
    return val;
  }

  return (
    <>
      <header style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="hero" style={{ position: 'relative', zIndex: 2, maxWidth: 980, padding: '0 1rem' }}>
          <h1>RESULTS</h1>
          <p className="tagline">For Ballers Who Create</p>
          <p className="subtext">Weekly results, league table, and top scorers updated throughout the season.</p>
        </div>
      </header>

      <main style={{ maxWidth: 1000, margin: '2.8rem auto 4rem', padding: '0 1.25rem', textAlign: 'center' }}>
        <GlowDivider />

        <div className="tabs">
          <Link className="cta" href="/results">Men</Link>
          <Link className="cta active" href="/women/results">Women</Link>
        </div>

        <section>
          <div className="dropdown-wrap">
            <label htmlFor="matchday" className="venue-cell">Select Matchweek</label>
            <select
                id="matchday"
                name="matchday"
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
            >
              <option>Week 1</option>
            </select>
          </div>
          <h2>{weekLabel(selectedWeek)}</h2>
        </section>

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
          <h2>Tekky South</h2>
          <div className="table-wrap">
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

        <GlowDivider />

        <div className="sec-cta">
          <Link className="cta" href="/women/standings">View Standings</Link>
          <Link className="cta" href="/women/next-fixtures">Next Fixtures</Link>
          <Link className="cta" href="/">Back to Home</Link>
        </div>
      </main>
    </>
  );
}
