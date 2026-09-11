'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import GlowDivider from '@/components/ui/GlowDivider';
import { updateFanProfile, changePassword } from '@/services/userApi';
import { fetchShopOrders } from '@/services/shopApi';
import { formatApiError } from '@/services/api';
import { formatPrice } from '@/lib/shopUtils';

const cardStyle = {
  background: 'var(--card)',
  border: '1px solid var(--line-blue)',
  borderRadius: 16,
  padding: '1.75rem',
  boxShadow: 'var(--shadow)',
  backdropFilter: 'blur(18px)',
};

const TABS = [
  { key: 'profile', label: 'Profile', icon: 'fa-solid fa-user' },
  { key: 'orders', label: 'Orders', icon: 'fa-solid fa-bag-shopping' },
  { key: 'settings', label: 'Settings', icon: 'fa-solid fa-key' },
];

const SHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

function banner(type, msg) {
  if (!msg) return null;
  const ok = type === 'success';
  return (
    <div
      role="alert"
      style={{
        background: ok ? 'rgba(0,200,100,0.1)' : 'rgba(255,60,60,0.12)',
        border: `1px solid ${ok ? 'rgba(0,200,100,0.3)' : 'rgba(255,60,60,0.4)'}`,
        borderRadius: 8,
        padding: '0.75rem 1rem',
        color: ok ? '#00c864' : '#ff6b6b',
        fontSize: '0.88rem',
        marginBottom: '1rem',
      }}
    >
      {msg}
    </div>
  );
}

function ProfileForm({ user, onUpdated }) {
  const fan = user.fan_profile || {};
  const [name, setName] = useState(user.name || '');
  const [favoriteDivision, setFavoriteDivision] = useState(fan.favorite_division || '');
  const [zipCode, setZipCode] = useState(fan.zip_code || '');
  const [address, setAddress] = useState(fan.shipping_address || '');
  const [city, setCity] = useState(fan.shipping_city || '');
  const [state, setState] = useState(fan.shipping_state || '');
  const [shirtSize, setShirtSize] = useState(fan.shirt_size || '');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccess('');
    setError('');
    if (zipCode && !/^\d{5}$/.test(zipCode)) {
      setError('Zip code must be 5 digits.');
      return;
    }
    setSaving(true);
    try {
      await updateFanProfile({
        name,
        favorite_division: favoriteDivision,
        zip_code: zipCode,
        shipping_address: address,
        shipping_city: city,
        shipping_state: state,
        shirt_size: shirtSize,
      });
      setSuccess('Profile saved.');
      onUpdated?.();
    } catch (err) {
      setError(formatApiError(err, 'Could not save profile.'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={cardStyle}>
      <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", color: 'var(--tekky-blue)', fontSize: '1.5rem', marginBottom: '1.25rem' }}>
        Profile Details
      </h2>
      {banner('success', success)}
      {banner('error', error)}

      <label htmlFor="fan-name">Full Name</label>
      <input id="fan-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" />

      <label htmlFor="fan-email">Email</label>
      <input id="fan-email" type="email" value={user.email} readOnly disabled />

      <label htmlFor="fan-division">Favorite Division</label>
      <select id="fan-division" value={favoriteDivision} onChange={(e) => setFavoriteDivision(e.target.value)}>
        <option value="">Select a court</option>
        <option value="north">North Court</option>
        <option value="south">South Court</option>
      </select>

      <label htmlFor="fan-zip">Zip Code</label>
      <input
        id="fan-zip"
        value={zipCode}
        onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
        placeholder="60601"
        inputMode="numeric"
        maxLength={5}
        autoComplete="postal-code"
      />

      <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", color: 'var(--fg)', fontSize: '1.2rem', margin: '0.5rem 0 1rem' }}>
        Shipping
      </h3>
      <label htmlFor="fan-address">Street Address</label>
      <input id="fan-address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Pitch Ave" autoComplete="street-address" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }} className="fan-addr-grid">
        <div>
          <label htmlFor="fan-city">City</label>
          <input id="fan-city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Chicago" autoComplete="address-level2" />
        </div>
        <div>
          <label htmlFor="fan-state">State</label>
          <input id="fan-state" value={state} onChange={(e) => setState(e.target.value)} placeholder="IL" autoComplete="address-level1" />
        </div>
      </div>

      <label htmlFor="fan-size">Shirt Size</label>
      <select id="fan-size" value={shirtSize} onChange={(e) => setShirtSize(e.target.value)}>
        <option value="">Select a size</option>
        {SHIRT_SIZES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <button type="submit" className="cta" disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {saving ? <><span className="spinner" /> Saving…</> : 'Save Profile'}
      </button>
    </form>
  );
}

function OrdersTab() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetchShopOrders()
      .then((data) => { if (!cancelled) setOrders(Array.isArray(data) ? data : []); })
      .catch((err) => { if (!cancelled) setError(formatApiError(err, 'Could not load orders.')); });
    return () => { cancelled = true; };
  }, []);

  if (error) {
    return <div style={cardStyle}>{banner('error', error)}</div>;
  }

  if (!orders) {
    return (
      <div style={{ ...cardStyle, display: 'flex', justifyContent: 'center' }}>
        <span className="spinner" style={{ width: 28, height: 28, borderWidth: 3, margin: 0 }} />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={{ ...cardStyle, textAlign: 'center' }}>
        <i className="fa-solid fa-bag-shopping" style={{ fontSize: '1.8rem', color: 'var(--muted)', marginBottom: '0.8rem' }} />
        <p style={{ color: 'var(--muted)', marginBottom: '1.2rem' }}>No orders yet.</p>
        <Link className="cta" href="/shop">Browse the Shop</Link>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", color: 'var(--tekky-blue)', fontSize: '1.5rem', marginBottom: '1.25rem' }}>
        Order History
      </h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {orders.map((order) => (
          <li
            key={order.id}
            style={{
              border: '1px solid var(--line)',
              borderRadius: 12,
              padding: '1rem 1.1rem',
              background: 'rgba(6, 18, 50, 0.45)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <strong style={{ color: 'var(--fg)' }}>{order.product_name}</strong>
              <span style={{ color: 'var(--tekky-blue)', fontWeight: 700 }}>
                {formatPrice((order.amount_cents || 0) / 100)}
              </span>
            </div>
            <div style={{ marginTop: '0.4rem', fontSize: '0.82rem', color: 'var(--muted)', display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
              <span style={{ textTransform: 'capitalize' }}>{order.status}</span>
              <span>{order.created_at ? new Date(order.created_at).toLocaleDateString() : ''}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SettingsTab({ user, onUpdated }) {
  const hasPassword = user.has_password !== false;
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccess('');
    setError('');
    if (newPassword !== confirmPass) {
      setError('New passwords do not match.');
      return;
    }
    setSaving(true);
    try {
      await changePassword({
        oldPassword,
        newPassword,
        confirmPassword: confirmPass,
      });
      setSuccess(hasPassword ? 'Password changed successfully.' : 'Password set successfully.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPass('');
      onUpdated?.();
    } catch (err) {
      const data = err?.data?.error?.detail ?? err?.data;
      if (data?.old_password) setError(Array.isArray(data.old_password) ? data.old_password[0] : data.old_password);
      else if (data?.new_password) setError(Array.isArray(data.new_password) ? data.new_password[0] : data.new_password);
      else setError(formatApiError(err, 'Could not update password.'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={cardStyle}>
      <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", color: 'var(--tekky-blue)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
        {hasPassword ? 'Change Password' : 'Set a Password'}
      </h2>
      <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
        {hasPassword
          ? 'Update the password you use to sign in with email.'
          : 'This account was created with Google or Apple. Set a password if you also want email sign-in.'}
      </p>
      {banner('success', success)}
      {banner('error', error)}

      {hasPassword && (
        <>
          <label htmlFor="fan-old-pass">Current Password</label>
          <input id="fan-old-pass" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required autoComplete="current-password" />
        </>
      )}

      <label htmlFor="fan-new-pass">New Password</label>
      <input id="fan-new-pass" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} autoComplete="new-password" />

      <label htmlFor="fan-confirm-pass">Confirm New Password</label>
      <input id="fan-confirm-pass" type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} required minLength={8} autoComplete="new-password" />

      <button type="submit" className="cta" disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {saving ? <><span className="spinner" /> Updating…</> : hasPassword ? 'Update Password' : 'Set Password'}
      </button>

      {hasPassword && (
        <p style={{ marginTop: '1.2rem', fontSize: '0.85rem', color: 'var(--muted)' }}>
          <Link href="/forgot-password?from=fan" style={{ color: 'var(--tekky-blue)', fontWeight: 600 }}>
            Forgot your password?
          </Link>
        </p>
      )}
    </form>
  );
}

export default function FanAccountClient() {
  const router = useRouter();
  const { user, loading, refreshUser, logout } = useAuth();
  const [tab, setTab] = useState('profile');

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/fan/login');
      return;
    }
    if (user.role !== 'fan') {
      router.replace(user.role === 'admin' ? '/admin' : '/user');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'fan') {
    return (
      <main style={{ minHeight: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="spinner" style={{ width: 32, height: 32, borderWidth: 3, margin: 0 }} />
      </main>
    );
  }

  const displayName = user.name || user.email;

  return (
    <>
      <header style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="hero" style={{ position: 'relative', zIndex: 2, maxWidth: 980, padding: '0 1rem' }}>
          <h1>FAN ACCOUNT</h1>
          <p className="tagline">{displayName}</p>
          <p className="subtext">{user.email}</p>
        </div>
      </header>

      <main style={{ maxWidth: 640, margin: '2.8rem auto 5rem', padding: '0 1.25rem' }}>
        <GlowDivider />

        <div
          style={{
            display: 'flex',
            gap: 0,
            margin: '2rem 0 1.5rem',
            background: 'var(--card)',
            border: '1px solid var(--line-blue)',
            borderRadius: 10,
            overflow: 'hidden',
          }}
        >
          {TABS.map((item) => {
            const active = tab === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key)}
                style={{
                  flex: 1,
                  padding: '0.8rem 0.6rem',
                  border: 'none',
                  borderBottom: active ? '2px solid var(--tekky-blue)' : '2px solid transparent',
                  background: active ? 'rgba(61, 139, 255, 0.12)' : 'transparent',
                  color: active ? 'var(--fg)' : 'var(--muted)',
                  fontFamily: 'inherit',
                  fontWeight: active ? 600 : 400,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                }}
              >
                <i className={item.icon} />
                {item.label}
              </button>
            );
          })}
        </div>

        {tab === 'profile' && <ProfileForm user={user} onUpdated={refreshUser} />}
        {tab === 'orders' && <OrdersTab />}
        {tab === 'settings' && <SettingsTab user={user} onUpdated={refreshUser} />}

        <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
          <button
            type="button"
            onClick={logout}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--muted)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '0.9rem',
            }}
          >
            <i className="fa-solid fa-right-from-bracket" style={{ marginRight: '0.4rem' }} />
            Log out
          </button>
        </div>

        <GlowDivider />

        <div className="sec-cta">
          <Link className="cta" href="/shop">Shop Merch</Link>
        </div>
      </main>
      <style>{`
        @media (max-width: 600px) {
          .fan-addr-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
