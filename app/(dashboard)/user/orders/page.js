'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { fetchShopOrders } from '@/services/shopApi';
import { formatApiError } from '@/services/api';
import { formatPrice } from '@/lib/shopUtils';

const STATUS_STYLES = {
  paid: { bg: 'rgba(0,200,100,0.12)', border: 'rgba(0,200,100,0.4)', text: '#00c864' },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] ?? { bg: 'rgba(160,100,255,0.12)', border: 'rgba(160,100,255,0.4)', text: '#a064ff' };
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.75rem', borderRadius: 999,
        fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px',
        background: s.bg, border: `1px solid ${s.border}`, color: s.text,
      }}
    >
      {status}
    </span>
  );
}

function OrderCard({ order }) {
  const date = order.created_at
    ? new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—';
  return (
    <div style={{ border: '1px solid var(--line)', borderRadius: 10, padding: '1rem 1.25rem', background: 'var(--card)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <strong>{order.product_name}</strong>
        <span>{formatPrice((order.amount_cents || 0) / 100)}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
        <StatusBadge status={order.status} />
        <span className="muted" style={{ fontSize: '0.85rem' }}>{date}</span>
      </div>
    </div>
  );
}

export default function PlayerOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && user && user.role !== 'player') {
      router.replace(user.role === 'admin' ? '/admin' : '/fan');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    let cancelled = false;
    fetchShopOrders()
      .then((data) => {
        if (!cancelled) setOrders(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) setError(formatApiError(err, 'Could not load orders.'));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (authLoading || !user || user.role !== 'player') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
        <span className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 780 }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2>Order History</h2>
        <p>Every purchase made with this account.</p>
      </div>

      {error && (
        <div
          style={{
            padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1rem', background: 'rgba(255,60,60,0.08)',
            border: '1px solid rgba(255,60,60,0.25)', color: '#ff6b6b', fontSize: '0.88rem',
          }}
        >
          <i className="fa-solid fa-circle-xmark" style={{ marginRight: '0.5rem' }} />
          {error}
        </div>
      )}

      {!error && orders === null && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
          <span className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
        </div>
      )}

      {!error && orders?.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <i className="fa-solid fa-bag-shopping" style={{ fontSize: '1.5rem', color: 'var(--muted)', marginBottom: '0.75rem', display: 'block' }} />
          <p className="muted" style={{ marginBottom: '1rem' }}>No orders yet.</p>
          <Link className="cta" href="/shop">Browse the Shop</Link>
        </div>
      )}

      {!error && orders?.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
