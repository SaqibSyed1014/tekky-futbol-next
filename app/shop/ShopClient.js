'use client';

import { useState } from 'react';
import Image from 'next/image';
import GlowDivider from '@/components/ui/GlowDivider';
import Modal from '@/components/ui/Modal';
import { useWeb3Form } from '@/components/ui/useWeb3Form';
import { initiateShopCheckout } from '@/services/shopApi';
import { useCheckoutCancelled } from '@/hooks/useCheckoutCancelled';
import CheckoutCancelledBanner from '@/components/ui/CheckoutCancelledBanner';

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

function ProductGrid({ products, buying, buyError, onBuy, hasImg = true }) {
  return (
    <>
      <div className="grid">
        {products.map((p) => (
          <div className="card" key={p.name}>
            <div className={`img-placeholder ${hasImg ? 'real' : 'show'}`}>
              <Image
                src={hasImg ? p.img : '/images/logo.webp'}
                alt={p.name}
                width={300}
                height={200}
                style={hasImg ? { width: '100%', height: 'auto' } : undefined}
              />
            </div>
            <h3>{p.name}</h3>
            <span className="muted">{p.sub}</span>
            <p className="price">{p.price}</p>
            <button
              className="cta"
              onClick={() => onBuy(p, hasImg ? p.img : '/images/logo.webp')}
              disabled={buying === p.name}
            >
              {buying === p.name ? 'Processing…' : 'Buy Now'}
            </button>
          </div>
        ))}
      </div>
      {buyError && (
        <p style={{ color: '#ff6b6b', marginTop: '1.25rem', fontSize: '0.9rem' }}>{buyError}</p>
      )}
    </>
  );
}

export default function ShopClient() {
  const [updatesOpen, setUpdatesOpen] = useState(false);
  const [updatesSuccess, setUpdatesSuccess] = useState(false);
  const [buying, setBuying] = useState(null);
  const [buyError, setBuyError] = useState('');
  const { cancelled, dismiss } = useCheckoutCancelled();

  async function handleBuy(product, imgPath) {
    sessionStorage.setItem('shopReturnPath', window.location.pathname);
    setBuying(product.name);
    setBuyError('');
    try {
      const data = await initiateShopCheckout({
        name: product.name,
        description: product.sub,
        image_url: `${window.location.origin}${imgPath}`,
        amount: parseFloat(product.price.replace('$', '')),
        cancel_url: `${window.location.origin}${window.location.pathname}?checkout=cancelled`,
        return_path: window.location.pathname,
      });
      window.location.href = data.checkout_url;
    } catch (err) {
      setBuying(null);
      if (!err || err.status === 0) {
        setBuyError('Network error — please check your connection and try again.');
      } else {
        setBuyError(err.message || 'Something went wrong. Please try again.');
      }
    }
  }

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

        {cancelled && <CheckoutCancelledBanner onDismiss={dismiss} />}

        <section id="finale" style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2 className="main-heading">SEASON 01 DIVISION DROPS</h2>
          <h2>FINALE COLLECTION</h2>
          <p className="subtext">Worn by those who reach the final stage. Championship energy only. Limited release.</p>
          <ProductGrid products={finaleProducts} buying={buying} buyError={buyError} onBuy={handleBuy} />
        </section>

        <GlowDivider />

        <section id="north" style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2>NORTH DIVISION COLLECTION</h2>
          <p className="subtext">Control. Precision. Composure. Built for structured football under the lights.</p>
          <ProductGrid products={northProducts} buying={buying} buyError={buyError} onBuy={handleBuy} />
        </section>

        <GlowDivider />

        <section id="south" style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2>SOUTH DIVISION COLLECTION</h2>
          <p className="subtext">Intensity. Rhythm. Expression. Built for players who create under pressure.</p>
          <ProductGrid products={southProducts} buying={buying} buyError={buyError} onBuy={handleBuy} />
        </section>

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
                <button
                  className="cta"
                  onClick={() => handleBuy(p, '/images/logo.webp')}
                  disabled={buying === p.name}
                >
                  {buying === p.name ? 'Processing…' : 'Buy Now'}
                </button>
              </div>
            ))}
          </div>
          {buyError && (
            <p style={{ color: '#ff6b6b', marginTop: '1.25rem', fontSize: '0.9rem' }}>{buyError}</p>
          )}
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

      <Modal isOpen={updatesOpen && !updatesSuccess} onClose={() => setUpdatesOpen(false)}>
        <h3>Access Drops Before They&#39;re Gone</h3>
        <p className="subtext">Get early access to limited TekkyFutbol drops, collabs, and special releases.</p>
        <SignupForm type="Updates on Future Drops" onSuccess={() => { setUpdatesOpen(false); setUpdatesSuccess(true); }} />
      </Modal>
      <Modal isOpen={updatesSuccess} onClose={() => setUpdatesSuccess(false)}>
        <h3>Access Secured</h3>
        <p className="subtext">You are on list for future drops and league updates. No spam. Just releases that matter.</p>
        <button className="cta close-overlay" onClick={() => setUpdatesSuccess(false)}>Back to site</button>
      </Modal>
    </>
  );
}
