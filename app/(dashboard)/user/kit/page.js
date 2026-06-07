'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import {
  getMyKit,
  selectKit,
  lockKit,
  submitKitOrder,
  updateKitOrder,
} from '@/services/kitsApi';

// ─── Constants ────────────────────────────────────────────────────────────────

const JERSEY_SHORTS_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const SOCKS_SIZES = ['S', 'M', 'L', 'XL'];

const ALL_KITS = [
  ...Array.from({ length: 8 }, (_, i) => `north-${i + 1}`),
  ...Array.from({ length: 8 }, (_, i) => `south-${i + 1}`),
];

// ─── Shared primitives ────────────────────────────────────────────────────────

function Card({ children, style }) {
  return (
    <div style={{
      background: '#000',
      border: '1px solid rgba(0,116,255,0.2)',
      borderRadius: 12,
      padding: '1.75rem',
      boxShadow: '0 0 20px rgba(0,116,255,0.05)',
      ...style,
    }}>
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

function Banner({ type, children }) {
  const styles = {
    success: { bg: 'rgba(0,200,100,0.1)',  border: 'rgba(0,200,100,0.35)',  color: '#00c864', icon: 'fa-solid fa-circle-check' },
    error:   { bg: 'rgba(255,60,60,0.1)',  border: 'rgba(255,60,60,0.35)',  color: '#ff6b6b', icon: 'fa-solid fa-circle-xmark' },
    info:    { bg: 'rgba(0,116,255,0.08)', border: 'rgba(0,116,255,0.3)',   color: '#60a0ff', icon: 'fa-solid fa-circle-info'  },
    warn:    { bg: 'rgba(255,180,0,0.1)',  border: 'rgba(255,180,0,0.35)',  color: '#ffb400', icon: 'fa-solid fa-triangle-exclamation' },
  };
  const s = styles[type] || styles.info;
  if (!children) return null;
  return (
    <div style={{
      background: s.bg, border: `1px solid ${s.border}`, borderRadius: 8,
      padding: '0.75rem 1rem', color: s.color, fontSize: '0.88rem',
      marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
    }}>
      <i className={s.icon} />
      <span>{children}</span>
    </div>
  );
}

function SizeDropdown({ label, value, onChange, options, disabled }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{
        display: 'block', fontSize: '0.78rem', color: 'var(--muted)',
        textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600,
        marginBottom: '0.4rem',
      }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={{ width: '100%', boxSizing: 'border-box', opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : undefined }}
      >
        <option value="">— select size —</option>
        {options.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>
  );
}

// ─── Locked kit display (shared for captain + player) ─────────────────────────

function LockedKitDisplay({ kitSlug }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: '0.75rem', marginBottom: '1.5rem',
    }}>
      <div style={{
        position: 'relative', width: 200, height: 200,
        borderRadius: 12,
        border: '2px solid rgba(0,200,100,0.5)',
        overflow: 'hidden',
        boxShadow: '0 0 30px rgba(0,200,100,0.15)',
      }}>
        <Image
          src={`/images/kits/${kitSlug}.webp`}
          alt={`Kit ${kitSlug}`}
          fill
          style={{ objectFit: 'contain' }}
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <span style={{
          fontSize: '0.75rem', fontFamily: "'Bebas Neue', sans-serif",
          letterSpacing: '1.5px', textTransform: 'uppercase',
          color: '#00c864', background: 'rgba(0,200,100,0.1)',
          border: '1px solid rgba(0,200,100,0.3)', borderRadius: 4,
          padding: '0.2rem 0.6rem',
        }}>
          <i className="fa-solid fa-lock" style={{ marginRight: '0.4rem', fontSize: '0.65rem' }} />
          Locked — {kitSlug}
        </span>
      </div>
    </div>
  );
}

// ─── Size order form ─────────────────────────────────────────────────────────

function KitOrderForm({ existingOrder, maxPlayers, onSaved }) {
  const [jerseySize, setJerseySize] = useState(existingOrder?.jersey_size || '');
  const [shortsSize, setShortsSize] = useState(existingOrder?.shorts_size || '');
  const [socksSize,  setSocksSize]  = useState(existingOrder?.socks_size  || '');
  const [nameOnKit,  setNameOnKit]  = useState(existingOrder?.name_on_kit || '');
  const [numOnKit,   setNumOnKit]   = useState(existingOrder?.number_on_kit ?? '');

  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState('');
  const [error,   setError]   = useState('');

  const isUpdate = !!existingOrder;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!jerseySize || !shortsSize || !socksSize) {
      setError('Please select all three sizes.');
      return;
    }
    setSaving(true);
    setSuccess('');
    setError('');

    const payload = {
      jersey_size: jerseySize,
      shorts_size: shortsSize,
      socks_size:  socksSize,
      name_on_kit: nameOnKit.trim(),
      number_on_kit: numOnKit !== '' ? parseInt(numOnKit, 10) : null,
    };

    try {
      const fn = isUpdate ? updateKitOrder : submitKitOrder;
      await fn(payload);
      setSuccess(isUpdate ? 'Kit order updated.' : 'Kit order submitted!');
      if (onSaved) onSaved();
    } catch (err) {
      const data = err?.data;
      if (data?.number_on_kit) {
        setError(Array.isArray(data.number_on_kit) ? data.number_on_kit[0] : data.number_on_kit);
      } else if (data?.detail) {
        setError(data.detail);
      } else if (typeof data === 'object') {
        const first = Object.values(data).flat()[0];
        setError(typeof first === 'string' ? first : 'Failed to save order. Please try again.');
      } else {
        setError('Failed to save order. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Banner type="success">{success}</Banner>
      <Banner type="error">{error}</Banner>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
        <SizeDropdown
          label="Jersey Size"
          value={jerseySize}
          onChange={setJerseySize}
          options={JERSEY_SHORTS_SIZES}
        />
        <SizeDropdown
          label="Shorts Size"
          value={shortsSize}
          onChange={setShortsSize}
          options={JERSEY_SHORTS_SIZES}
        />
        <SizeDropdown
          label="Socks Size"
          value={socksSize}
          onChange={setSocksSize}
          options={SOCKS_SIZES}
        />
        <div style={{ marginBottom: '1rem' }}>
          <label style={{
            display: 'block', fontSize: '0.78rem', color: 'var(--muted)',
            textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600,
            marginBottom: '0.4rem',
          }}>
            Number on Kit <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>(optional, 1–{maxPlayers})</span>
          </label>
          <input
            type="number"
            min={1}
            max={maxPlayers}
            value={numOnKit}
            onChange={(e) => setNumOnKit(e.target.value)}
            placeholder={`1 – ${maxPlayers}`}
            style={{ width: '100%', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{
          display: 'block', fontSize: '0.78rem', color: 'var(--muted)',
          textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600,
          marginBottom: '0.4rem',
        }}>
          Name on Kit <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>(optional, max 20 chars)</span>
        </label>
        <input
          type="text"
          value={nameOnKit}
          onChange={(e) => setNameOnKit(e.target.value)}
          placeholder="Your name or nickname"
          maxLength={20}
          style={{ width: '100%', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="submit"
          className="cta"
          disabled={saving}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.75rem' }}
        >
          {saving ? (
            <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving…</>
          ) : (
            <><i className={isUpdate ? 'fa-solid fa-floppy-disk' : 'fa-solid fa-paper-plane'} /> {isUpdate ? 'Update Order' : 'Submit Order'}</>
          )}
        </button>
      </div>
    </form>
  );
}

// ─── Captain kit picker ────────────────────────────────────────────────────────

function KitPicker({ currentSlug, onSelect, disabled }) {
  const [selected, setSelected] = useState(currentSlug || '');
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState('');

  const northKits = ALL_KITS.filter((k) => k.startsWith('north'));
  const southKits = ALL_KITS.filter((k) => k.startsWith('south'));

  async function handleConfirm() {
    if (!selected) return;
    setSaving(true);
    setError('');
    try {
      await selectKit(selected);
      if (onSelect) onSelect(selected);
    } catch (err) {
      setError(err?.message || 'Failed to save selection.');
    } finally {
      setSaving(false);
    }
  }

  function KitGrid({ kits, title }) {
    return (
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{
          fontSize: '0.78rem', color: 'var(--muted)', textTransform: 'uppercase',
          letterSpacing: '0.5px', fontWeight: 600, marginBottom: '0.75rem',
        }}>
          {title}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.75rem' }}>
          {kits.map((slug) => {
            const isSelected = selected === slug;
            return (
              <button
                key={slug}
                type="button"
                onClick={() => !disabled && setSelected(slug)}
                disabled={disabled}
                style={{
                  position: 'relative',
                  background: isSelected ? 'rgba(0,116,255,0.12)' : '#050505',
                  border: isSelected
                    ? '2px solid var(--tekky-blue)'
                    : '2px solid rgba(255,255,255,0.08)',
                  borderRadius: 10,
                  padding: '0.5rem',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s',
                  boxShadow: isSelected ? '0 0 16px rgba(0,116,255,0.3)' : 'none',
                }}
              >
                <div style={{ position: 'relative', width: '100%', paddingBottom: '100%' }}>
                  <Image
                    src={`/images/kits/${slug}.webp`}
                    alt={slug}
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                {isSelected && (
                  <div style={{
                    position: 'absolute', top: 4, right: 4,
                    background: 'var(--tekky-blue)', borderRadius: '50%',
                    width: 18, height: 18,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <i className="fa-solid fa-check" style={{ fontSize: '0.6rem', color: '#fff' }} />
                  </div>
                )}
                <p style={{ margin: '0.4rem 0 0', fontSize: '0.65rem', color: isSelected ? 'var(--tekky-blue)' : 'var(--muted)', textAlign: 'center' }}>
                  {slug}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Banner type="error">{error}</Banner>
      <KitGrid kits={northKits} title="North Division Kits" />
      <KitGrid kits={southKits} title="South Division Kits" />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="button"
          className="cta"
          onClick={handleConfirm}
          disabled={!selected || saving || disabled}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.75rem' }}
        >
          {saving ? (
            <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving…</>
          ) : (
            <><i className="fa-solid fa-check" /> Confirm Selection</>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Lock confirmation modal ─────────────────────────────────────────────────

function LockModal({ kitSlug, onConfirm, onCancel, locking }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
    }}>
      <div style={{
        background: '#0a0a0a',
        border: '1px solid rgba(0,116,255,0.3)',
        borderRadius: 14,
        padding: '2rem',
        maxWidth: 440,
        width: '100%',
        boxShadow: '0 0 60px rgba(0,0,0,0.8)',
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🔒</div>
        <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', letterSpacing: '1.5px', margin: '0 0 0.75rem', color: '#fff' }}>
          Lock Kit Selection?
        </h3>
        <p style={{ fontSize: '0.9rem', color: '#aaa', lineHeight: 1.6, marginBottom: '0.5rem' }}>
          You are about to lock <strong style={{ color: '#fff' }}>{kitSlug}</strong> as your team kit.
        </p>
        <p style={{ fontSize: '0.88rem', color: '#ff9090', lineHeight: 1.6, marginBottom: '1.75rem' }}>
          <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '0.4rem' }} />
          This cannot be undone. Once locked, your team players will be notified and can submit their sizes.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={locking}
            style={{
              padding: '0.6rem 1.25rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)',
              background: 'transparent', color: 'var(--muted)', cursor: 'pointer',
              fontSize: '0.88rem', fontFamily: 'inherit',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={locking}
            style={{
              padding: '0.6rem 1.5rem', borderRadius: 8,
              background: locking ? 'rgba(0,116,255,0.3)' : 'var(--tekky-blue)',
              border: 'none', color: '#fff', cursor: locking ? 'not-allowed' : 'pointer',
              fontSize: '0.88rem', fontWeight: 700, fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}
          >
            {locking ? (
              <><span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Locking…</>
            ) : (
              <><i className="fa-solid fa-lock" /> Yes, Lock It</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function KitPage() {
  const { user, loading: authLoading } = useAuth();

  const [kitData,    setKitData]    = useState(null);  // { kit, my_order, is_captain, team_name, max_players }
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError,   setPageError]   = useState('');
  const [showLockModal, setShowLockModal] = useState(false);
  const [locking,       setLocking]      = useState(false);
  const [lockError,     setLockError]    = useState('');

  const load = useCallback(async () => {
    setPageLoading(true);
    setPageError('');
    try {
      const data = await getMyKit();
      setKitData(data);
    } catch (err) {
      if (err?.status === 404) {
        setKitData(null); // user has no team
      } else {
        setPageError('Failed to load kit information.');
      }
    } finally {
      setPageLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && user) load();
  }, [authLoading, user, load]);

  async function handleLock() {
    setLocking(true);
    setLockError('');
    try {
      await lockKit();
      setShowLockModal(false);
      await load();
    } catch (err) {
      setLockError(err?.message || 'Failed to lock kit. Please try again.');
      setLocking(false);
    }
  }

  // ── Loading state
  if (authLoading || pageLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
        <span className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
      </div>
    );
  }

  if (pageError) {
    return <Banner type="error">{pageError}</Banner>;
  }

  // ── No team
  if (!kitData) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <i className="fa-solid fa-shirt" style={{ fontSize: '2.5rem', color: 'var(--muted)', marginBottom: '1rem', display: 'block' }} />
          <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
            You are not attached to any team yet. Join a team to participate in kit selection.
          </p>
        </div>
      </Card>
    );
  }

  const { kit, my_order, is_captain, team_name, max_players } = kitData;
  const kitLocked = kit?.is_locked ?? false;

  return (
    <div style={{ maxWidth: 780 }}>

      {showLockModal && (
        <LockModal
          kitSlug={kit?.kit_slug}
          onConfirm={handleLock}
          onCancel={() => { setShowLockModal(false); setLockError(''); }}
          locking={locking}
        />
      )}

      {/* ── CAPTAIN SECTION ─────────────────────────────────────────────── */}
      {is_captain && (
        <>
          {/* Kit selection card */}
          <Card style={{ marginBottom: '1.5rem' }}>
            <SectionHeading>
              {kitLocked ? 'Selected Kit' : 'Choose Your Team Kit'}
            </SectionHeading>

            {kitLocked ? (
              <>
                <Banner type="success">
                  Kit locked. Your players can now submit their sizes.
                </Banner>
                <LockedKitDisplay kitSlug={kit.kit_slug} />
              </>
            ) : (
              <>
                <Banner type="info">
                  Select a kit for your team, then lock your choice. Once locked, players will be able to see the kit and submit their sizes.
                </Banner>
                {lockError && <Banner type="error">{lockError}</Banner>}
                {kit?.kit_slug && (
                  <div style={{ marginBottom: '1rem' }}>
                    <Banner type="warn">
                      Current selection: <strong>{kit.kit_slug}</strong> — not yet locked.
                    </Banner>
                  </div>
                )}
                <KitPicker
                  currentSlug={kit?.kit_slug}
                  onSelect={() => load()}
                  disabled={kitLocked}
                />
                {kit?.kit_slug && (
                  <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(0,116,255,0.15)', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => setShowLockModal(true)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.6rem 1.75rem', borderRadius: 8,
                        background: 'rgba(240,180,41,0.12)',
                        border: '1px solid rgba(240,180,41,0.4)',
                        color: '#f0b429', fontSize: '0.9rem', fontWeight: 700,
                        cursor: 'pointer', fontFamily: 'inherit',
                      }}
                    >
                      <i className="fa-solid fa-lock" /> Lock Kit Selection
                    </button>
                  </div>
                )}
              </>
            )}
          </Card>

          {/* Captain's own size order — only visible after kit is locked */}
          {kitLocked && (
            <Card>
              <SectionHeading>Your Kit Sizes</SectionHeading>
              {my_order ? (
                <Banner type="success">You have submitted your sizes. You can update them below.</Banner>
              ) : (
                <Banner type="info">The kit is locked. Submit your size order below.</Banner>
              )}
              <KitOrderForm
                existingOrder={my_order}
                maxPlayers={max_players}
                onSaved={load}
              />
            </Card>
          )}
        </>
      )}

      {/* ── PLAYER SECTION ─────────────────────────────────────────────────── */}
      {!is_captain && (
        <>
          <Card style={{ marginBottom: '1.5rem' }}>
            <SectionHeading>Team Kit — {team_name}</SectionHeading>

            {!kit ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <i className="fa-solid fa-clock" style={{ fontSize: '2rem', color: '#ffb400', marginBottom: '0.75rem', display: 'block' }} />
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                  Your captain has not selected a kit yet. Check back later.
                </p>
              </div>
            ) : !kitLocked ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <i className="fa-solid fa-hourglass-half" style={{ fontSize: '2rem', color: '#ffb400', marginBottom: '0.75rem', display: 'block' }} />
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                  Your captain is still finalising the kit choice. You will be able to submit your sizes once the kit is locked.
                </p>
              </div>
            ) : (
              <LockedKitDisplay kitSlug={kit.kit_slug} />
            )}
          </Card>

          {kitLocked && (
            <Card>
              <SectionHeading>Your Kit Sizes</SectionHeading>
              {my_order ? (
                <Banner type="success">You have submitted your sizes. You can update them below.</Banner>
              ) : (
                <Banner type="info">Submit your size preferences for the team kit.</Banner>
              )}
              <KitOrderForm
                existingOrder={my_order}
                maxPlayers={max_players}
                onSaved={load}
              />
            </Card>
          )}
        </>
      )}
    </div>
  );
}
