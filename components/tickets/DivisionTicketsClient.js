'use client';

import { useEffect, useState } from 'react';
import TicketPageShell, { TicketRule } from '@/components/tickets/TicketPageShell';
import { CoordinateTag } from '@/components/venue/VenueArt';
import PassTicket from '@/components/tickets/PassTicket';
import { useCheckoutCancelled } from '@/hooks/useCheckoutCancelled';
import Modal from '@/components/ui/Modal';
import MerchItemPicker from '@/components/tickets/MerchItemPicker';
import { getDivisionProducts } from '@/data/divisionProducts';
import { formatApiError } from '@/services/api';
import { fetchTicketAvailability, initiateTicketCheckout } from '@/services/ticketsApi';

const WEEKS = Array.from({ length: 16 }, (_, i) => i + 1);
const VENUE_CAPACITY = 120;
const MATCHDAY_CAP = 40;
const BUNDLE_CAP = 10;
const APPAREL_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const FULFILLMENT_OPTIONS = [
  { value: 'pickup', label: 'Pick Up At Venue' },
  { value: 'ship', label: 'Ship To Me' },
];

const DIVISION_COPY = {
  north: {
    label: 'North Division',
    theme: 'north',
    eyebrow: 'Pass Type 01 // Regular Season',
    headline: 'NORTH DIVISION // REGULAR SEASON PASSES',
    subheadline:
      'Concrete grounds. High-tempo football. Lock in your pitchside access for North Division regular season fixtures.',
    venueLocation: 'North Hub // Chicago, IL',
  },
  south: {
    label: 'South Division',
    theme: 'south',
    eyebrow: 'Pass Type 02 // Regular Season',
    headline: 'SOUTH DIVISION // REGULAR SEASON PASSES',
    subheadline:
      'Concrete grounds. High-tempo football. Lock in your pitchside access for South Division regular season fixtures.',
    venueLocation: 'South Hub // Chicago, IL',
  },
};

/**
 * Shared shell for the North and South division "Matchday Access" ticket
 * pages — identical structure, swapped only on division-specific copy.
 */
export default function DivisionTicketsClient({ division }) {
  const copy = DIVISION_COPY[division];
  const merchProducts = getDivisionProducts(division);
  const { cancelled, dismiss } = useCheckoutCancelled();

  const [week, setWeek] = useState(1);
  const [availability, setAvailability] = useState(null);
  const [availabilityError, setAvailabilityError] = useState('');

  const [purchasingTier, setPurchasingTier] = useState('');
  const [checkoutError, setCheckoutError] = useState('');

  const [bundleModalOpen, setBundleModalOpen] = useState(false);
  const [bundleMerchId, setBundleMerchId] = useState('');
  const [bundleColor, setBundleColor] = useState('');
  const [bundleSize, setBundleSize] = useState('');
  const [bundleFulfillment, setBundleFulfillment] = useState('');
  const [bundleModalError, setBundleModalError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setAvailability(null);
    setAvailabilityError('');
    fetchTicketAvailability({ division, week })
      .then((data) => {
        if (!cancelled) setAvailability(data);
      })
      .catch((err) => {
        if (!cancelled) setAvailabilityError(formatApiError(err, 'Could not load availability.'));
      });
    return () => {
      cancelled = true;
    };
  }, [division, week]);

  async function handleBuy(tier, extra = {}) {
    if (purchasingTier) return;
    setCheckoutError('');
    setPurchasingTier(tier);

    const cancelUrl = `${window.location.origin}${window.location.pathname}?checkout=cancelled`;
    const payload = {
      tier,
      division,
      week_number: week,
      cancel_url: cancelUrl,
      ...extra,
    };

    try {
      const data = await initiateTicketCheckout(payload);
      window.location.href = data.checkout_url;
    } catch (err) {
      setPurchasingTier('');
      setCheckoutError(formatApiError(err, 'Something went wrong. Please try again.'));
    }
  }

  function openBundleModal() {
    setBundleMerchId('');
    setBundleColor('');
    setBundleSize('');
    setBundleFulfillment('');
    setBundleModalError('');
    setBundleModalOpen(true);
  }

  function handleMerchSelect(id, color) {
    setBundleMerchId(id);
    setBundleColor(color);
  }

  function handleBundleSubmit(e) {
    e.preventDefault();
    if (!bundleMerchId) {
      setBundleModalError('Select a merch item to continue.');
      return;
    }
    if (!bundleSize || !bundleFulfillment) {
      setBundleModalError('Select a size and a fulfillment method to continue.');
      return;
    }
    setBundleModalOpen(false);
    handleBuy('supporter_bundle', {
      merch_item_id: bundleMerchId,
      merch_item_color: bundleColor,
      apparel_size: bundleSize,
      fulfillment_method: bundleFulfillment,
    });
  }

  const matchdaySoldOut = availability ? availability.matchday_remaining <= 0 : false;
  const bundleSoldOut = availability ? availability.bundle_remaining <= 0 : false;

  const weekLabel = `Week ${String(week).padStart(2, '0')}`;

  return (
    <TicketPageShell
      theme={copy.theme}
      active={division}
      eyebrow={copy.eyebrow}
      title={copy.headline}
      subtitle={copy.subheadline}
    >
      {cancelled && (
        <div className="tkt-notice" role="status">
          <p>Checkout was cancelled — no payment was taken. You can buy whenever you&apos;re ready.</p>
          <button type="button" onClick={dismiss} aria-label="Dismiss">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
      )}

      <section className="tkt-panel" aria-labelledby="tkt-fixture-heading">
        <div className="tkt-panel__head">
          <h3 id="tkt-fixture-heading">Select a fixture week</h3>
          <p className="tkt-tag">Live availability per matchday</p>
        </div>

        <div className="tkt-weeks" role="group" aria-label="Fixture week">
          {WEEKS.map((w) => (
            <button
              key={w}
              type="button"
              className={`tkt-week${week === w ? ' is-selected' : ''}`}
              aria-pressed={week === w}
              aria-label={`Week ${w}`}
              onClick={() => setWeek(w)}
            >
              <small>WK</small>
              <b>{String(w).padStart(2, '0')}</b>
            </button>
          ))}
        </div>

        <div className="tkt-stats">
          <div className="tkt-stat">
            <p className="tkt-tag">Location</p>
            <p className="tkt-stat__value">{copy.venueLocation}</p>
            <p className="tkt-stat__sub"><CoordinateTag /></p>
          </div>
          <div className="tkt-stat">
            <p className="tkt-tag">Venue capacity</p>
            <p className="tkt-stat__value">{VENUE_CAPACITY}</p>
            <p className="tkt-stat__sub">Strict limit</p>
          </div>
          <div className="tkt-stat">
            <p className="tkt-tag">Remaining passes</p>
            <p className="tkt-stat__value">
              {availabilityError
                ? '—'
                : availability
                  ? `${availability.matchday_remaining} of ${MATCHDAY_CAP}`
                  : 'Loading…'}
            </p>
            <p className="tkt-stat__sub">{weekLabel}</p>
          </div>
        </div>
      </section>

      <TicketRule />

      {checkoutError && (
        <div className="tkt-notice tkt-notice--error" role="alert">
          <p>{checkoutError}</p>
        </div>
      )}

      <PassTicket
        tag={`${copy.label} // Single match`}
        title="Single Match Pass"
        description={`Guaranteed pitchside entry for one ${copy.label} matchday. Select your specific week above. Digital QR pass delivered instantly to your Wallet upon checkout.`}
        note="Capped at 40 passes per matchday to maintain venue limits."
        specs={[weekLabel, 'Pitchside entry', 'Instant wallet delivery']}
        price="$10"
        validFor={weekLabel}
        meter={{ remaining: availability ? availability.matchday_remaining : null, cap: MATCHDAY_CAP }}
        ctaLabel={matchdaySoldOut ? 'SOLD OUT' : purchasingTier === 'single_match' ? 'Redirecting…' : 'SECURE MATCH PASS'}
        disabled={matchdaySoldOut || purchasingTier === 'single_match'}
        onCta={() => handleBuy('single_match')}
      />

      <PassTicket
        tag={`${copy.label} // Bundle`}
        title="Supporter Bundle"
        description="1 Single Match Pass + 1 Official Tekky Drop Apparel Item (select size at checkout). High-spec streetwear meets matchday access."
        note="Pick up your apparel at the venue merch desk on matchday using your QR pass, or select standard shipping. Strictly limited to 10 bundles per matchday."
        specs={[weekLabel, 'Match pass + apparel', 'Pickup or ship']}
        price="$60"
        validFor={weekLabel}
        meter={{ remaining: availability ? availability.bundle_remaining : null, cap: BUNDLE_CAP }}
        ctaLabel={bundleSoldOut ? 'SOLD OUT' : purchasingTier === 'supporter_bundle' ? 'Redirecting…' : 'CLAIM SUPPORTER BUNDLE'}
        disabled={bundleSoldOut || purchasingTier === 'supporter_bundle'}
        onCta={openBundleModal}
      />

        <Modal
          isOpen={bundleModalOpen}
          onClose={() => setBundleModalOpen(false)}
          contentClassName="overlay-content--wide"
        >
          <h3>Supporter Bundle</h3>
          <p className="subtext">Pick your apparel item, size, and how you&apos;d like to receive it.</p>
          <form onSubmit={handleBundleSubmit} style={{ paddingTop: '1rem' }}>
            <p className="venue-cell" style={{ marginBottom: '0.5rem', textAlign: 'left' }}>Merch Item</p>
            <MerchItemPicker
              division={division}
              products={merchProducts}
              selectedId={bundleMerchId}
              onSelect={handleMerchSelect}
            />

            <p className="venue-cell" style={{ margin: '1.5rem 0 0.5rem', textAlign: 'left' }}>Apparel Size</p>
            <div className="size-options" style={{ flexWrap: 'wrap' }}>
              {APPAREL_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`size-option${bundleSize === size ? ' is-selected' : ''}`}
                  onClick={() => setBundleSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>

            <p className="venue-cell" style={{ margin: '1.25rem 0 0.5rem', textAlign: 'left' }}>Fulfillment</p>
            <div className="size-options" style={{ flexWrap: 'wrap' }}>
              {FULFILLMENT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`size-option${bundleFulfillment === opt.value ? ' is-selected' : ''}`}
                  onClick={() => setBundleFulfillment(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {bundleModalError && (
              <p style={{ color: '#ff6b6b', fontSize: '0.85rem', marginTop: '0.75rem' }}>{bundleModalError}</p>
            )}

            <button type="submit" className="cta close-overlay" style={{ marginTop: '1.25rem' }}>
              Continue To Payment
            </button>
          </form>
        </Modal>

        <TicketRule />

        <section className="tkt-info" aria-label="Gate and access rules">
          <div className="tkt-info__card">
            <p className="tkt-tag">Digital wallet access only</p>
            <h3>Gate &amp; Access Rules</h3>
            <p>
              All TekkyFutbol passes are 100% digital. Upon checkout, your QR pass will instantly appear in your
              account Wallet and be sent via email. Security scans all passes at the outer gate — no physical
              tickets issued.
            </p>
          </div>

          <div className="tkt-info__card">
            <p className="tkt-tag">Shared pool</p>
            <h3>The Inventory Pooling Architecture</h3>
            <p>
              To ensure total spectator sales never exceed the 40-ticket limit (leaving 80 slots for players,
              staff, referees, media, and season pass holders), Single Match Passes and Supporter Bundles draw
              from a shared pool.
            </p>
            <ul className="tkt-list">
              <li>Total Paid Sales Cap: 40 Tickets Maximum</li>
              <li>Supporter Bundle Sub-Cap: 10 Bundles Maximum (included within the 40 total)</li>
            </ul>
          </div>

          <div className="tkt-info__card">
            <p className="tkt-tag">4 steps</p>
            <h3>Step By Step Checkout</h3>
            <ol className="tkt-list">
              <li>Fixture selection</li>
              <li>Tier selection</li>
              <li>{copy.label} merch item and size (S–XXL)</li>
              <li>Payment and issuance (wallet/email)</li>
            </ol>
          </div>
        </section>
    </TicketPageShell>
  );
}
