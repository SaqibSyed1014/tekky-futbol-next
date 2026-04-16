'use client';

import { useState } from 'react';
import Link from 'next/link';
import GlowDivider from '@/components/ui/GlowDivider';
import Modal from '@/components/ui/Modal';
import { useWeb3Form } from '@/components/ui/useWeb3Form';

const STANDINGS_ACCESS_KEY = '641836af-0dd0-4a1b-8f2d-f1d2d253c6ae';

const rows8 = Array.from({ length: 8 }, (_, i) => i + 1);

function UpdatesForm({ onSuccess }) {
  const { submitting, handleSubmit } = useWeb3Form();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  function onSubmit(e) {
    handleSubmit(
      e,
      { access_key: STANDINGS_ACCESS_KEY, botcheck: '', Type: 'League Updates', name, email },
      () => { setName(''); setEmail(''); onSuccess(); }
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} required />
      <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <button type="submit" className="cta close-overlay" disabled={submitting}>
        {submitting ? <><span className="spinner" />Submitting</> : 'Get League Updates'}
      </button>
    </form>
  );
}

export default function WomenStandingsClient() {
  const [updatesOpen, setUpdatesOpen] = useState(false);
  const [updatesSuccess, setUpdatesSuccess] = useState(false);

  const emptyRows = Array(8).fill(null);

  return (
    <>
      <header style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="hero" style={{ position: 'relative', zIndex: 2, maxWidth: 980, padding: '0 1rem' }}>
          <h1>STANDINGS</h1>
          <p className="tagline">For Ballers Who Create</p>
          <p className="subtext">Freedom in play. Order in results.</p>
        </div>
      </header>

      <main style={{ maxWidth: 1080, margin: '2.8rem auto 4rem', padding: '0 1.25rem', textAlign: 'center' }}>
        <GlowDivider />

        <div className="tabs">
          <Link className="cta" href="/standings">Men</Link>
          <Link className="cta active" href="/women/standings">Women</Link>
        </div>

        <section style={{  margin: '3rem 0' }}>
          <h2>Tekky North</h2>
          <table style={{ width: '90%', maxWidth: 900, margin: '40px auto' }}>
            <tbody>
            <tr>
              <th>Pos</th><th>Team</th><th>GP</th><th>W</th><th>L</th>
              <th>GF</th><th>GA</th><th>GD</th><th>PTS</th>
            </tr>
            {emptyRows.map((_, i) => (
                <tr key={i}><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
            ))}
            </tbody>
          </table>
        </section>

        <GlowDivider />

        <section style={{ margin: '3rem 0' }}>
          <h2>TEKKY SOUTH</h2>
          <table style={{ width: '90%', maxWidth: 900, margin: '40px auto' }}>
            <tbody>
            <tr>
              <th>Pos</th><th>Team</th><th>GP</th><th>W</th><th>L</th>
              <th>GF</th><th>GA</th><th>GD</th><th>PTS</th>
            </tr>
            {emptyRows.map((_, i) => (
                <tr key={i}><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
            ))}
            </tbody>
          </table>
        </section>

        <GlowDivider />

        <section style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2>Stay in the Loop</h2>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            Get league updates, standings changes, and match alerts straight to your inbox.
          </p>
          <div className="sec-cta">
            <button className="cta" onClick={() => setUpdatesOpen(true)}>Get League Updates</button>
          </div>
        </section>

        <GlowDivider />

        <div className="sec-cta">
          <Link className="cta" href="/women/results">View Results</Link>
          <Link className="cta" href="/women/top-scorers">Top Scorers</Link>
          <Link className="cta" href="/">Back to Home</Link>
        </div>
      </main>

      <Modal isOpen={updatesOpen && !updatesSuccess} onClose={() => setUpdatesOpen(false)}>
        <h3>Get League Updates</h3>
        <p className="subtext">Stay informed on standings, results, and league announcements.</p>
        <UpdatesForm onSuccess={() => { setUpdatesOpen(false); setUpdatesSuccess(true); }} />
      </Modal>
      <Modal isOpen={updatesSuccess} onClose={() => setUpdatesSuccess(false)}>
        <h3>You&#39;re on the list</h3>
        <p className="subtext">League updates will be sent straight to your inbox.</p>
        <button className="cta close-overlay" onClick={() => setUpdatesSuccess(false)}>Back to site</button>
      </Modal>
    </>
  );
}
