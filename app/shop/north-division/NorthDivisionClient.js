'use client';

import { useState } from 'react';
import GlowDivider from '@/components/ui/GlowDivider';
import Modal from '@/components/ui/Modal';
import { SignupForm } from '@/components/ui/SignUpForm';
import DivisionProductCard from '@/components/shop/DivisionProductCard';
import { useCheckoutCancelled } from '@/hooks/useCheckoutCancelled';
import CheckoutCancelledBanner from '@/components/ui/CheckoutCancelledBanner';

const northProducts = [
  { productType: 'Hoodie', name: 'PITCH SIDE HOODIE', sub: 'Season 01 North Drop', price: '$80' },
  { productType: 'Pant', name: 'PITCH WARM-UP TROUSER', sub: 'Season 01 North Drop', price: '$60' },
  { productType: 'Short', name: 'S01 MATCH SHORTS', sub: 'Season 01 North Drop', price: '$50' },
  { productType: 'Tshirt', name: 'S01 MATCH JERSEY', sub: 'Season 01 North Drop', price: '$90' },
];

export default function NorthDivisionClient() {
  const [earlyAccessOpen, setEarlyAccessOpen] = useState(false);
  const [earlyAccessSuccess, setEarlyAccessSuccess] = useState(false);
  const [updatesOpen, setUpdatesOpen] = useState(false);
  const [updatesSuccess, setUpdatesSuccess] = useState(false);
  const { cancelled, dismiss } = useCheckoutCancelled();

  return (
    <>
      <header style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="hero" style={{ position: 'relative', zIndex: 2, maxWidth: 980, padding: '0 1rem' }}>
          <h1>NORTH DIVISION PERFORMANCE</h1>
          <p className="tagline">For Ballers Who Create</p>
          <p className="subtext">
              Official North Division match kits and technical activewear built for high-speed performance under the lights.
          </p>
        </div>
      </header>

      <main style={{ maxWidth: 1080, margin: '2.8rem auto 4rem', padding: '0 1.25rem', textAlign: 'center' }}>
        <GlowDivider />

        {cancelled && <CheckoutCancelledBanner onDismiss={dismiss} />}

          <section style={{margin: '3rem 0', textAlign: 'center'}}>
              <div className="grid shop-grid">
                  {northProducts.map((p) => (
                      <DivisionProductCard
                        key={p.name}
                        division="north"
                        productType={p.productType}
                        name={p.name}
                        sub={p.sub}
                        price={p.price}
                      />
                  ))}
              </div>
          </section>

          <GlowDivider/>

          <section id="subscribe" style={{margin: '3rem 0', textAlign: 'center'}}>
          <h2>Stay Connected</h2>
          <p style={{ color: '#d3d9e3', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            Subscribe to stay in the loop — league standings, restock alerts, and exclusive signature drops straight from TekkyFutbol.
          </p>
          <div className="sec-cta">
            <button className="cta" onClick={() => setUpdatesOpen(true)}>GET LEAGUE UPDATES</button>
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
