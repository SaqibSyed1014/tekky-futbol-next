'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/shopUtils';
import { formatApiError } from '@/services/api';
import { fetchMyTickets } from '@/services/ticketsApi';

const STATUS_STYLES = {
  paid: { bg: 'rgba(0,200,100,0.12)', border: 'rgba(0,200,100,0.4)', text: '#00c864', label: 'Paid' },
  checked_in: { bg: 'rgba(61,139,255,0.12)', border: 'rgba(61,139,255,0.4)', text: '#3d8bff', label: 'Checked In' },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] ?? { bg: 'rgba(160,100,255,0.12)', border: 'rgba(160,100,255,0.4)', text: '#a064ff', label: status };
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.75rem', borderRadius: 999,
        fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px',
        background: s.bg, border: `1px solid ${s.border}`, color: s.text,
      }}
    >
      {s.label}
    </span>
  );
}

function TicketCard({ ticket }) {
  const [showQr, setShowQr] = useState(false);
  const date = ticket.created_at
    ? new Date(ticket.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—';

  return (
    <div style={{ border: '1px solid var(--line)', borderRadius: 10, padding: '1rem 1.25rem', background: 'var(--card)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <strong>{ticket.product_name}</strong>
        <span>{formatPrice((ticket.amount_cents || 0) / 100)}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
        <StatusBadge status={ticket.status} />
        <span className="muted" style={{ fontSize: '0.85rem' }}>{date}</span>
      </div>
      <button
        type="button"
        className="cta"
        style={{ marginTop: '1rem', width: '100%' }}
        onClick={() => setShowQr((v) => !v)}
      >
        {showQr ? 'Hide QR' : 'View QR'}
      </button>
      {showQr && (
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: '1rem', display: 'inline-block' }}>
            <img src={`data:image/png;base64,${ticket.qr_code_base64}`} alt="Ticket QR code" width={180} height={180} />
          </div>
        </div>
      )}
    </div>
  );
}

/** Shared ticket wallet list — used by both the Fan and Player "My Tickets" pages. */
export default function TicketWalletList({ browseHref }) {
  const [tickets, setTickets] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetchMyTickets()
      .then((data) => {
        if (!cancelled) setTickets(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) setError(formatApiError(err, 'Could not load tickets.'));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div
        style={{
          padding: '0.75rem 1rem', borderRadius: 8, background: 'rgba(255,60,60,0.08)',
          border: '1px solid rgba(255,60,60,0.25)', color: '#ff6b6b', fontSize: '0.88rem',
        }}
      >
        <i className="fa-solid fa-circle-xmark" style={{ marginRight: '0.5rem' }} />
        {error}
      </div>
    );
  }

  if (tickets === null) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
        <span className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <i className="fa-solid fa-ticket" style={{ fontSize: '1.5rem', color: 'var(--muted)', marginBottom: '0.75rem', display: 'block' }} />
        <p className="muted" style={{ marginBottom: '1rem' }}>No passes yet.</p>
        <Link className="cta" href={browseHref}>Browse Match Passes</Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}
