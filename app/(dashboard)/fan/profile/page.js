'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { updateFanProfile, changePassword } from '@/services/userApi';
import { formatApiError } from '@/services/api';
import PremiumSelect, {
  PremiumInput as Input,
  PremiumField,
} from '@/components/dashboard/DashboardControls';

const STYLES = `
  .fan-profile-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 1.5rem;
  }
  .fan-profile-grid-span {
    grid-column: 1 / -1;
  }
  .fan-profile-tab-bar {
    display: flex;
    gap: 0;
    margin-bottom: 1.5rem;
    background: rgba(15, 23, 42, 0.65);
    border: 1px solid rgba(59, 130, 246, 0.3);
    border-radius: 10px;
    overflow: hidden;
  }
  .fan-profile-tab-btn {
    flex: 1;
    padding: 0.8rem 1rem;
    border: none;
    border-bottom: 2px solid transparent;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-family: inherit;
    white-space: nowrap;
  }
  .fan-profile-save-btn {
    display: flex;
    justify-content: flex-end;
  }
  @media (max-width: 600px) {
    .fan-profile-grid { grid-template-columns: 1fr; }
    .fan-profile-tab-btn { flex-direction: column; gap: 0.3rem; padding: 0.65rem 0.4rem; font-size: 0.68rem; }
    .fan-profile-save-btn { justify-content: stretch; }
    .fan-profile-save-btn button { width: 100%; justify-content: center; }
  }
`;

function Card({ children, style }) {
  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.65)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      borderRadius: 12,
      padding: '1.75rem',
      boxShadow: '0 0 20px rgba(61, 139, 255, 0.08)',
      ...style,
    }}>
      {children}
    </div>
  );
}

function SectionHeading({ children }) {
  return (
    <h3 style={{
      fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', letterSpacing: '1.5px',
      color: 'var(--tekky-blue)', textTransform: 'uppercase', margin: '0 0 1.25rem',
      paddingBottom: '0.4rem', borderBottom: '1px solid rgba(61, 139, 255, 0.15)',
    }}>
      {children}
    </h3>
  );
}

function SuccessBanner({ msg }) {
  if (!msg) return null;
  return (
    <div style={{ background: 'rgba(0,200,100,0.1)', border: '1px solid rgba(0,200,100,0.35)', borderRadius: 8, padding: '0.75rem 1rem', color: '#00c864', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
      <i className="fa-solid fa-circle-check" style={{ marginRight: '0.5rem' }} />{msg}
    </div>
  );
}

function ErrorBanner({ msg }) {
  if (!msg) return null;
  return (
    <div style={{ background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.35)', borderRadius: 8, padding: '0.75rem 1rem', color: '#ff6b6b', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
      <i className="fa-solid fa-circle-xmark" style={{ marginRight: '0.5rem' }} />{msg}
    </div>
  );
}

const TABS = [
  { key: 'info', label: 'Profile Info', icon: 'fa-solid fa-id-card' },
  { key: 'security', label: 'Security', icon: 'fa-solid fa-lock' },
];

const SHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

function ProfileInfoTab({ user, onUpdated }) {
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
    <form onSubmit={handleSubmit}>
      <SuccessBanner msg={success} />
      <ErrorBanner msg={error} />

      <Card style={{ marginBottom: '1.5rem' }}>
        <SectionHeading>Account Info</SectionHeading>
        <div className="fan-profile-grid">
          <PremiumField label="Full Name">
            <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" />
          </PremiumField>
          <PremiumField label="Email">
            <Input type="email" value={user.email} disabled />
          </PremiumField>
          <PremiumField label="Favorite Division">
            <PremiumSelect value={favoriteDivision} onChange={(e) => setFavoriteDivision(e.target.value)} placeholder="Select a court">
              <option value="north">North Court</option>
              <option value="south">South Court</option>
            </PremiumSelect>
          </PremiumField>
          <PremiumField label="Zip Code">
            <Input
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
              placeholder="60601"
              inputMode="numeric"
              maxLength={5}
              autoComplete="postal-code"
            />
          </PremiumField>
        </div>
      </Card>

      <Card style={{ marginBottom: '1.5rem' }}>
        <SectionHeading>Shipping & Sizing</SectionHeading>
        <div className="fan-profile-grid">
          <PremiumField label="Street Address" className="fan-profile-grid-span">
            <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Pitch Ave" autoComplete="street-address" />
          </PremiumField>
          <PremiumField label="Shirt Size">
            <PremiumSelect value={shirtSize} onChange={(e) => setShirtSize(e.target.value)} placeholder="Select a size">
              {SHIRT_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
            </PremiumSelect>
          </PremiumField>
          <PremiumField label="City">
            <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Chicago" autoComplete="address-level2" />
          </PremiumField>
          <PremiumField label="State">
            <Input value={state} onChange={(e) => setState(e.target.value)} placeholder="IL" autoComplete="address-level1" />
          </PremiumField>
        </div>
      </Card>

      <div className="fan-profile-save-btn">
        <button type="submit" className="cta" disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.75rem' }}>
          {saving ? (<><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving…</>) : (<><i className="fa-solid fa-floppy-disk" /> Save Changes</>)}
        </button>
      </div>
    </form>
  );
}

function SecurityTab({ user }) {
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
    if (newPassword !== confirmPass) { setError('New passwords do not match.'); return; }
    setSaving(true);
    try {
      await changePassword({ oldPassword, newPassword, confirmPassword: confirmPass });
      setSuccess(hasPassword ? 'Password changed successfully.' : 'Password set successfully.');
      setOldPassword(''); setNewPassword(''); setConfirmPass('');
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
    <Card style={{ maxWidth: 520 }}>
      <SectionHeading>{hasPassword ? 'Change Password' : 'Set a Password'}</SectionHeading>
      <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
        {hasPassword
          ? 'Update the password you use to sign in with email.'
          : 'This account was created with Google or Apple. Set a password if you also want email sign-in.'}
      </p>
      <SuccessBanner msg={success} />
      <ErrorBanner msg={error} />
      <form onSubmit={handleSubmit}>
        {hasPassword && (
          <PremiumField label="Current Password">
            <Input type="password" passwordToggle value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required autoComplete="current-password" />
          </PremiumField>
        )}
        <PremiumField label="New Password">
          <Input type="password" passwordToggle value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} autoComplete="new-password" />
        </PremiumField>
        <PremiumField label="Confirm New Password">
          <Input type="password" passwordToggle value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} required minLength={8} autoComplete="new-password" />
        </PremiumField>
        <div className="fan-profile-save-btn" style={{ marginTop: '0.5rem' }}>
          <button type="submit" className="cta" disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.75rem' }}>
            {saving ? (<><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Updating…</>) : (<><i className="fa-solid fa-key" /> {hasPassword ? 'Update Password' : 'Set Password'}</>)}
          </button>
        </div>
      </form>
      {hasPassword && (
        <p style={{ marginTop: '1.2rem', fontSize: '0.85rem', color: 'var(--muted)' }}>
          <a href="/forgot-password?from=fan" style={{ color: 'var(--tekky-blue)', fontWeight: 600 }}>Forgot your password?</a>
        </p>
      )}
    </Card>
  );
}

export default function FanProfilePage() {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('info');

  if (!loading && user && user.role !== 'fan') {
    router.replace(user.role === 'admin' ? '/admin' : '/user');
    return null;
  }

  if (loading || !user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
        <span className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
      </div>
    );
  }

  return (
    <>
      <style>{STYLES}</style>
      <div style={{ maxWidth: 780 }}>
        <div className="fan-profile-tab-bar">
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="fan-profile-tab-btn"
                style={{
                  background: active ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                  borderBottom: active ? '2px solid var(--tekky-blue)' : '2px solid transparent',
                  color: active ? 'var(--ad-fg)' : 'var(--muted)',
                  fontWeight: active ? 600 : 400,
                }}
              >
                <i className={tab.icon} style={{ fontSize: '0.8rem' }} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'info' && <ProfileInfoTab user={user} onUpdated={refreshUser} />}
        {activeTab === 'security' && <SecurityTab user={user} />}
      </div>
    </>
  );
}
