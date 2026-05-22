'use client';

import Link from 'next/link';
import WaiverBanner from '../WaiverBanner';

// ─── Unsigned state ───────────────────────────────────────────────────────────
// Shows why the player isn't visible in the pool + a sign-waiver prompt.

function UnsignedState() {
  return (
    <div>
      <WaiverBanner isCaptain={false} />

      <div style={{
        background:   'rgba(0,0,0,0.45)',
        border:       '1px solid rgba(255,180,0,0.18)',
        borderRadius: 12,
        padding:      '2.5rem 2rem',
        textAlign:    'center',
      }}>
        {/* Icon */}
        <div style={{
          width:          64,
          height:         64,
          borderRadius:   '50%',
          background:     'rgba(255,180,0,0.08)',
          border:         '2px solid rgba(255,180,0,0.22)',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          margin:         '0 auto 1.25rem',
        }}>
          <i className="fa-solid fa-eye-slash" style={{ color: '#ffb400', fontSize: '1.4rem' }} />
        </div>

        <h2 style={{
          fontFamily:    "'Bebas Neue', sans-serif",
          fontSize:      '1.55rem',
          letterSpacing: '1.5px',
          color:         '#ffb400',
          margin:        '0 0 0.6rem',
        }}>
          You&apos;re Not Visible Yet
        </h2>

        <p style={{
          color:     'var(--muted)',
          fontSize:  '0.875rem',
          lineHeight: 1.7,
          maxWidth:  400,
          margin:    '0 auto 1.75rem',
        }}>
          Unsigned players are hidden from the Free Agent Pool. Captains can only see players
          who have completed the participant waiver. Sign yours to become discoverable.
        </p>

        <Link
          href="/user/waiver"
          style={{
            display:        'inline-flex',
            alignItems:     'center',
            gap:            '0.5rem',
            background:     '#ffb400',
            color:          '#000',
            borderRadius:   8,
            padding:        '0.65rem 1.5rem',
            fontSize:       '0.9rem',
            fontWeight:     700,
            fontFamily:     "'Bebas Neue', sans-serif",
            letterSpacing:  '1px',
            textDecoration: 'none',
          }}
        >
          <i className="fa-solid fa-file-signature" style={{ fontSize: '0.85rem' }} />
          Sign Waiver
        </Link>
      </div>
    </div>
  );
}

// ─── Signed state ─────────────────────────────────────────────────────────────
// Pool is visible; content placeholder until the API endpoint is built.

function SignedState({ user }) {
  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h2 style={{
          fontFamily:    "'Bebas Neue', sans-serif",
          fontSize:      '1.8rem',
          color:         'var(--fg)',
          margin:        0,
          letterSpacing: '1px',
        }}>
          Free Agent Pool
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginTop: '0.35rem' }}>
          Browse available players or wait to be discovered by a captain.
        </p>
      </div>

      {/* Visibility badge */}
      <div style={{
        display:      'flex',
        alignItems:   'center',
        gap:          '0.65rem',
        background:   'rgba(0,200,100,0.05)',
        border:       '1px solid rgba(0,200,100,0.2)',
        borderRadius: 8,
        padding:      '0.75rem 1.1rem',
        marginBottom: '1.75rem',
        width:        'fit-content',
      }}>
        <i className="fa-solid fa-eye" style={{ color: '#00c864', fontSize: '0.9rem' }} />
        <span style={{ fontSize: '0.82rem', color: '#00c864', fontWeight: 600 }}>
          You&apos;re visible in the pool
        </span>
      </div>

      {/* Pool placeholder */}
      <div style={{
        background:   'rgba(0,0,0,0.45)',
        border:       '1px solid rgba(0,116,255,0.18)',
        borderRadius: 12,
        padding:      '3rem 2rem',
        textAlign:    'center',
      }}>
        <i
          className="fa-solid fa-users"
          style={{
            fontSize:     '2.5rem',
            color:        'rgba(0,116,255,0.3)',
            display:      'block',
            marginBottom: '1rem',
          }}
        />
        <h3 style={{
          fontFamily:    "'Bebas Neue', sans-serif",
          fontSize:      '1.4rem',
          letterSpacing: '1.5px',
          color:         'var(--tekky-blue)',
          margin:        '0 0 0.6rem',
        }}>
          Pool Coming Soon
        </h3>
        <p style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.65, maxWidth: 380, margin: '0 auto' }}>
          The Free Agent Pool is under development. Your profile is active and captains
          will be able to find you once it launches.
        </p>
      </div>
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function PoolClient({ user }) {
  if (!user.waiver_signed) return <UnsignedState />;
  return <SignedState user={user} />;
}
