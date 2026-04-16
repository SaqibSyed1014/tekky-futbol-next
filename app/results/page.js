'use client';

import { useState } from 'react';
import Link from 'next/link';
import GlowDivider from '@/components/ui/GlowDivider';

export default function ResultsPage() {
  const [selectedWeek, setSelectedWeek] = useState('Week 1');

  function weekLabel(val) {
    if (val === 'Week 1') return 'Preseason';
    return val;
  }

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
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
            >
              <option>Week 1</option>
            </select>
          </div>

          <h2>{weekLabel(selectedWeek)}</h2>

          <div className="table-wrap">
            <h2>Tekky North</h2>
            <table>
              <thead>
                <tr>
                  <th>Venue</th><th>Match</th><th>Score</th><th>Week</th><th>Date</th>
                </tr>
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
                <tr>
                  <th>Venue</th><th>Match</th><th>Score</th><th>Week</th><th>Date</th>
                </tr>
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
          <Link className="cta" href="/next-fixtures">View Next Fixtures</Link>
          <Link className="cta" href="/registration">Register Your Squad</Link>
          <Link className="cta" href="/">Back to Home</Link>
        </div>
      </main>
    </>
  );
}
