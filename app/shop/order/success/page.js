'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';

export default function ShopOrderSuccessPage() {
  const [backHref, setBackHref] = useState('/shop');
  const { clearCart } = useCart();

  useEffect(() => {
    const stored = sessionStorage.getItem('shopReturnPath');
    if (stored && stored.startsWith('/shop')) {
      setBackHref(stored);
      sessionStorage.removeItem('shopReturnPath');
    }
    clearCart();
  }, [clearCart]);

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
          Order Confirmed
        </h1>

        <p style={{ fontSize: '1rem', maxWidth: 420, lineHeight: 1.7, marginBottom: '0.5rem' }}>
          Your purchase went through. A confirmation email has been sent to the address you entered at checkout.
        </p>
        <p style={{ fontSize: '0.9rem', maxWidth: 420, lineHeight: 1.7 }}>
          Thank you for repping TekkyFutbol.
        </p>

        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href={backHref} className="cta">
            Back to Shop
          </Link>
        </div>
      </div>
    </>
  );
}
