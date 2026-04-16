'use client';

import Image from 'next/image';
import { useState } from 'react';
import GlowDivider from '@/components/ui/GlowDivider';
import Modal from '@/components/ui/Modal';
import { SignupForm } from '@/components/ui/SignUpForm';

export default function SignatureDropsClient() {
  const signatureProducts = [
    { name: 'North Division Button-Up Jersey', sub: 'Designed once. Released once.', price: '$100' },
    { name: 'South Division Button-Up Jersey', sub: 'Designed once. Released once.', price: '$100' },
    { name: 'Finale Button-Up Jersey', sub: 'Designed once. Released once.', price: '$100' },
  ];

  const [signatureOpen, setSignatureOpen] = useState(false);
  const [signatureSuccess, setSignatureSuccess] = useState(false);
  const [updatesOpen, setUpdatesOpen] = useState(false);
  const [updatesSuccess, setUpdatesSuccess] = useState(false);

  return (
    <>
      <header style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="hero" style={{ position: 'relative', zIndex: 2, maxWidth: 980, padding: '0 1rem' }}>
          <h1>SIGNATURE DROPS</h1>
          <p className="tagline">For Ballers Who Create</p>
          <p className="subtext">Season 01 drops built by division — limited pieces for the pitch, the street, and everything in between.</p>
        </div>
      </header>

      <main style={{ maxWidth: 1080, margin: '2.8rem auto 4rem', padding: '0 1.25rem', textAlign: 'center' }}>
        <GlowDivider />

        <section style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2 className="main-heading">Signature Drops</h2>
          <h2>SIGNATURE COLLECTION</h2>
          <p style={{ color: '#d3d9e3', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Designed once. Released once. No restocks.</p>
          <div className="grid two-columns">
            {signatureProducts.map((p) => (
              <div className="card drop" key={p.name}>
                <div className="img-placeholder show">
                  <Image src="/images/logo.webp" alt={p.name} width={120} height={120} />
                </div>
                <h3>{p.name}</h3>
                <span className="muted">{p.sub}</span>
                <p className="price">{p.price}</p>
                <button className="cta" onClick={() => setSignatureOpen(true)}>UNLOCK EARLY ACCESS</button>
              </div>
            ))}
          </div>
        </section>

        <GlowDivider />

        <section id="subscribe" style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2>Stay Connected</h2>
          <p style={{ color: '#d3d9e3', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            Subscribe to stay in the loop — new drops, finale events, and culture updates straight from the league.
          </p>
          <div className="sec-cta">
            <button className="cta" onClick={() => setUpdatesOpen(true)}>Get updates on future drops</button>
          </div>
        </section>
      </main>

      <Modal isOpen={signatureOpen && !signatureSuccess} onClose={() => setSignatureOpen(false)}>
        <h3>EARLY ACCESS</h3>
        <p className="subtext">Limited drops don&#39;t get restocks.</p>
        <p className="subtext">Join the list to be notified the moment this piece goes live.</p>
        <p className="subtext">Early access is first-come, first-served.</p>
        <SignupForm type="Signature Drop" ctaLabel="Unlock Access" onSuccess={() => { setSignatureOpen(false); setSignatureSuccess(true); }} />
      </Modal>
      <Modal isOpen={signatureSuccess} onClose={() => setSignatureSuccess(false)}>
        <h3>YOU&#39;RE LOCKED IN</h3>
        <p className="subtext">You&#39;ll be notified the moment this drop is released. No restocks. No reruns.</p>
        <p className="subtext">Watch your inbox.</p>
        <button className="cta close-overlay" onClick={() => setSignatureSuccess(false)}>EXPLORE TEKKYFUTBOL</button>
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
