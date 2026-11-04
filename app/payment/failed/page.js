'use client';

import Link from 'next/link';

export default function PaymentFailedPage() {
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
          background: 'rgba(255,60,60,0.1)', border: '2px solid rgba(255,60,60,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '1.5rem',
        }}>
          <i className="fa-solid fa-xmark" style={{ fontSize: '2rem', color: '#ff6b6b' }} />
        </div>

        <h1 style={{ marginBottom: '0.75rem' }}>
          Payment Failed
        </h1>

        <p style={{ fontSize: '1rem', maxWidth: 420, lineHeight: 1.7 }}>
          Your payment was not completed. You can try again from your dashboard at any time.
        </p>

        <Link href="/user" className="cta" style={{ marginTop: '2rem' }}>
          Go to Dashboard
        </Link>
      </div>
    </>
  );
}
