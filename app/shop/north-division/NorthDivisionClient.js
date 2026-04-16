'use client';

import Image from 'next/image';
import { useState } from 'react';
import GlowDivider from '@/components/ui/GlowDivider';
import Modal from '@/components/ui/Modal';
import { SignupForm } from '@/components/ui/SignUpForm';

const northProducts = [
  { img: '/images/shop/north-hoodie.webp', name: 'North Division Heavyweight Hoodie', sub: 'Season 01 North Drop', price: '$80' },
  { img: '/images/shop/north-trousers.webp', name: 'North Division Heavyweight Trouser', sub: 'Season 01 North Drop', price: '$60' },
  { img: '/images/shop/north-shorts.webp', name: 'North Division Match Shorts', sub: 'Season 01 North Drop', price: '$50' },
  { img: '/images/shop/north-shirt.webp', name: 'North Division Match Jersey', sub: 'Season 01 North Drop', price: '$90' },
];

export default function NorthDivisionClient() {
  const [earlyAccessOpen, setEarlyAccessOpen] = useState(false);
  const [earlyAccessSuccess, setEarlyAccessSuccess] = useState(false);
  const [updatesOpen, setUpdatesOpen] = useState(false);
  const [updatesSuccess, setUpdatesSuccess] = useState(false);

  return (
    <>
      <header style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="hero" style={{ position: 'relative', zIndex: 2, maxWidth: 980, padding: '0 1rem' }}>
          <h1>North Division Drops</h1>
          <p className="tagline">For Ballers Who Create</p>
          <p className="subtext">
              Season 01 drops built by division — limited pieces for the pitch, the street, and everything in between.
          </p>
        </div>
      </header>

      <main style={{ maxWidth: 1080, margin: '2.8rem auto 4rem', padding: '0 1.25rem', textAlign: 'center' }}>
        <GlowDivider />

          <section style={{margin: '3rem 0', textAlign: 'center'}}>
              <h2>NORTH DIVISION COLLECTION</h2>
              <p className="subtext">Control. Precision. Composure. Built for structured football under the lights.</p>

              <div className="grid">
                  {northProducts.map((p) => (
                      <div className="card" key={p.name}>
                          <div className="img-placeholder real">
                              <Image src={p.img} alt={p.name} width={300} height={200}
                                     style={{width: '100%', height: 'auto'}}/>
                          </div>
                          <h3>{p.name}</h3>
                          <span className="muted">{p.sub}</span>
                          <p className="price">{p.price}</p>
                          <button className="cta" onClick={() => setEarlyAccessOpen(true)}>Notify Me at Drop</button>
                      </div>
                  ))}
              </div>
          </section>

          <GlowDivider/>

          <section id="subscribe" style={{margin: '3rem 0', textAlign: 'center'}}>
          <h2>Stay Connected</h2>
          <p style={{ color: '#d3d9e3', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            Subscribe to stay in the loop — new drops, finale events, and culture updates straight from the league.
          </p>
          <div className="sec-cta">
            <button className="cta" onClick={() => setUpdatesOpen(true)}>Get updates on future drops</button>
          </div>
        </section>
      </main>

      <Modal isOpen={earlyAccessOpen && !earlyAccessSuccess} onClose={() => setEarlyAccessOpen(false)}>
        <h3>Limited Drops</h3>
        <p className="subtext">Limited drops. No restocks. Be the first to know when TekkyFutbol merch goes live.</p>
        <SignupForm type="Season Drop" ctaLabel="Unlock Access" onSuccess={() => { setEarlyAccessOpen(false); setEarlyAccessSuccess(true); }} />
      </Modal>
      <Modal isOpen={earlyAccessSuccess} onClose={() => setEarlyAccessSuccess(false)}>
        <h3>Access Secured</h3>
        <p className="subtext">You are on list for future drops and league updates. No spam. Just releases that matter.</p>
        <button className="cta close-overlay" onClick={() => setEarlyAccessSuccess(false)}>Back to site</button>
      </Modal>

      <Modal isOpen={updatesOpen && !updatesSuccess} onClose={() => setUpdatesOpen(false)}>
        <h3>Access Drops Before They&#39;re Gone</h3>
        <p className="subtext">Get early access to limited TekkyFutbol drops, collabs, and special releases.</p>
        <SignupForm type="Updates on Future Drops" ctaLabel="Get Early Access" onSuccess={() => { setUpdatesOpen(false); setUpdatesSuccess(true); }} />
      </Modal>
      <Modal isOpen={updatesSuccess} onClose={() => setUpdatesSuccess(false)}>
        <h3>Access Secured</h3>
        <p className="subtext">You are on list for future drops and league updates. No spam. Just releases that matter.</p>
        <button className="cta close-overlay" onClick={() => setUpdatesSuccess(false)}>Back to site</button>
      </Modal>
    </>
  );
}
