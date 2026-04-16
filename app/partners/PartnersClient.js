'use client';

import { useState } from 'react';
import Link from 'next/link';
import GlowDivider from '@/components/ui/GlowDivider';
import Modal from '@/components/ui/Modal';
import { useWeb3Form } from '@/components/ui/useWeb3Form';

const DECK_ACCESS_KEY = '5dedb523-b639-4f31-a1af-d6a6ba4a817e';

function RequestDeckForm({ onSuccess }) {
  const { submitting, handleSubmit } = useWeb3Form();
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [interest, setInterest] = useState('');

  function onSubmit(e) {
    handleSubmit(
      e,
      { access_key: DECK_ACCESS_KEY, botcheck: '', name, company, email, phone, website, sponsorshipInterest: interest },
      () => { setName(''); setCompany(''); setEmail(''); setPhone(''); setWebsite(''); setInterest(''); onSuccess(); }
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} required />
      <input type="text" placeholder="Enter your company/organization name" value={company} onChange={(e) => setCompany(e.target.value)} required />
      <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="tel" placeholder="Enter your phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <input type="text" placeholder="Enter your website/instagram" value={website} onChange={(e) => setWebsite(e.target.value)} required />
      <select value={interest} onChange={(e) => setInterest(e.target.value)} required>
        <option value="" disabled hidden>Select type of partnership are you interested in</option>
        <option>Brand collaboration</option>
        <option>Event activation</option>
        <option>Kit or merchandise collaboration</option>
        <option>Content / media partnership</option>
        <option>Venue partnership</option>
        <option>Other</option>
      </select>
      <button type="submit" className="cta close-overlay" disabled={submitting}>
        {submitting ? <><span className="spinner" />Submitting</> : 'Request deck'}
      </button>
    </form>
  );
}

export default function PartnersClient() {
  const [deckOpen, setDeckOpen] = useState(false);
  const [deckSuccess, setDeckSuccess] = useState(false);

  return (
    <>
      <header style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="hero" style={{ position: 'relative', zIndex: 2, maxWidth: 980, padding: '0 1rem' }}>
          <h1>PARTNER WITH TEKKYFUTBOL</h1>
          <p className="tagline">For Ballers Who Create</p>
          <p className="subtext">TekkyFutbol collaborates with forward-thinking brands, venues, and creators to build culture-driven football experiences. From limited-run kits to live events and digital storytelling, we partner with those aligned with creativity, ambition, and authenticity.</p>
        </div>
      </header>

      <main className="tight-list-content" style={{ maxWidth: 1080, margin: '2.8rem auto 4rem', padding: '0 1.25rem' }}>
        <GlowDivider />

        <section id="vision" style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2>Vision</h2>
          <p style={{ color: '#d3d9e3', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            We elevate football culture through authenticity — connecting brand partners with the next wave of creators, players, and street-level energy. Every partnership is built on shared ambition and long-term impact.
          </p>
          <div className="sec-cta">
            <button className="cta" onClick={() => setDeckOpen(true)}>Request the Partnership Deck</button>
          </div>
        </section>

        <GlowDivider />

        <section id="opportunities" style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2>Opportunities</h2>
          <ul className="bullet-list centered">
            <li>Seasonal events &amp; live activations</li>
            <li>Branded kits &amp; limited-run collaborations</li>
            <li>Digital content &amp; cultural storytelling</li>
          </ul>
          <div className="sec-cta">
            <Link className="cta" href="/partnership-inquiry">Partnership Inquiry</Link>
          </div>
        </section>

        <GlowDivider />

        <section id="reach" style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2>Our Reach</h2>
          <p style={{ color: '#d3d9e3', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            Our digital footprint stretches from the pitch to the street — connecting players, fans, and culture through social media, live events, and creator-driven collaborations.
          </p>
        </section>

        <GlowDivider />

        <section id="connect" style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2>Let&#39;s Connect</h2>
          <p style={{ color: '#d3d9e3', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            We&#39;re ready to collaborate. Reach out and let&#39;s create impact together.
          </p>
          <div className="sec-cta">
            <a className="cta" href="mailto:contact@tekkyfutbol.net">Contact Us</a>
            <Link className="cta" href="/registration">Join the League</Link>
          </div>
        </section>
      </main>

      <Modal isOpen={deckOpen && !deckSuccess} onClose={() => setDeckOpen(false)}>
        <h3>Request partnership deck</h3>
        <p className="subtext">Get an overview of how TekkyFutbol collaborates with brands, venues, and creators through culture-driven football experiences.</p>
        <RequestDeckForm onSuccess={() => { setDeckOpen(false); setDeckSuccess(true); }} />
      </Modal>
      <Modal isOpen={deckSuccess} onClose={() => setDeckSuccess(false)}>
        <h3>Request received</h3>
        <p className="subtext">Thanks for reaching out. We&#39;ll review your request and send the partnership deck shortly if there&#39;s a fit. For aligned partners, we follow up with next steps and collaboration options.</p>
        <button className="cta close-overlay" onClick={() => setDeckSuccess(false)}>Explore TekkyFutbol</button>
      </Modal>
    </>
  );
}
