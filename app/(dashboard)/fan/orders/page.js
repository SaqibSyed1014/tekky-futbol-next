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
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '0.2rem 0.6rem', borderRadius: 40,
      fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize',
      background: s.bg, border: `1px solid ${s.border}`, color: s.text,
    }}>
      {status}
    </span>
  );
}

function OrderCard({ order }) {
  const date = order.created_at
    ? new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—';
  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(59, 130, 246, 0.3)',
      borderRadius: 12, padding: '1.3rem 1.5rem', boxShadow: '0 0 16px rgba(59, 130, 246, 0.07)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
        <strong style={{ color: 'var(--fg)', fontSize: '0.95rem' }}>{order.product_name}</strong>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', letterSpacing: '0.5px', color: 'var(--tekky-blue)' }}>
          {formatPrice((order.amount_cents || 0) / 100)}
        </span>
      </div>
      <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <StatusBadge status={order.status} />
        <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{date}</span>
      </div>
    </div>
  );
}

export default function FanOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && user && user.role !== 'fan') {
      router.replace(user.role === 'admin' ? '/admin' : '/user');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    let cancelled = false;
    fetchShopOrders()
      .then((data) => { if (!cancelled) setOrders(Array.isArray(data) ? data : []); })
      .catch((err) => { if (!cancelled) setError(formatApiError(err, 'Could not load orders.')); });
    return () => { cancelled = true; };
  }, []);

  if (authLoading || !user || user.role !== 'fan') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
        <span className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 780 }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.6rem', color: 'var(--fg)', margin: 0, letterSpacing: '1px' }}>
          Order History
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginTop: '0.35rem' }}>
          Every purchase made with this account.
        </p>
      </div>

      {error && (
        <div role="alert" style={{ background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.35)', borderRadius: 8, padding: '0.8rem 1rem', color: '#ff6b6b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      {!error && orders === null && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
          <span className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
        </div>
      )}

      {!error && orders?.length === 0 && (
        <div style={{
          background: 'rgba(15, 23, 42, 0.65)', border: '1px dashed rgba(59, 130, 246, 0.3)',
          borderRadius: 12, padding: '3rem 2rem', textAlign: 'center',
        }}>
          <i className="fa-solid fa-bag-shopping" style={{ fontSize: '2.5rem', color: 'rgba(61, 139, 255, 0.3)', marginBottom: '1rem', display: 'block' }} />
          <p style={{ color: 'var(--muted)', marginBottom: '1.2rem' }}>No orders yet.</p>
          <Link className="cta" href="/shop">Browse the Shop</Link>
        </div>
      )}

      {!error && orders?.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map((order) => <OrderCard key={order.id} order={order} />)}
        </div>
      )}
    </div>
  );
}
