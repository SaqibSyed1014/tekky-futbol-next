'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatApiError } from '@/services/api';
import { fetchTicketBySession } from '@/services/ticketsApi';
import { findProduct, getProductImage } from '@/data/divisionProducts';

export default function TicketOrderSuccessPage() {
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get('session_id');
    if (!sessionId) {
      setError('Missing checkout session.');
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    fetchTicketBySession(sessionId)
      .then((data) => {
        if (!cancelled) setTicket(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            formatApiError(
              err,
              'We could not find that pass yet — it may still be processing. Check your email shortly.'
            )
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main style={{ maxWidth: 480, margin: '4rem auto', padding: '0 1.25rem', textAlign: 'center' }}>
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
          <span className="spinner" />
        </div>
      )}

      {!loading && error && (
        <>
          <h1>Almost There</h1>
          <p className="subtext">{error}</p>
        </>
      )}

      {!loading && ticket && (
        <>
          <h1>Pass Confirmed</h1>
          <p className="subtext">{ticket.product_name}</p>

          {ticket.merch_item_id && (() => {
            const product = findProduct(ticket.division, ticket.merch_item_id);
            if (!product) return null;
            const image = getProductImage(ticket.division, product.productType);
            return (
              <div
                className="shop-product-card"
                style={{ maxWidth: 280, margin: '1.25rem auto 0', textAlign: 'left' }}
              >
                <div className="shop-product-card__media">
                  <Image src={image} alt={product.name} width={400} height={320} style={{ width: '100%', height: 'auto' }} />
                </div>
                <div className="shop-product-card__body" style={{ paddingBottom: '1.25rem' }}>
                  <h3 className="shop-product-card__title">{product.name}</h3>
                  <p className="shop-product-card__desc" style={{ marginBottom: 0 }}>{product.sub}</p>
                  <p className="subtext" style={{ marginTop: '0.6rem', marginBottom: 0 }}>
                    Size {ticket.apparel_size} — {ticket.fulfillment_method === 'ship' ? 'Ship to Me' : 'Pickup at Venue'}
                  </p>
                </div>
              </div>
            );
          })()}

          {!ticket.merch_item_id && ticket.apparel_size && (
            <p className="subtext" style={{ marginTop: '-0.5rem' }}>
              Size {ticket.apparel_size} — {ticket.fulfillment_method === 'ship' ? 'Ship to Me' : 'Pickup at Venue'}
            </p>
          )}

          <div style={{ background: '#fff', borderRadius: 12, padding: '1.5rem', display: 'inline-block', margin: '1.5rem 0' }}>
            <img
              src={`data:image/png;base64,${ticket.qr_code_base64}`}
              alt="Ticket QR code"
              width={220}
              height={220}
            />
          </div>
          <p className="muted" style={{ fontSize: '0.85rem' }}>
            Show this QR code at the gate. A copy has also been sent to your email.
          </p>
        </>
      )}

      <div className="sec-cta" style={{ marginTop: '2rem' }}>
        <Link className="cta" href="/tickets">Browse More Passes</Link>
        <Link className="cta" href="/">Back to Home</Link>
      </div>
    </main>
  );
}
