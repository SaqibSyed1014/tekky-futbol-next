'use client';

import { useState } from 'react';
import Image from 'next/image';
import GlowDivider from '@/components/ui/GlowDivider';
import Modal from '@/components/ui/Modal';
import { useWeb3Form } from '@/components/ui/useWeb3Form';

const SHOP_ACCESS_KEY = '54b3a3ce-de65-440b-8d06-001a8490c22c';

function SignupForm({ type, onSuccess }) {
  const { submitting, handleSubmit } = useWeb3Form();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  function onSubmit(e) {
    handleSubmit(
      e,
      { access_key: SHOP_ACCESS_KEY, botcheck: '', Type: type, name, email },
      () => { setName(''); setEmail(''); onSuccess(); }
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} required />
      <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <button type="submit" className="cta close-overlay" disabled={submitting}>
        {submitting ? <><span className="spinner" />Submitting</> : 'Get Early Access'}
      </button>
    </form>
  );
}

const finaleProducts = [
  { img: '/images/shop/finale-hoodie.webp', name: 'FINALE Heavyweight HOODIE', sub: 'Season 01 Finale Drop', price: '$80' },
  { img: '/images/shop/finale-trousers.webp', name: 'FINALE Heavyweight TROUSER', sub: 'Season 01 Finale Drop', price: '$60' },
  { img: '/images/shop/finale-shorts.webp', name: 'FINALE Match SHORTS', sub: 'Season 01 Finale Drop', price: '$50' },
  { img: '/images/shop/finale-shirt.webp', name: 'FINALE Match JERSEY', sub: 'Season 01 Finale Drop', price: '$90' },
];

const northProducts = [
  { img: '/images/shop/north-hoodie.webp', name: 'North Division Heavyweight Hoodie', sub: 'Season 01 North Drop', price: '$80' },
  { img: '/images/shop/north-trousers.webp', name: 'North Division Heavyweight Trouser', sub: 'Season 01 North Drop', price: '$60' },
  { img: '/images/shop/north-shorts.webp', name: 'North Division Match Shorts', sub: 'Season 01 North Drop', price: '$50' },
  { img: '/images/shop/north-shirt.webp', name: 'North Division Match Jersey', sub: 'Season 01 North Drop', price: '$90' },
];

const southProducts = [
  { img: '/images/shop/south-hoodie.webp', name: 'SOUTH Division Heavyweight Hoodie', sub: 'Season 01 South Drop', price: '$80' },
  { img: '/images/shop/south-trousers.webp', name: 'SOUTH Division Heavyweight Trouser', sub: 'Season 01 South Drop', price: '$60' },
  { img: '/images/shop/south-shorts.webp', name: 'SOUTH Division Match Shorts', sub: 'Season 01 South Drop', price: '$50' },
  { img: '/images/shop/south-shirt.webp', name: 'SOUTH Division Match Jersey', sub: 'Season 01 South Drop', price: '$90' },
];

const signatureProducts = [
  { name: 'North Division Button-Up Jersey', sub: 'Designed once. Released once.', price: '$100' },
  { name: 'South Division Button-Up Jersey', sub: 'Designed once. Released once.', price: '$100' },
  { name: 'Finale Button-Up Jersey', sub: 'Designed once. Released once.', price: '$100' },
];

export default function ShopClient() {
  const [updatesOpen, setUpdatesOpen] = useState(false);
  const [updatesSuccess, setUpdatesSuccess] = useState(false);
  const [earlyAccessOpen, setEarlyAccessOpen] = useState(false);
  const [earlyAccessSuccess, setEarlyAccessSuccess] = useState(false);
  const [signatureOpen, setSignatureOpen] = useState(false);
  const [signatureSuccess, setSignatureSuccess] = useState(false);

  return (
    <>
      <header style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="hero" style={{ position: 'relative', zIndex: 2, maxWidth: 980, padding: '0 1rem' }}>
          <h1>THE DRIP</h1>
          <p className="tagline">For Ballers Who Create</p>
          <p className="subtext">Season 01 drops built by division — limited pieces for the pitch, the street, and everything in between.</p>
        </div>
      </header>

      <main style={{ maxWidth: 1080, margin: '2.8rem auto 4rem', padding: '0 1.25rem' }}>
        <GlowDivider />

        {/* Finale */}
        <section id="finale" style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2 className="main-heading">SEASON 01 DIVISION DROPS</h2>
          <h2>FINALE COLLECTION</h2>
          <p className="subtext">Worn by those who reach the final stage. Championship energy only. Limited release.</p>
          <div className="grid">
            {finaleProducts.map((p) => (
              <div className="card" key={p.name}>
                <div className="img-placeholder real">
                  <Image src={p.img} alt={p.name} width={300} height={200} style={{ width: '100%', height: 'auto' }} />
                </div>
                <h3>{p.name}</h3>
                <span className="muted">{p.sub}</span>
                <p className="price">{p.price}</p>
                <button className="cta" onClick={() => setEarlyAccessOpen(true)}>Notify Me at Drop</button>
              </div>
            ))}
          </div>
        </section>

        <GlowDivider />

        {/* North */}
        <section id="north" style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2>NORTH DIVISION COLLECTION</h2>
          <p className="subtext">Control. Precision. Composure. Built for structured football under the lights.</p>
          <div className="grid">
            {northProducts.map((p) => (
              <div className="card" key={p.name}>
                <div className="img-placeholder real">
                  <Image src={p.img} alt={p.name} width={300} height={200} style={{ width: '100%', height: 'auto' }} />
                </div>
                <h3>{p.name}</h3>
                <span className="muted">{p.sub}</span>
                <p className="price">{p.price}</p>
                <button className="cta" onClick={() => setEarlyAccessOpen(true)}>Notify Me at Drop</button>
              </div>
            ))}
          </div>
        </section>

        <GlowDivider />

        {/* South */}
        <section id="south" style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2>SOUTH DIVISION COLLECTION</h2>
          <p className="subtext">Intensity. Rhythm. Expression. Built for players who create under pressure.</p>
          <div className="grid">
            {southProducts.map((p) => (
              <div className="card" key={p.name}>
                <div className="img-placeholder real">
                  <Image src={p.img} alt={p.name} width={300} height={200} style={{ width: '100%', height: 'auto' }} />
                </div>
                <h3>{p.name}</h3>
                <span className="muted">{p.sub}</span>
                <p className="price">{p.price}</p>
                <button className="cta" onClick={() => setEarlyAccessOpen(true)}>Notify Me at Drop</button>
              </div>
            ))}
          </div>
        </section>

        <GlowDivider />

        {/* Signature */}
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

        {/* Stay Connected */}
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

      {/* Updates modal */}
      <Modal isOpen={updatesOpen && !updatesSuccess} onClose={() => { setUpdatesOpen(false); }}>
        <h3>Access Drops Before They&#39;re Gone</h3>
        <p className="subtext">Get early access to limited TekkyFutbol drops, collabs, and special releases.</p>
        <SignupForm type="Updates on Future Drops" onSuccess={() => { setUpdatesOpen(false); setUpdatesSuccess(true); }} />
      </Modal>
      <Modal isOpen={updatesSuccess} onClose={() => setUpdatesSuccess(false)}>
        <h3>Access Secured</h3>
        <p className="subtext">You are on list for future drops and league updates. No spam. Just releases that matter.</p>
        <button className="cta close-overlay" onClick={() => setUpdatesSuccess(false)}>Back to site</button>
      </Modal>

      {/* Early access modal */}
      <Modal isOpen={earlyAccessOpen && !earlyAccessSuccess} onClose={() => setEarlyAccessOpen(false)}>
        <h3>Limited Drops</h3>
        <p className="subtext">Limited drops. No restocks. Be the first to know when TekkyFutbol merch goes live.</p>
        <SignupForm type="Season Drop" onSuccess={() => { setEarlyAccessOpen(false); setEarlyAccessSuccess(true); }} />
      </Modal>
      <Modal isOpen={earlyAccessSuccess} onClose={() => setEarlyAccessSuccess(false)}>
        <h3>Access Secured</h3>
        <p className="subtext">You are on list for future drops and league updates. No spam. Just releases that matter.</p>
        <button className="cta close-overlay" onClick={() => setEarlyAccessSuccess(false)}>Back to site</button>
      </Modal>

      {/* Signature modal */}
      <Modal isOpen={signatureOpen && !signatureSuccess} onClose={() => setSignatureOpen(false)}>
        <h3>EARLY ACCESS</h3>
        <p className="subtext">Limited drops don&#39;t get restocks.</p>
        <p className="subtext">Join the list to be notified the moment this piece goes live.</p>
        <p className="subtext">Early access is first-come, first-served.</p>
        <SignupForm type="Signature Drop" onSuccess={() => { setSignatureOpen(false); setSignatureSuccess(true); }} />
      </Modal>
      <Modal isOpen={signatureSuccess} onClose={() => setSignatureSuccess(false)}>
        <h3>YOU&#39;RE LOCKED IN</h3>
        <p className="subtext">You&#39;ll be notified the moment this drop is released. No restocks. No reruns.</p>
        <p className="subtext">Watch your inbox.</p>
        <button className="cta close-overlay" onClick={() => setSignatureSuccess(false)}>EXPLORE TEKKYFUTBOL</button>
      </Modal>
    </>
  );
}
