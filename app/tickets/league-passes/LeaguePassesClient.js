'use client';

import { useEffect, useState } from 'react';
import GlowDivider from '@/components/ui/GlowDivider';
import { formatApiError } from '@/services/api';
import { fetchTicketAvailability, initiateTicketCheckout } from '@/services/ticketsApi';

const TIERS = [
  {
    tier: 'season_pass',
    title: 'SEASON ACCESS PASS',
    price: '$80',
    badge: 'FULL SEASON ALL-ACCESS',
    description:
      'One pass for every regular season match across both North and South divisions. Guaranteed entrance without buying weekly passes. Includes priority access to playoff and finale ticket drops.',
    capacityNote: 'Strictly limited to 20 total passes league-wide.',
    cta: 'GET SEASON PASS',
    purchasable: true,
  },
  {
    tier: 'playoff_pass',
    title: 'PLAYOFF MATCH PASS',
    price: '$15',
    badge: 'KNOCKOUT MATCHES ONLY',
    description:
      'Grants pitchside access to both official semifinal and knockout matches. High-stakes football where loser goes home. Does not include entry to the Season Finale celebration event.',
    capacityNote: 'Capped at 60 total passes for the host venue.',
    cta: 'GET PLAYOFF PASS',
    purchasable: true,
  },
  {
    tier: 'finale_pass',
    title: 'FINALE CELEBRATION PASS',
    price: '$25',
    badge: 'CELEBRATION EVENT ONLY',
    description:
      'Exclusive entry to the Season Finale afterparty, awards showcase, and championship celebration event at the neutral arena. Active league players enter free; limited guest passes available.',
    capacityNote: 'Capped at 200 guest passes.',
    cta: 'COMING SOON',
    purchasable: false,
  },
];

function TierCard({ tier, purchasing, remaining, onBuy }) {
  const soldOut = tier.purchasable && remaining !== null && remaining <= 0;
  const disabled = !tier.purchasable || soldOut || purchasing;

  let ctaLabel = tier.cta;
  if (tier.purchasable && soldOut) ctaLabel = 'SOLD OUT';
  else if (purchasing) ctaLabel = 'Redirecting…';

  return (
    <section style={{ margin: '3rem 0' }}>
      <p className="muted" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>{tier.badge}</p>
      <h2>{tier.title}</h2>
      <p className="price" style={{ fontSize: '1.8rem', margin: '0.5rem 0' }}>{tier.price}</p>
      <p style={{ margin: '0.6rem auto', maxWidth: '60ch', lineHeight: 1.8 }}>{tier.description}</p>
      <p className="muted" style={{ fontSize: '0.85rem' }}>{tier.capacityNote}</p>
      <div className="sec-cta">
        <button type="button" className="cta" disabled={disabled} onClick={() => onBuy(tier.tier)}>
          {ctaLabel}
        </button>
      </div>
    </section>
  );
}

export default function LeaguePassesClient() {
  const [remainingByTier, setRemainingByTier] = useState({});
  const [purchasingTier, setPurchasingTier] = useState('');
  const [checkoutError, setCheckoutError] = useState('');

  useEffect(() => {
    let cancelled = false;
    TIERS.filter((t) => t.purchasable).forEach((t) => {
      fetchTicketAvailability({ tier: t.tier })
        .then((data) => {
          if (!cancelled) setRemainingByTier((prev) => ({ ...prev, [t.tier]: data.remaining }));
        })
        .catch(() => {});
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleBuy(tier) {
    if (purchasingTier) return;
    setCheckoutError('');
    setPurchasingTier(tier);

    const cancelUrl = `${window.location.origin}${window.location.pathname}?checkout=cancelled`;

    try {
      const data = await initiateTicketCheckout({ tier, cancel_url: cancelUrl });
      window.location.href = data.checkout_url;
    } catch (err) {
      setPurchasingTier('');
      setCheckoutError(formatApiError(err, 'Something went wrong. Please try again.'));
    }
  }

  return (
    <>
      <header style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="hero" style={{ position: 'relative', zIndex: 2, maxWidth: 980, padding: '0 1rem' }}>
          <h1>{'LEAGUE PASSES // SPECIAL ACCESS'}</h1>
          <p className="tagline">For Ballers Who Create</p>
          <p className="subtext">
            Unrestricted matchday access, playoff knockouts, exclusive merch bundles, and flagship championship passes.
          </p>
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: '2.8rem auto 4rem', padding: '0 1.25rem', textAlign: 'center' }}>
        <GlowDivider />

        <p className="subtext">
          All passes are 100% digital and delivered instantly to your Wallet upon checkout.
        </p>

        <GlowDivider />

        {checkoutError && <p className="shop-buy-error">{checkoutError}</p>}

        {TIERS.map((tier, i) => (
          <div key={tier.tier}>
            <TierCard
              tier={tier}
              purchasing={purchasingTier === tier.tier}
              remaining={remainingByTier[tier.tier] ?? null}
              onBuy={handleBuy}
            />
            {i < TIERS.length - 1 && <GlowDivider />}
          </div>
        ))}

        <GlowDivider />

        <section style={{ margin: '3rem 0' }}>
          <p className="muted" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
            DIGITAL WALLET &amp; ACCREDITATION ONLY
          </p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            All TekkyFutbol passes are 100% digital. Upon checkout, your pass syncs directly to your account
            Wallet and generates an email QR pass with Apple/Google Wallet support. Security verifies all codes
            at the perimeter gate — no physical tickets issued.
          </p>
        </section>
      </main>
    </>
  );
}
