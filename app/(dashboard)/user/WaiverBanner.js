/**
 * WaiverBanner
 *
 * Amber reminder strip shown to any user who has not yet signed the waiver.
 * Props:
 *   isCaptain {boolean} — adjusts the copy to mention invite actions vs. pool visibility.
 */

import Link from 'next/link';

export default function WaiverBanner({ isCaptain }) {
  const message = isCaptain
    ? 'Sign the participant waiver to enable invite actions and access captain tools.'
    : 'Sign the participant waiver to appear in the Free Agent Pool and access league features.';

  return (
    <div style={{
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'space-between',
      flexWrap:       'wrap',
      gap:            '0.85rem',
      background:     'rgba(255,180,0,0.06)',
      border:         '1px solid rgba(255,180,0,0.28)',
      borderRadius:   10,
      padding:        '0.9rem 1.2rem',
      marginBottom:   '1.75rem',
    }}>
      {/* Icon + copy */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <i
          className="fa-solid fa-file-signature"
          style={{ color: '#ffb400', fontSize: '1.05rem', flexShrink: 0 }}
        />
        <div>
          <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#e2e8f3' }}>
            Waiver Signature Required
          </p>
          <p style={{ margin: '0.12rem 0 0', fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.5 }}>
            {message}
          </p>
        </div>
      </div>

      {/* CTA */}
      <Link
        href="/user/waiver"
        style={{
          display:        'inline-flex',
          alignItems:     'center',
          gap:            '0.4rem',
          background:     '#ffb400',
          color:          '#000',
          borderRadius:   7,
          padding:        '0.45rem 1rem',
          fontSize:       '0.8rem',
          fontWeight:     700,
          fontFamily:     "'Bebas Neue', sans-serif",
          letterSpacing:  '1px',
          textDecoration: 'none',
          whiteSpace:     'nowrap',
          flexShrink:     0,
        }}
      >
        Sign Waiver
        <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.68rem' }} />
      </Link>
    </div>
  );
}
