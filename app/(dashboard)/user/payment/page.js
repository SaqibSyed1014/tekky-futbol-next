'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { initiatePayment, getMyPayment } from '@/services/paymentsApi';

const STATUS_CONFIG = {
  paid: {
    icon: 'fa-solid fa-circle-check',
    color: '#00c864',
    bg: 'rgba(0,200,100,0.08)',
    border: 'rgba(0,200,100,0.25)',
    label: 'Paid',
    message: 'Your registration fee has been paid. You\'re all set!',
  },
  pending: {
    icon: 'fa-solid fa-clock',
    color: '#ffb400',
    bg: 'rgba(255,180,0,0.08)',
    border: 'rgba(255,180,0,0.25)',
    label: 'Pending',
    message: 'Your payment has been initiated but not yet confirmed.',
  },
  failed: {
    icon: 'fa-solid fa-circle-xmark',
    color: '#ff6b6b',
    bg: 'rgba(255,60,60,0.08)',
    border: 'rgba(255,60,60,0.25)',
    label: 'Failed',
    message: 'Your last payment attempt failed. Please try again.',
  },
  cancelled: {
    icon: 'fa-solid fa-ban',
    color: '#888',
    bg: 'rgba(128,128,128,0.08)',
    border: 'rgba(128,128,128,0.25)',
    label: 'Cancelled',
    message: 'Your payment was cancelled. You can try again below.',
  },
};

function fmtDate(val) {
  if (!val) return '—';
  return new Date(val).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function UserPaymentPage() {
  const { user, loading: authLoading } = useAuth();
  const [payment, setPayment]   = useState(undefined); // undefined = loading
  const [paying, setPaying]     = useState(false);
  const [error, setError]       = useState('');

  useEffect(() => {
    if (authLoading || !user) return;
    getMyPayment()
      .then((d) => setPayment(d?.payment ?? null))
      .catch(() => setPayment(null));
  }, [authLoading, user]);

  async function handlePay() {
    setError('');
    setPaying(true);
    try {
      const formData = await initiatePayment();
      const { hpp_url, ...fields } = formData;

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = hpp_url;

      Object.entries(fields).forEach(([key, val]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = val;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      setError(err?.message || 'Failed to initiate payment. Please try again.');
      setPaying(false);
    }
  }

  if (authLoading || payment === undefined) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
        <span className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
      </div>
    );
  }

  const cfg = payment ? STATUS_CONFIG[payment.status] : null;
  const canPay = !payment || payment.status === 'failed' || payment.status === 'cancelled';
  const waiversigned = !!user?.waiver_signed;

  return (
    <div style={{ maxWidth: 520 }}>

      {/* Status card */}
      <div style={{
        background: '#000',
        border: '1px solid rgba(0,116,255,0.2)',
        borderRadius: 12,
        padding: '1.75rem',
        marginBottom: '1.25rem',
      }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '1.25rem' }}>
          Registration Fee
        </h2>

        {/* Amount */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1rem 1.25rem',
          background: 'rgba(0,116,255,0.05)',
          border: '1px solid rgba(0,116,255,0.12)',
          borderRadius: 8, marginBottom: '1rem',
        }}>
          <span style={{ color: '#b6c2d3', fontSize: '0.9rem' }}>Registration Fee</span>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', color: '#fff', letterSpacing: '1px' }}>
            $700.00
          </span>
        </div>

        {/* Payment status */}
        {cfg ? (
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
            padding: '1rem 1.25rem',
            background: cfg.bg, border: `1px solid ${cfg.border}`,
            borderRadius: 8, marginBottom: '1rem',
          }}>
            <i className={cfg.icon} style={{ color: cfg.color, marginTop: '0.1rem' }} />
            <div>
              <div style={{ fontWeight: 700, color: cfg.color, fontSize: '0.88rem', marginBottom: '0.2rem' }}>
                {cfg.label}
              </div>
              <div style={{ color: '#b6c2d3', fontSize: '0.84rem', lineHeight: 1.5 }}>
                {cfg.message}
              </div>
              {payment.paid_at && (
                <div style={{ marginTop: '0.4rem', fontSize: '0.8rem', color: '#666' }}>
                  Paid on {fmtDate(payment.paid_at)}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{
            padding: '1rem 1.25rem',
            background: 'rgba(255,180,0,0.06)',
            border: '1px solid rgba(255,180,0,0.2)',
            borderRadius: 8, marginBottom: '1rem',
            color: '#b6c2d3', fontSize: '0.88rem', lineHeight: 1.5,
          }}>
            <i className="fa-solid fa-circle-info" style={{ color: '#ffb400', marginRight: '0.5rem' }} />
            {waiversigned
              ? 'Your registration fee is due. Click the button below to pay.'
              : 'You must sign the waiver before paying the registration fee.'}
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1rem',
            background: 'rgba(255,60,60,0.08)', border: '1px solid rgba(255,60,60,0.25)',
            color: '#ff6b6b', fontSize: '0.85rem',
          }}>
            <i className="fa-solid fa-circle-xmark" style={{ marginRight: '0.5rem' }} />
            {error}
          </div>
        )}

        {/* Pay button */}
        {canPay && waiversigned && (
          <button
            onClick={handlePay}
            disabled={paying}
            style={{
              width: '100%', padding: '0.85rem',
              background: paying ? 'rgba(0,116,255,0.4)' : 'rgba(0,116,255,0.15)',
              border: '2px solid rgba(0,116,255,0.6)',
              borderRadius: 8, color: '#fff', fontSize: '0.95rem', fontWeight: 700,
              cursor: paying ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              fontFamily: 'inherit',
            }}
          >
            {paying ? (
              <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Redirecting to Bank…</>
            ) : (
              <><i className="fa-solid fa-credit-card" /> Pay $700.00</>
            )}
          </button>
        )}
      </div>

      {/* Info note */}
      <p style={{ fontSize: '0.8rem', color: '#555', lineHeight: 1.6 }}>
        Payments are processed securely by Bank of America. You will be redirected to their
        hosted payment page to complete your transaction.
      </p>
    </div>
  );
}
