'use client';

import { useState } from 'react';
import Link from 'next/link';
import GlowDivider from '@/components/ui/GlowDivider';
import Modal from '@/components/ui/Modal';
import { useWeb3Form } from '@/components/ui/useWeb3Form';

function UpdatesForm({ onSuccess }) {
  const { submitting, handleSubmit } = useWeb3Form();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  function onSubmit(e) {
    handleSubmit(
      e,
      { access_key: '641836af-0dd0-4a1b-8f2d-f1d2d253c6ae', botcheck: '', name, email },
      () => { setName(''); setEmail(''); onSuccess(); }
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} required />
      <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <button type="submit" className="cta close-overlay" disabled={submitting}>
        {submitting ? <><span className="spinner" />Submitting</> : 'Get Updates'}
      </button>
    </form>
  );
}

const emptyRows = Array(8).fill(null);

export default function StandingsPage() {
  const [updatesOpen, setUpdatesOpen] = useState(false);
  const [updatesSuccess, setUpdatesSuccess] = useState(false);

  return (
    <>
      <header style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="hero" style={{ padding: '0 1rem', textAlign: 'center' }}>
          <h1>STANDINGS</h1>
          <p className="tagline">For Ballers Who Create</p>
          <p className="subtext">Freedom in play. Order in results.</p>
        </div>
      </header>

      <main style={{ maxWidth: 1080, margin: '2.8rem auto 4rem', padding: '0 1.25rem', textAlign: 'center' }}>
        <GlowDivider />

        <div className="tabs">
          <Link className="cta active" href="/standings">Men</Link>
          <Link className="cta" href="/women/standings">Women</Link>
        </div>

        <div className="table-wrap">
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
        </div>

        <GlowDivider />

        <div className="table-wrap">
          <h2>Tekky South</h2>
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
        </div>

        <div className="sec-cta" style={{ marginBottom: '4rem' }}>
          <Link className="cta" href="/registration">Register for the Next Season</Link>
          <button className="cta" onClick={() => setUpdatesOpen(true)}>Get League Updates</button>
        </div>
      </main>

      <Modal isOpen={updatesOpen && !updatesSuccess} onClose={() => { setUpdatesOpen(false); setUpdatesSuccess(false); }}>
        <h3>Stay in the Game</h3>
        <p className="subtext">Get league updates, fixtures, drops, and announcements — straight to your inbox.</p>
        <UpdatesForm onSuccess={() => { setUpdatesOpen(false); setUpdatesSuccess(true); }} />
      </Modal>

      <Modal isOpen={updatesSuccess} onClose={() => setUpdatesSuccess(false)}>
        <h3>Added to the list</h3>
        <p className="subtext">You&#39;ll be notified first.</p>
        <button className="cta close-overlay" onClick={() => setUpdatesSuccess(false)}>Explore the League</button>
      </Modal>
    </>
  );
}
