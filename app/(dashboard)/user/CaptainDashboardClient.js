'use client';

import { useState } from 'react';
import Link from 'next/link';

// ─── Waiver gate modal ────────────────────────────────────────────────────────
// Shown when an unsigned captain clicks any locked invite action.

function WaiverGateModal({ onClose }) {
  return (
    <div
      style={{
        position:        'fixed',
        inset:           0,
        background:      'rgba(0,0,0,0.72)',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        zIndex:          200,
        padding:         '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          position:     'relative',
          background:   '#0a0a0a',
          border:       '1px solid rgba(255,180,0,0.22)',
          borderRadius: 14,
          padding:      '2rem 1.75rem',
          maxWidth:     380,
          width:        '100%',
          boxShadow:    '0 24px 64px rgba(0,0,0,0.65), 0 0 32px rgba(255,180,0,0.07)',
          textAlign:    'center',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position:   'absolute',
            top:        '0.85rem',
            right:      '0.85rem',
            background: 'none',
            border:     'none',
            color:      'var(--muted)',
            cursor:     'pointer',
            fontSize:   '0.85rem',
            padding:    '0.2rem 0.4rem',
          }}
          aria-label="Close"
        >
          <i className="fa-solid fa-xmark" />
        </button>

        {/* Icon */}
        <div style={{
          width:          56,
          height:         56,
          borderRadius:   '50%',
          background:     'rgba(255,180,0,0.09)',
          border:         '2px solid rgba(255,180,0,0.28)',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          margin:         '0 auto 1.25rem',
        }}>
          <i className="fa-solid fa-file-signature" style={{ color: '#ffb400', fontSize: '1.3rem' }} />
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily:    "'Bebas Neue', sans-serif",
          fontSize:      '1.55rem',
          letterSpacing: '1px',
          color:         'var(--fg)',
          margin:        '0 0 0.65rem',
        }}>
          Waiver Required
        </h3>

        {/* Body */}
        <p style={{
          color:      'var(--muted)',
          fontSize:   '0.875rem',
          lineHeight: 1.65,
          margin:     '0 0 1.75rem',
        }}>
          You must sign the participant waiver before you can invite players or manage your team roster.
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'center' }}>
          <button
            onClick={onClose}
            style={{
              padding:     '0.6rem 1.2rem',
              background:  'transparent',
              border:      '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8,
              color:       'var(--muted)',
              fontSize:    '0.875rem',
              cursor:      'pointer',
              fontFamily:  'inherit',
              transition:  'border-color 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
          >
            Not Now
          </button>
          <Link
            href="/user/waiver"
            style={{
              display:        'inline-flex',
              alignItems:     'center',
              gap:            '0.4rem',
              padding:        '0.6rem 1.25rem',
              background:     '#ffb400',
              border:         '1px solid #ffb400',
              borderRadius:   8,
              color:          '#000',
              fontSize:       '0.875rem',
              fontWeight:     700,
              cursor:         'pointer',
              fontFamily:     "'Bebas Neue', sans-serif",
              letterSpacing:  '0.8px',
              textDecoration: 'none',
            }}
          >
            Sign Waiver
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Locked action button ─────────────────────────────────────────────────────
// Renders a greyed-out button that opens WaiverGateModal on click.

function LockedButton({ icon, label, onActivate }) {
  return (
    <button
      onClick={onActivate}
      title="Waiver required"
      style={{
        display:        'flex',
        alignItems:     'center',
        gap:            '0.55rem',
        padding:        '0.65rem 1.15rem',
        background:     'rgba(255,255,255,0.03)',
        border:         '1px solid rgba(255,255,255,0.08)',
        borderRadius:   8,
        color:          'rgba(255,255,255,0.25)',
        fontSize:       '0.875rem',
        cursor:         'pointer',
        fontFamily:     'inherit',
        position:       'relative',
        transition:     'border-color 0.15s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,180,0,0.3)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
    >
      <i className={icon} style={{ fontSize: '0.82rem' }} />
      {label}
      {/* Lock badge */}
      <i
        className="fa-solid fa-lock"
        style={{
          fontSize:    '0.62rem',
          color:       'rgba(255,180,0,0.6)',
          marginLeft:  '0.25rem',
        }}
      />
    </button>
  );
}

// ─── Captain tools card ───────────────────────────────────────────────────────

function CaptainToolsCard({ waiverSigned }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div style={{
        background:   'rgba(0,0,0,0.45)',
        border:       '1px solid rgba(0,116,255,0.18)',
        borderRadius: 12,
        overflow:     'hidden',
      }}>
        {/* Card header */}
        <div style={{
          padding:      '1rem 1.5rem',
          borderBottom: '1px solid rgba(0,116,255,0.1)',
          display:      'flex',
          alignItems:   'center',
          gap:          '0.65rem',
        }}>
          <i className="fa-solid fa-shield-halved" style={{ color: 'var(--tekky-blue)', fontSize: '0.95rem' }} />
          <h3 style={{
            fontFamily:    "'Bebas Neue', sans-serif",
            fontSize:      '1.1rem',
            letterSpacing: '1px',
            color:         'var(--fg)',
            margin:        0,
          }}>
            Captain Tools
          </h3>

          {/* Waiver lock badge when applicable */}
          {!waiverSigned && (
            <span style={{
              marginLeft:    'auto',
              fontSize:      '0.68rem',
              fontWeight:    700,
              fontFamily:    "'Bebas Neue', sans-serif",
              letterSpacing: '0.5px',
              background:    'rgba(255,180,0,0.12)',
              color:         '#ffb400',
              border:        '1px solid rgba(255,180,0,0.28)',
              borderRadius:  20,
              padding:       '0.1rem 0.55rem',
              textTransform: 'uppercase',
            }}>
              Waiver Required
            </span>
          )}
        </div>

        {/* Card body */}
        <div style={{ padding: '1.25rem 1.5rem' }}>
          {waiverSigned ? (
            // ── Signed: enabled actions ──────────────────────────────────────
            <div>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted)', margin: '0 0 1rem' }}>
                Invite and roster management tools are coming soon.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
                <ActionButton icon="fa-solid fa-user-plus" label="Invite Players" disabled />
                <ActionButton icon="fa-solid fa-link" label="Copy Invite Link" disabled />
              </div>
            </div>
          ) : (
            // ── Unsigned: locked actions ─────────────────────────────────────
            <div>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted)', margin: '0 0 1rem' }}>
                Sign the participant waiver to unlock invite and roster management.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
                <LockedButton
                  icon="fa-solid fa-user-plus"
                  label="Invite Players"
                  onActivate={() => setModalOpen(true)}
                />
                <LockedButton
                  icon="fa-solid fa-link"
                  label="Copy Invite Link"
                  onActivate={() => setModalOpen(true)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Waiver gate modal */}
      {modalOpen && <WaiverGateModal onClose={() => setModalOpen(false)} />}
    </>
  );
}

// Enabled action button style (for signed captains — disabled until backend is ready)
function ActionButton({ icon, label, disabled }) {
  return (
    <button
      disabled={disabled}
      style={{
        display:     'flex',
        alignItems:  'center',
        gap:         '0.55rem',
        padding:     '0.65rem 1.15rem',
        background:  disabled ? 'rgba(0,116,255,0.04)' : 'rgba(0,116,255,0.12)',
        border:      `1px solid ${disabled ? 'rgba(0,116,255,0.1)' : 'rgba(0,116,255,0.35)'}`,
        borderRadius: 8,
        color:       disabled ? 'rgba(255,255,255,0.3)' : '#e2e8f3',
        fontSize:    '0.875rem',
        cursor:      disabled ? 'not-allowed' : 'pointer',
        fontFamily:  'inherit',
        transition:  'all 0.15s',
      }}
    >
      <i className={icon} style={{ fontSize: '0.82rem' }} />
      {label}
      {disabled && (
        <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.2)', marginLeft: '0.2rem' }}>
          Soon
        </span>
      )}
    </button>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function CaptainDashboardClient({ user }) {
  return (
    <div style={{ marginTop: '2rem' }}>
      <CaptainToolsCard waiverSigned={!!user?.waiver_signed} />
    </div>
  );
}
