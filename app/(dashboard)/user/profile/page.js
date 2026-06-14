'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  updateUserInfo,
  updatePlayerProfile,
  changePassword,
  deleteAccount,
} from '@/services/userApi';
import { submitProfileLink, submitTeamLink } from '@/services/profilesApi';
import { useRouter } from 'next/navigation';

// ─── Responsive styles ────────────────────────────────────────────────────────

const STYLES = `
  .profile-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 1.5rem;
  }
  .profile-tab-bar {
    display: flex;
    gap: 0;
    margin-bottom: 1.5rem;
    background: #0a0a0a;
    border: 1px solid rgba(0,116,255,0.2);
    border-radius: 10px;
    overflow: hidden;
  }
  .profile-tab-btn {
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
  .profile-tab-btn .tab-label { display: inline; }
  .profile-save-btn {
    display: flex;
    justify-content: flex-end;
  }
  .profile-save-btn button {
    width: auto;
  }
  @media (max-width: 600px) {
    .profile-grid {
      grid-template-columns: 1fr;
    }
    .profile-tab-btn {
      flex-direction: column;
      gap: 0.3rem;
      padding: 0.65rem 0.4rem;
      font-size: 0.7rem;
    }
    .profile-tab-btn .tab-label {
      font-size: 0.68rem;
      letter-spacing: 0;
    }
    .profile-save-btn {
      justify-content: stretch;
    }
    .profile-save-btn button {
      width: 100%;
      justify-content: center;
    }
    .profile-security-card,
    .profile-account-card {
      max-width: 100% !important;
    }
  }
`;

// ─── Shared primitives ────────────────────────────────────────────────────────

function Card({ children, style, className }) {
  return (
    <div
      className={className}
      style={{
        background: '#000',
        border: '1px solid rgba(0,116,255,0.2)',
        borderRadius: 12,
        padding: '1.75rem',
        boxShadow: '0 0 20px rgba(0,116,255,0.05)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionHeading({ children }) {
  return (
    <h3 style={{
      fontFamily: "'Bebas Neue', sans-serif",
      fontSize: '1.1rem',
      letterSpacing: '1.5px',
      color: 'var(--tekky-blue)',
      textTransform: 'uppercase',
      margin: '0 0 1.25rem',
      paddingBottom: '0.4rem',
      borderBottom: '1px solid rgba(0,116,255,0.15)',
    }}>
      {children}
    </h3>
  );
}

function FormField({ label, children }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{
        display: 'block', fontSize: '0.78rem', color: 'var(--muted)',
        textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, marginBottom: '0.4rem',
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({ style, ...props }) {
  return <input style={{ width: '100%', boxSizing: 'border-box', ...style }} {...props} />;
}

function Select({ children, ...props }) {
  return (
    <select style={{ width: '100%', boxSizing: 'border-box' }} {...props}>
      {children}
    </select>
  );
}

function Textarea({ ...props }) {
  return (
    <textarea
      style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical', minHeight: 80 }}
      {...props}
    />
  );
}

function SuccessBanner({ msg }) {
  if (!msg) return null;
  return (
    <div style={{
      background: 'rgba(0,200,100,0.1)', border: '1px solid rgba(0,200,100,0.35)',
      borderRadius: 8, padding: '0.75rem 1rem', color: '#00c864',
      fontSize: '0.88rem', marginBottom: '1.25rem',
    }}>
      <i className="fa-solid fa-circle-check" style={{ marginRight: '0.5rem' }} />
      {msg}
    </div>
  );
}

function ErrorBanner({ msg }) {
  if (!msg) return null;
  return (
    <div style={{
      background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.35)',
      borderRadius: 8, padding: '0.75rem 1rem', color: '#ff6b6b',
      fontSize: '0.88rem', marginBottom: '1.25rem',
    }}>
      <i className="fa-solid fa-circle-xmark" style={{ marginRight: '0.5rem' }} />
      {msg}
    </div>
  );
}

// ─── Tabs config ──────────────────────────────────────────────────────────────

const TABS = [
  { key: 'info',     label: 'Personal Info', icon: 'fa-solid fa-id-card' },
  { key: 'links',    label: 'Links',         icon: 'fa-solid fa-link'    },
  { key: 'security', label: 'Security',      icon: 'fa-solid fa-lock'    },
  { key: 'account',  label: 'Account',       icon: 'fa-solid fa-gear'    },
];

// ─── Personal Info Tab ────────────────────────────────────────────────────────

function PersonalInfoTab({ user, onUpdated }) {
  const profile  = user?.profile;
  const topRef   = useRef(null);

  const [name,      setName]      = useState(user?.name                  || '');
  const [phone,     setPhone]     = useState(user?.phone                 || '');
  const [gender,    setGender]    = useState(user?.gender                || '');
  const [bio,       setBio]       = useState(profile?.bio                || '');
  const [dob,       setDob]       = useState(profile?.date_of_birth      || '');
  const [division,  setDivision]  = useState(profile?.preferred_division || '');
  const [instagram, setInstagram] = useState(profile?.instagram          || '');

  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState('');
  const [error,   setError]   = useState('');

  function scrollToTop() {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');
    try {
      await updateUserInfo({ name, phone, gender: gender || null });
      if (profile) {
        await updatePlayerProfile({
          bio:                bio       || null,
          date_of_birth:      dob       || null,
          preferred_division: division  || null,
          instagram:          instagram || null,
        });
      }
      setSuccess('Profile updated successfully.');
      if (onUpdated) onUpdated();
    } catch (err) {
      const detail = err?.data;
      if (detail && typeof detail === 'object') {
        const first = Object.values(detail).flat()[0];
        setError(typeof first === 'string' ? first : 'Failed to update profile.');
      } else {
        setError('Failed to update profile. Please try again.');
      }
    } finally {
      setSaving(false);
      scrollToTop();
    }
  }

  return (
    <form onSubmit={handleSave} ref={topRef}>
      <SuccessBanner msg={success} />
      <ErrorBanner   msg={error}   />

      {/* Account info */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <SectionHeading>Account Info</SectionHeading>
        <div className="profile-grid">
          <FormField label="Full Name">
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              minLength={2}
            />
          </FormField>
          <FormField label="Email">
            <Input
              type="email"
              value={user?.email || ''}
              disabled
              style={{ width: '100%', boxSizing: 'border-box', opacity: 0.5, cursor: 'not-allowed' }}
            />
          </FormField>
          <FormField label="Phone">
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
          </FormField>
          <FormField label="Gender">
            <Select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">— select —</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other / Prefer not to say</option>
            </Select>
          </FormField>
        </div>
      </Card>

      {/* Player profile fields */}
      {profile && (
        <Card style={{ marginBottom: '1.5rem' }}>
          <SectionHeading>Player Details</SectionHeading>
          <div className="profile-grid">
            <FormField label="Preferred Division">
              <Select value={division} onChange={(e) => setDivision(e.target.value)}>
                <option value="">— select —</option>
                <option value="north">North</option>
                <option value="south">South</option>
              </Select>
            </FormField>
            <FormField label="Date of Birth">
              <Input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </FormField>
            <FormField label="Instagram Handle (Optional)">
              <Input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@yourusername"
              />
            </FormField>
          </div>
          <FormField label="Bio">
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us a bit about yourself…"
            />
          </FormField>
        </Card>
      )}

      <div className="profile-save-btn">
        <button
          type="submit"
          className="cta"
          disabled={saving}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.75rem' }}
        >
          {saving ? (
            <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving…</>
          ) : (
            <><i className="fa-solid fa-floppy-disk" /> Save Changes</>
          )}
        </button>
      </div>
    </form>
  );
}

// ─── Security Tab ─────────────────────────────────────────────────────────────

function PasswordInput({ id, label, value, onChange, show, onToggle, placeholder, autoComplete }) {
  return (
    <FormField label={label}>
      <div style={{ position: 'relative' }}>
        <Input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          style={{ width: '100%', boxSizing: 'border-box', paddingRight: '2.6rem', marginBottom: 0 }}
        />
        <button
          type="button"
          onClick={onToggle}
          tabIndex={-1}
          style={{
            position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer',
            padding: 0, fontSize: '0.9rem', lineHeight: 1,
          }}
        >
          <i className={show ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'} />
        </button>
      </div>
    </FormField>
  );
}

function SecurityTab() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showOld,     setShowOld]     = useState(false);
  const [showNew,     setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving,      setSaving]      = useState(false);
  const [success,     setSuccess]     = useState('');
  const [error,       setError]       = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccess('');
    setError('');
    if (newPassword !== confirmPass) { setError('New passwords do not match.'); return; }
    setSaving(true);
    try {
      await changePassword({ oldPassword, newPassword, confirmPassword: confirmPass });
      setSuccess('Password changed successfully.');
      setOldPassword(''); setNewPassword(''); setConfirmPass('');
    } catch (err) {
      const data = err?.data;
      if (data?.old_password)      setError(Array.isArray(data.old_password)  ? data.old_password[0]  : data.old_password);
      else if (data?.new_password) setError(Array.isArray(data.new_password)  ? data.new_password[0]  : data.new_password);
      else if (data?.detail)       setError(data.detail);
      else                         setError('Failed to change password. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="profile-security-card" style={{ maxWidth: 520 }}>
      <SectionHeading>Change Password</SectionHeading>
      <SuccessBanner msg={success} />
      <ErrorBanner   msg={error}   />
      <form onSubmit={handleSubmit}>
        <PasswordInput
          id="old-password" label="Current Password" value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          show={showOld} onToggle={() => setShowOld((v) => !v)}
          placeholder="Enter current password" autoComplete="current-password"
        />
        <PasswordInput
          id="new-password" label="New Password" value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          show={showNew} onToggle={() => setShowNew((v) => !v)}
          placeholder="At least 8 characters" autoComplete="new-password"
        />
        <PasswordInput
          id="confirm-password" label="Confirm New Password" value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
          show={showConfirm} onToggle={() => setShowConfirm((v) => !v)}
          placeholder="Repeat new password" autoComplete="new-password"
        />
        <div className="profile-save-btn" style={{ marginTop: '0.5rem' }}>
          <button
            type="submit"
            className="cta"
            disabled={saving}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.75rem' }}
          >
            {saving ? (
              <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Updating…</>
            ) : (
              <><i className="fa-solid fa-key" /> Update Password</>
            )}
          </button>
        </div>
      </form>
    </Card>
  );
}

// ─── Account Tab ─────────────────────────────────────────────────────────────

function AccountTab() {
  const router = useRouter();
  const { logout } = useAuth();
  const [confirm,  setConfirm]  = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error,    setError]    = useState('');

  const CONFIRM_PHRASE = 'DELETE MY ACCOUNT';

  async function handleDelete(e) {
    e.preventDefault();
    if (confirm !== CONFIRM_PHRASE) { setError(`Please type exactly: ${CONFIRM_PHRASE}`); return; }
    setDeleting(true);
    setError('');
    try {
      await deleteAccount();
      logout();
      router.replace('/');
    } catch {
      setError('Failed to delete account. Please try again or contact support.');
      setDeleting(false);
    }
  }

  return (
    <div className="profile-account-card" style={{ maxWidth: 520 }}>
      <Card style={{ border: '1px solid rgba(255,60,60,0.25)' }}>
        <SectionHeading>Delete Account</SectionHeading>

        <div style={{
          background: 'rgba(255,60,60,0.07)', border: '1px solid rgba(255,60,60,0.2)',
          borderRadius: 8, padding: '1rem', marginBottom: '1.25rem',
          fontSize: '0.88rem', color: '#ff9090', lineHeight: 1.6,
        }}>
          <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '0.5rem', color: '#ff6b6b' }} />
          <strong>This action is permanent and irreversible.</strong> Your account, player profile, team memberships, applications, and all associated data will be deleted immediately. There is no recovery.
        </div>

        <ErrorBanner msg={error} />

        <form onSubmit={handleDelete}>
          <FormField label={`Type "${CONFIRM_PHRASE}" to confirm`}>
            <Input
              type="text"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder={CONFIRM_PHRASE}
              autoComplete="off"
            />
          </FormField>

          <div className="profile-save-btn" style={{ marginTop: '0.5rem' }}>
            <button
              type="submit"
              disabled={deleting || confirm !== CONFIRM_PHRASE}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                padding: '0.6rem 1.75rem',
                background: confirm === CONFIRM_PHRASE ? 'rgba(255,60,60,0.15)' : 'rgba(255,60,60,0.05)',
                border: '1px solid rgba(255,60,60,0.4)', borderRadius: 8,
                color: confirm === CONFIRM_PHRASE ? '#ff6b6b' : 'rgba(255,107,107,0.4)',
                fontSize: '0.88rem', fontWeight: 600,
                cursor: confirm === CONFIRM_PHRASE ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s', fontFamily: 'inherit',
              }}
            >
              {deleting ? (
                <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Deleting…</>
              ) : (
                <><i className="fa-solid fa-trash" /> Delete My Account</>
              )}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

// ─── Links Tab ────────────────────────────────────────────────────────────────

function LinksTab({ user, onUpdated }) {
  const profile    = user?.profile;
  const isCaptain  = user?.is_captain;

  const STATUS_MAP = {
    none:     { color: '#555',    label: 'Not submitted',   icon: 'fa-solid fa-circle-minus'  },
    pending:  { color: '#ffb400', label: 'Pending approval',icon: 'fa-solid fa-clock'          },
    approved: { color: '#00c864', label: 'Live on profile', icon: 'fa-solid fa-circle-check'  },
    rejected: { color: '#ff6b6b', label: 'Rejected',        icon: 'fa-solid fa-circle-xmark'  },
  };

  // ── Personal profile link ──
  const [pLink,    setPLink]    = useState(profile?.profile_link        || '');
  const [pSaving,  setPSaving]  = useState(false);
  const [pSuccess, setPSuccess] = useState('');
  const [pError,   setPError]   = useState('');
  const pStatus = profile?.profile_link_status || 'none';
  const pStatusInfo = STATUS_MAP[pStatus];

  async function handleProfileLink(e) {
    e.preventDefault();
    setPSaving(true); setPSuccess(''); setPError('');
    try {
      await submitProfileLink(pLink.trim() || null);
      setPSuccess(pLink.trim() ? 'Link submitted for approval.' : 'Link cleared.');
      if (onUpdated) onUpdated();
    } catch (err) {
      setPError(err?.message || 'Failed to submit link.');
    } finally {
      setPSaving(false);
    }
  }

  // ── Team link (captain only) ──
  const [tLink,    setTLink]    = useState('');
  const [tSaving,  setTSaving]  = useState(false);
  const [tSuccess, setTSuccess] = useState('');
  const [tError,   setTError]   = useState('');

  async function handleTeamLink(e) {
    e.preventDefault();
    setTSaving(true); setTSuccess(''); setTError('');
    try {
      await submitTeamLink(tLink.trim() || null);
      setTSuccess(tLink.trim() ? 'Team link submitted for approval.' : 'Team link cleared.');
    } catch (err) {
      setTError(err?.message || 'Failed to submit team link.');
    } finally {
      setTSaving(false);
    }
  }

  return (
    <div>
      {/* Personal profile link */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <SectionHeading>Personal Profile Link</SectionHeading>
        <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1rem', lineHeight: 1.6 }}>
          Add a link to your highlight reel, social page, or any football-related content.
          Once submitted, it will appear on your public profile after admin approval.
        </p>
        {pStatusInfo && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.85rem', color: pStatusInfo.color, fontWeight: 600 }}>
            <i className={pStatusInfo.icon} />
            Status: {pStatusInfo.label}
          </div>
        )}
        {pStatus === 'approved' && profile?.profile_link && (
          <div style={{ marginBottom: '1rem', padding: '0.6rem 0.9rem', background: 'rgba(0,200,100,0.08)', border: '1px solid rgba(0,200,100,0.25)', borderRadius: 8, fontSize: '0.83rem' }}>
            <i className="fa-solid fa-circle-check" style={{ color: '#00c864', marginRight: '0.5rem' }} />
            Live:{' '}
            <a href={profile.profile_link} target="_blank" rel="noreferrer" style={{ color: 'var(--tekky-blue)' }}>
              {profile.profile_link}
            </a>
          </div>
        )}
        <form onSubmit={handleProfileLink}>
          {pSuccess && <div style={{ background: 'rgba(0,200,100,0.1)', border: '1px solid rgba(0,200,100,0.3)', borderRadius: 8, padding: '0.65rem 1rem', color: '#00c864', fontSize: '0.85rem', marginBottom: '1rem' }}><i className="fa-solid fa-circle-check" style={{ marginRight: '0.4rem' }} />{pSuccess}</div>}
          {pError   && <div style={{ background: 'rgba(255,60,60,0.1)',  border: '1px solid rgba(255,60,60,0.3)',  borderRadius: 8, padding: '0.65rem 1rem', color: '#ff6b6b', fontSize: '0.85rem', marginBottom: '1rem' }}><i className="fa-solid fa-circle-xmark" style={{ marginRight: '0.4rem' }} />{pError}</div>}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, marginBottom: '0.4rem' }}>
              Profile URL
            </label>
            <input
              type="url"
              value={pLink}
              onChange={(e) => setPLink(e.target.value)}
              placeholder="https://youtube.com/your-highlights"
              style={{ width: '100%', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
            {pLink && (
              <button type="button" onClick={() => { setPLink(''); }} style={{ padding: '0.55rem 1rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'var(--muted)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.85rem' }}>
                Clear
              </button>
            )}
            <button type="submit" className="cta" disabled={pSaving} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 1.5rem' }}>
              {pSaving ? <><span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Submitting…</> : <><i className="fa-solid fa-paper-plane" /> Submit for Approval</>}
            </button>
          </div>
        </form>
      </Card>

      {/* Team link (captain only) */}
      {isCaptain && (
        <Card>
          <SectionHeading>Team Link</SectionHeading>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1rem', lineHeight: 1.6 }}>
            Add a link to your team's Instagram, WhatsApp group, highlight channel, or any team-related page.
            Once approved by admin, it will appear on all your players' public profiles.
          </p>
          <form onSubmit={handleTeamLink}>
            {tSuccess && <div style={{ background: 'rgba(0,200,100,0.1)', border: '1px solid rgba(0,200,100,0.3)', borderRadius: 8, padding: '0.65rem 1rem', color: '#00c864', fontSize: '0.85rem', marginBottom: '1rem' }}><i className="fa-solid fa-circle-check" style={{ marginRight: '0.4rem' }} />{tSuccess}</div>}
            {tError   && <div style={{ background: 'rgba(255,60,60,0.1)',  border: '1px solid rgba(255,60,60,0.3)',  borderRadius: 8, padding: '0.65rem 1rem', color: '#ff6b6b', fontSize: '0.85rem', marginBottom: '1rem' }}><i className="fa-solid fa-circle-xmark" style={{ marginRight: '0.4rem' }} />{tError}</div>}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, marginBottom: '0.4rem' }}>
                Team URL
              </label>
              <input
                type="url"
                value={tLink}
                onChange={(e) => setTLink(e.target.value)}
                placeholder="https://instagram.com/yourteam"
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="cta" disabled={tSaving} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 1.5rem' }}>
                {tSaving ? <><span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Submitting…</> : <><i className="fa-solid fa-paper-plane" /> Submit for Approval</>}
              </button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}

export default function PlayerProfilePage() {
  const { user, loading, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('info');

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
        <span className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
      </div>
    );
  }

  if (!user) return null;

  const initial   = (user.name || user.email || '?')[0].toUpperCase();
  const isCaptain = user.is_captain;

  return (
    <>
      <style>{STYLES}</style>

      <div style={{ maxWidth: 780 }}>

        {/* Profile header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div style={{
            width: 60, height: 60, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, var(--tekky-blue), #0044cc)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.7rem', color: '#fff',
            boxShadow: '0 0 20px rgba(0,116,255,0.35)',
          }}>
            {initial}
          </div>
          <div style={{ minWidth: 0 }}>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.55rem',
              margin: '0 0 0.3rem', letterSpacing: '1px',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {user.name || 'Player'}
            </h2>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{
                fontSize: '0.78rem', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '1.2px',
                color: isCaptain ? '#f0b429' : '#00c864',
                background: isCaptain ? 'rgba(240,180,41,0.1)' : 'rgba(0,200,100,0.1)',
                border: `1px solid ${isCaptain ? 'rgba(240,180,41,0.3)' : 'rgba(0,200,100,0.3)'}`,
                borderRadius: 4, padding: '0.2rem 0.55rem',
              }}>
                {isCaptain ? 'Captain' : 'Player'}
              </span>
              <span style={{
                fontSize: '0.78rem', color: 'var(--muted)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%',
              }}>
                {user.email}
              </span>
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div className="profile-tab-bar">
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="profile-tab-btn"
                style={{
                  background:   active ? 'rgba(0,116,255,0.12)' : 'transparent',
                  borderBottom: active ? '2px solid var(--tekky-blue)' : '2px solid transparent',
                  color:        active ? '#fff' : 'var(--muted)',
                  fontWeight:   active ? 600 : 400,
                }}
              >
                <i className={tab.icon} style={{ fontSize: '0.8rem' }} />
                <span className="tab-label">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {activeTab === 'info'     && <PersonalInfoTab user={user} onUpdated={refreshUser} />}
        {activeTab === 'links'    && <LinksTab user={user} onUpdated={refreshUser} />}
        {activeTab === 'security' && <SecurityTab />}
        {activeTab === 'account'  && <AccountTab />}
      </div>
    </>
  );
}
