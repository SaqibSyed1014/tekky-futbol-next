'use client';

import { useEffect, useState } from 'react';
import TicketPageShell, { TicketRule } from '@/components/tickets/TicketPageShell';
import PassTicket from '@/components/tickets/PassTicket';
import { useCheckoutCancelled } from '@/hooks/useCheckoutCancelled';
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
    cap: 20,
    specs: ['16 regular season matches', 'North + South', 'Priority playoff drops'],
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
    cap: 60,
    specs: ['Semifinals + knockouts', 'Pitchside access', 'Host venue'],
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
    cap: 200,
    specs: ['Afterparty + awards', 'Neutral arena', 'Players enter free'],
    cta: 'COMING SOON',
    purchasable: false,
  },
];

function TierCard({ tier, index, purchasing, remaining, onBuy }) {
  const soldOut = tier.purchasable && remaining !== null && remaining <= 0;
  const disabled = !tier.purchasable || soldOut || purchasing;

  let ctaLabel = tier.cta;
  if (tier.purchasable && soldOut) ctaLabel = 'SOLD OUT';
  else if (purchasing) ctaLabel = 'Redirecting…';

  return (
    <PassTicket
      tag={`${String(index + 1).padStart(2, '0')} // ${tier.badge}`}
      title={tier.title}
      description={tier.description}
      note={tier.capacityNote}
      specs={tier.specs}
      price={tier.price}
      meter={tier.purchasable ? { remaining, cap: tier.cap } : undefined}
      ctaLabel={ctaLabel}
      disabled={disabled}
      locked={!tier.purchasable}
      onCta={() => onBuy(tier.tier)}
    />
  );
}

export default function LeaguePassesClient() {
  const [remainingByTier, setRemainingByTier] = useState({});
  const [purchasingTier, setPurchasingTier] = useState('');
  const [checkoutError, setCheckoutError] = useState('');
  const { cancelled, dismiss } = useCheckoutCancelled();

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
    <TicketPageShell
      theme="hub"
      active="league"
      eyebrow="Pass Type 03 // Special Access"
      title="LEAGUE PASSES // SPECIAL ACCESS"
      subtitle="Unrestricted matchday access, playoff knockouts, exclusive merch bundles, and flagship championship passes."
    >
      {cancelled && (
        <div className="tkt-notice" role="status">
          <p>Checkout was cancelled — no payment was taken. You can buy whenever you&apos;re ready.</p>
          <button type="button" onClick={dismiss} aria-label="Dismiss">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
      )}

      <p className="tkt-tag" style={{ textAlign: 'center' }}>
        All passes are 100% digital — delivered instantly to your Wallet upon checkout
      </p>

      <TicketRule />

      {checkoutError && (
        <div className="tkt-notice tkt-notice--error" role="alert">
          <p>{checkoutError}</p>
        </div>
      )}

      {TIERS.map((tier, i) => (
        <TierCard
          key={tier.tier}
          tier={tier}
          index={i}
          purchasing={purchasingTier === tier.tier}
          remaining={remainingByTier[tier.tier] ?? null}
          onBuy={handleBuy}
        />
      ))}

      <TicketRule />

      <section className="tkt-info" style={{ gridTemplateColumns: '1fr' }} aria-label="Wallet and accreditation">
        <div className="tkt-info__card">
          <p className="tkt-tag">Digital wallet &amp; accreditation only</p>
          <h3>Perimeter gate verification</h3>
          <p>
            All TekkyFutbol passes are 100% digital. Upon checkout, your pass syncs directly to your account
            Wallet and generates an email QR pass with Apple/Google Wallet support. Security verifies all codes
            at the perimeter gate — no physical tickets issued.
          </p>
        </div>
      </section>
    </TicketPageShell>
  );
}
