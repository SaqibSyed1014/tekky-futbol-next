'use client';

import { useState } from 'react';
import GlowDivider from '@/components/ui/GlowDivider';
import Modal from '@/components/ui/Modal';
import { useWeb3Form } from '@/components/ui/useWeb3Form';
import Link from 'next/link';

const NEWSLETTER_KEY = '641836af-0dd0-4a1b-8f2d-f1d2d253c6ae';

function NewsletterForm({ onSuccess }) {
  const { submitting, handleSubmit } = useWeb3Form();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  function onSubmit(e) {
    handleSubmit(
      e,
      { access_key: NEWSLETTER_KEY, botcheck: '', Type: 'Newsletter Signup', name, email },
      () => { setName(''); setEmail(''); onSuccess(); }
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} required />
      <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <button type="submit" className="cta close-overlay" disabled={submitting}>
        {submitting ? <><span className="spinner" />Submitting</> : 'Subscribe'}
      </button>
    </form>
  );
}

export default function NewsletterPage() {
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  return (
    <>
      <header style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="hero" style={{ position: 'relative', zIndex: 2, maxWidth: 980, padding: '0 1rem' }}>
          <h1>NEWSLETTER</h1>
          <p className="tagline">For Ballers Who Create</p>
          <p className="subtext">Stay in the loop. League updates, match recaps, and culture drops — straight to your inbox.</p>
        </div>
      </header>

      <main style={{ maxWidth: 680, margin: '2.8rem auto 4rem', padding: '0 1.25rem', textAlign: 'center' }}>
        <GlowDivider />

        <section style={{ margin: '3rem 0' }}>
          <h2>JOIN THE INNER CIRCLE</h2>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            TekkyFutbol updates delivered directly to your inbox. No spam. Just results, drops, and culture worth following.
          </p>
          <ul className="bullet-list" style={{ textAlign: 'left', display: 'inline-block' }}>
            <li>Weekly match results and standings</li>
            <li>Early access to shop drops</li>
            <li>Finale event announcements</li>
            <li>League news and player spotlights</li>
          </ul>
          <div className="sec-cta" style={{ marginTop: '2rem' }}>
            <button className="cta" onClick={() => setOpen(true)}>Subscribe Now</button>
          </div>
        </section>

        <GlowDivider />

        <div className="sec-cta">
          <Link className="cta" href="/shop">View the Shop</Link>
          <Link className="cta" href="/">Back to Home</Link>
        </div>
      </main>

      <Modal isOpen={open && !success} onClose={() => setOpen(false)}>
        <h3>Subscribe to the Newsletter</h3>
        <p className="subtext">League updates, results, drops, and culture — delivered to your inbox.</p>
        <NewsletterForm onSuccess={() => { setOpen(false); setSuccess(true); }} />
      </Modal>
      <Modal isOpen={success} onClose={() => setSuccess(false)}>
        <h3>You&#39;re Subscribed</h3>
        <p className="subtext">Welcome to the TekkyFutbol inner circle. Watch your inbox.</p>
        <button className="cta close-overlay" onClick={() => setSuccess(false)}>Back to site</button>
      </Modal>
    </>
  );
}
