'use client';

import { useState } from 'react';
import Link from 'next/link';
import GlowDivider from '@/components/ui/GlowDivider';
import Modal from '@/components/ui/Modal';
import { useWeb3Form } from '@/components/ui/useWeb3Form';

const ACCESS_KEY = 'da42e6f9';

function NotifyForm({ onSuccess }) {
  const { submitting, handleSubmit } = useWeb3Form();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  function onSubmit(e) {
    handleSubmit(
      e,
      { access_key: ACCESS_KEY, botcheck: '', Type: 'Season Pass Ticket', name, email },
      () => { setName(''); setEmail(''); onSuccess(); }
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
      <input type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <button type="submit" className="cta close-overlay" disabled={submitting}>
        {submitting ? <><span className="spinner" />Submitting</> : 'Notify Me'}
      </button>
    </form>
  );
}

export default function SeasonPassCheckoutPage() {
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  return (
    <>
      <header style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="hero" style={{ position: 'relative', zIndex: 2, maxWidth: 980, padding: '0 1rem' }}>
          <h1>SEASON PASS</h1>
          <p className="tagline">For Ballers Who Create</p>
          <p className="subtext">All season. All matches. One pass. $80.</p>
        </div>
      </header>

      <main style={{ maxWidth: 600, margin: '2.8rem auto 4rem', padding: '0 1.25rem', textAlign: 'center' }}>
        <GlowDivider />

        <section style={{ margin: '3rem 0' }}>
          <h2>SEASON PASS</h2>
          <p className="price" style={{ fontSize: '2rem', margin: '1rem 0' }}>$80</p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            Full season access. Every regular season match. One purchase covers it all.
          </p>
          <ul className="bullet-list" style={{ textAlign: 'left', display: 'inline-block' }}>
            <li>Access to all regular season matches</li>
            <li>General admission seating</li>
            <li>Best value for the dedicated supporter</li>
            <li>Does not include playoff or finale tickets</li>
          </ul>
          <div className="sec-cta" style={{ marginTop: '2rem' }}>
            <button className="cta" onClick={() => setOpen(true)}>Get Notified at Launch</button>
          </div>
        </section>

        <GlowDivider />

        <div className="sec-cta">
          <Link className="cta" href="/tickets">All Tickets</Link>
          <Link className="cta" href="/">Back to Home</Link>
        </div>
      </main>

      <Modal isOpen={open && !success} onClose={() => setOpen(false)}>
        <h3>Season Pass</h3>
        <p className="subtext">Tickets aren&#39;t live yet. Drop your info and we&#39;ll notify you the moment they go on sale.</p>
        <NotifyForm onSuccess={() => { setOpen(false); setSuccess(true); }} />
      </Modal>
      <Modal isOpen={success} onClose={() => setSuccess(false)}>
        <h3>You&#39;re on the list</h3>
        <p className="subtext">We&#39;ll notify you when season passes go live.</p>
        <button className="cta close-overlay" onClick={() => setSuccess(false)}>Back to site</button>
      </Modal>
    </>
  );
}
