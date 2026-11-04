'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getMyPayment } from '@/services/paymentsApi';

export default function PaymentSuccessPage() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    console.log('[payment/success] checking payment status...');
    getMyPayment()
      .then((d) => {
        console.log('[payment/success] getMyPayment response:', d);
        setStatus(d?.payment?.status ?? null);
      })
      .catch((err) => {
        console.error('[payment/success] getMyPayment error:', err);
        setStatus(null);
      });
  }, []);

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: var(--font-ui); background: linear-gradient(180deg, #050b14 0%, #081026 100%); color: #fff; }
      `}</style>
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '2rem', textAlign: 'center',
        background: 'linear-gradient(180deg, var(--navy) 0%, var(--royal) 100%)',
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'rgba(0,200,100,0.1)', border: '2px solid rgba(0,200,100,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '1.5rem',
        }}>
          <i className="fa-solid fa-check" style={{ fontSize: '2rem', color: '#00c864' }} />
        </div>

        <h1 style={{ marginBottom: '0.75rem' }}>
          Payment Successful
        </h1>

        <p style={{ fontSize: '1rem', maxWidth: 420, lineHeight: 1.7, marginBottom: '0.5rem' }}>
          Your $700 registration fee has been received.
          {status === 'paid' ? ' Your registration is now complete.' : ' Your payment is being confirmed — this may take a moment.'}
        </p>

        <Link href="/user" className="cta" style={{ marginTop: '2rem' }}>
          Go to Dashboard
        </Link>
      </div>
    </>
  );
}
