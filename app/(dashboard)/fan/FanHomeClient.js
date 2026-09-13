'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchShopOrders } from '@/services/shopApi';

const DIVISION_LABEL = { north: 'North Court', south: 'South Court' };

function StatCard({ icon, label, value, sub }) {
  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.65)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      borderRadius: 12,
      padding: '1.25rem 1.4rem',
      boxShadow: '0 0 16px rgba(59, 130, 246, 0.07)',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 10, flexShrink: 0,
        background: 'rgba(61,139,255,0.12)', border: '1px solid rgba(61,139,255,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <i className={icon} style={{ color: 'var(--ad-electric)', fontSize: '1.05rem' }} />
      </div>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, margin: '0 0 0.2rem' }}>
          {label}
        </p>
        <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.3rem', letterSpacing: '0.5px', color: 'var(--fg)', margin: 0 }}>
          {value}
        </p>
        {sub && <p style={{ fontSize: '0.78rem', color: 'var(--muted)', margin: '0.15rem 0 0' }}>{sub}</p>}
      </div>
    </div>
  );
}

function QuickLink({ href, icon, label }) {
  return (
    <Link
      href={href}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.7rem',
        padding: '0.9rem 1.1rem',
        background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: 10, color: 'var(--fg)', textDecoration: 'none',
        fontSize: '0.9rem', fontWeight: 600, transition: 'border-color 0.15s, background 0.15s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(61,139,255,0.6)'; e.currentTarget.style.background = 'rgba(61,139,255,0.08)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)'; e.currentTarget.style.background = 'rgba(15,23,42,0.65)'; }}
    >
      <i className={icon} style={{ color: 'var(--ad-electric)', width: 18, textAlign: 'center' }} />
      {label}
      <i className="fa-solid fa-chevron-right" style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--muted)' }} />
    </Link>
  );
}

export default function FanHomeClient({ user }) {
  const [orderCount, setOrderCount] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchShopOrders()
      .then((data) => { if (!cancelled) setOrderCount(Array.isArray(data) ? data.length : 0); })
      .catch(() => { if (!cancelled) setOrderCount(0); });
    return () => { cancelled = true; };
  }, []);

  const fan = user.fan_profile || {};
  const divisionLabel = DIVISION_LABEL[fan.favorite_division] || 'Not set';
  const hasShipping = Boolean(fan.shipping_address);

  return (
    <div style={{ maxWidth: 780 }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{
          fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', color: 'var(--fg)',
          margin: 0, letterSpacing: '1px',
        }}>
          Welcome, {user.name || 'Fan'} 👋
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginTop: '0.35rem' }}>
          Your TekkyFutbol fan account.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard icon="fa-solid fa-shield-halved" label="Favorite Division" value={divisionLabel} />
        <StatCard
          icon="fa-solid fa-bag-shopping"
          label="Orders"
          value={orderCount === null ? '—' : orderCount}
          sub={orderCount === null ? 'Loading…' : orderCount === 0 ? 'No orders yet' : undefined}
        />
        <StatCard icon="fa-solid fa-truck" label="Shipping Info" value={hasShipping ? 'Saved' : 'Not saved'} />
      </div>

      <p style={{ fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, margin: '0 0 0.75rem' }}>
        Quick Links
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
        <QuickLink href="/fan/profile" icon="fa-solid fa-user" label="Edit Profile" />
        <QuickLink href="/fan/orders" icon="fa-solid fa-bag-shopping" label="Order History" />
        <QuickLink href="/shop" icon="fa-solid fa-store" label="Shop Merch" />
      </div>
    </div>
  );
}
