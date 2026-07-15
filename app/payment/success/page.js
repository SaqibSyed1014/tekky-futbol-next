'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getMyPayment } from '@/services/paymentsApi';

export default function PaymentSuccessPage() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    getMyPayment()
      .then((d) => setStatus(d?.payment?.status ?? null))
      .catch(() => {});
  }, []);

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Montserrat', sans-serif; background: #000; color: #e9eef7; }
      `}</style>
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '2rem', textAlign: 'center',
        background: 'linear-gradient(180deg,#000 0%,#020b18 100%)',
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'rgba(0,200,100,0.1)', border: '2px solid rgba(0,200,100,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '1.5rem',
        }}>
          <i className="fa-solid fa-check" style={{ fontSize: '2rem', color: '#00c864' }} />
        </div>

        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem',
          letterSpacing: '2px', color: '#fff', marginBottom: '0.75rem',
        }}>
          Payment Successful
        </h1>

        <p style={{ color: '#b6c2d3', fontSize: '1rem', maxWidth: 420, lineHeight: 1.7, marginBottom: '0.5rem' }}>
          Your $700 registration fee has been received.
          {status === 'paid' ? ' Your registration is now complete.' : ' Your payment is being confirmed — this may take a moment.'}
        </p>

        <Link href="/user" style={{
          marginTop: '2rem',
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.7rem 1.75rem',
          background: 'rgba(0,116,255,0.12)',
          border: '2px solid rgba(0,116,255,0.5)',
          borderRadius: 40, color: '#fff', textDecoration: 'none',
          fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '1.5px', fontSize: '1rem',
          boxShadow: '0 0 16px rgba(0,116,255,0.3)',
        }}>
          <i className="fa-solid fa-house" />
          Go to Dashboard
        </Link>
      </div>
    </>
  );
}
