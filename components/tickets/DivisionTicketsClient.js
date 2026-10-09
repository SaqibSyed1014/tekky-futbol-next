'use client';

import { useEffect, useState } from 'react';
import GlowDivider from '@/components/ui/GlowDivider';
import { formatApiError } from '@/services/api';
import { fetchTicketAvailability, initiateTicketCheckout } from '@/services/ticketsApi';

const WEEKS = Array.from({ length: 16 }, (_, i) => i + 1);
const VENUE_CAPACITY = 120;

const DIVISION_COPY = {
  north: {
    label: 'North Division',
    headline: 'NORTH DIVISION // REGULAR SEASON PASSES',
    subheadline:
      'Concrete grounds. High-tempo football. Lock in your pitchside access for North Division regular season fixtures.',
    venueLocation: 'North Hub // Chicago, IL',
  },
  south: {
    label: 'South Division',
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

  const [week, setWeek] = useState(1);
  const [availability, setAvailability] = useState(null);
  const [availabilityError, setAvailabilityError] = useState('');

  const [purchasingTier, setPurchasingTier] = useState('');
  const [checkoutError, setCheckoutError] = useState('');

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

  async function handleBuy(tier) {
    if (purchasingTier) return;
    setCheckoutError('');
    setPurchasingTier(tier);

    const cancelUrl = `${window.location.origin}${window.location.pathname}?checkout=cancelled`;
    const payload = {
      tier,
      division,
      week_number: week,
      cancel_url: cancelUrl,
    };

    try {
      const data = await initiateTicketCheckout(payload);
      window.location.href = data.checkout_url;
    } catch (err) {
      setPurchasingTier('');
      setCheckoutError(formatApiError(err, 'Something went wrong. Please try again.'));
    }
  }

  const matchdaySoldOut = availability ? availability.matchday_remaining <= 0 : false;
  const bundleSoldOut = availability ? availability.bundle_remaining <= 0 : false;

  return (
    <>
      <header style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="hero" style={{ position: 'relative', zIndex: 2, maxWidth: 980, padding: '0 1rem' }}>
          <h1>{copy.headline}</h1>
          <p className="tagline">For Ballers Who Create</p>
          <p className="subtext">{copy.subheadline}</p>
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: '2.8rem auto 4rem', padding: '0 1.25rem', textAlign: 'center' }}>
        <GlowDivider />

        <section style={{ margin: '3rem 0' }}>
          <p className="subtext" style={{ marginBottom: '1rem' }}>
            Select a fixture week below to view matchday venue details and live ticket availability.
          </p>

          <div className="size-options" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
            {WEEKS.map((w) => (
              <button
                key={w}
                type="button"
                className={`size-option${week === w ? ' is-selected' : ''}`}
                onClick={() => setWeek(w)}
              >
                WEEK {String(w).padStart(2, '0')}
              </button>
            ))}
          </div>

          <div className="table-wrap" style={{ marginTop: '1.5rem' }}>
            <table>
              <tbody>
                <tr>
                  <td className="venue-cell">Location</td>
                  <td>{copy.venueLocation}</td>
                </tr>
                <tr>
                  <td className="venue-cell">Venue Capacity</td>
                  <td>{VENUE_CAPACITY} (strict limit)</td>
                </tr>
                <tr>
                  <td className="venue-cell">Remaining Passes</td>
                  <td>
                    {availabilityError
                      ? '—'
                      : availability
                        ? `${availability.matchday_remaining} of 40`
                        : 'Loading…'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <GlowDivider />

        {checkoutError && <p className="shop-buy-error">{checkoutError}</p>}

        <section style={{ margin: '3rem 0' }}>
          <h2>{`${copy.label.toUpperCase()} // SINGLE MATCH PASS`}</h2>
          <p className="price" style={{ fontSize: '1.8rem', margin: '0.5rem 0' }}>$10</p>
          <p style={{ margin: '0.6rem auto', maxWidth: '60ch', lineHeight: 1.8 }}>
            Guaranteed pitchside entry for one {copy.label} matchday. Select your specific week above.
            Digital QR pass delivered instantly to your Wallet upon checkout.
          </p>
          <p className="muted" style={{ fontSize: '0.85rem' }}>
            Capped at 40 passes per matchday to maintain venue limits.
          </p>
          <div className="sec-cta">
            <button
              type="button"
              className="cta"
              disabled={matchdaySoldOut || purchasingTier === 'single_match'}
              onClick={() => handleBuy('single_match')}
            >
              {matchdaySoldOut ? 'SOLD OUT' : purchasingTier === 'single_match' ? 'Redirecting…' : 'SECURE MATCH PASS'}
            </button>
          </div>
        </section>

        <GlowDivider />

        <section style={{ margin: '3rem 0' }}>
          <h2>{`${copy.label.toUpperCase()} // SUPPORTER BUNDLE`}</h2>
          <p className="price" style={{ fontSize: '1.8rem', margin: '0.5rem 0' }}>$60</p>
          <p style={{ margin: '0.6rem auto', maxWidth: '60ch', lineHeight: 1.8 }}>
            1 Single Match Pass + 1 Official Tekky Drop Apparel Item (select size at checkout).
            High-spec streetwear meets matchday access.
          </p>

          <p className="muted" style={{ fontSize: '0.85rem' }}>
            Pick up your apparel at the venue merch desk on matchday using your QR pass, or select standard shipping.
            Strictly limited to 10 bundles per matchday.
          </p>
          <div className="sec-cta">
            <button
              type="button"
              className="cta"
              disabled={bundleSoldOut || purchasingTier === 'supporter_bundle'}
              onClick={() => handleBuy('supporter_bundle')}
            >
              {bundleSoldOut ? 'SOLD OUT' : purchasingTier === 'supporter_bundle' ? 'Redirecting…' : 'CLAIM SUPPORTER BUNDLE'}
            </button>
          </div>
        </section>

        <GlowDivider />

        <section style={{ margin: '3rem 0' }}>
          <h2>Gate &amp; Access Rules</h2>
          <p className="muted" style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
            Digital wallet access only
          </p>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            All TekkyFutbol passes are 100% digital. Upon checkout, your QR pass will instantly appear in your
            account Wallet and be sent via email. Security scans all passes at the outer gate — no physical
            tickets issued.
          </p>

          <h3 style={{ marginTop: '2rem' }}>The Inventory Pooling Architecture</h3>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            To ensure total spectator sales never exceed the 40-ticket limit (leaving 80 slots for players,
            staff, referees, media, and season pass holders), Single Match Passes and Supporter Bundles draw
            from a shared pool.
          </p>
          <ul className="bullet-list centered">
            <li>Total Paid Sales Cap: 40 Tickets Maximum</li>
            <li>Supporter Bundle Sub-Cap: 10 Bundles Maximum (included within the 40 total)</li>
          </ul>

          <h3 style={{ marginTop: '2rem' }}>Step By Step Checkout</h3>
          <ol style={{ display: 'inline-block', margin: '0 auto', textAlign: 'left' }}>
            <li>Fixture selection</li>
            <li>Tier selection</li>
            <li>{copy.label} merch item and size (S–XXL)</li>
            <li>Payment and issuance (wallet/email)</li>
          </ol>
        </section>
      </main>
    </>
  );
}
