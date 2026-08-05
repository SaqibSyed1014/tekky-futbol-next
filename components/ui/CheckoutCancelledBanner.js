'use client';

export default function CheckoutCancelledBanner({ onDismiss }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      padding: '0.75rem 1.25rem',
      background: 'rgba(255,160,0,0.08)',
      border: '1px solid rgba(255,160,0,0.3)',
      borderRadius: '10px',
      maxWidth: 700,
      margin: '0 auto 1.5rem',
    }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#e9eef7', fontSize: '0.92rem' }}>
        <i className="fa-solid fa-circle-info" style={{ color: '#ffa500' }} />
        Checkout was cancelled — no payment was taken. You can buy whenever you&#39;re ready.
      </span>
      <button
        onClick={onDismiss}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#7a8a9e', fontSize: '1.1rem', padding: '0 0.25rem', flexShrink: 0,
        }}
      >
        <i className="fa-solid fa-xmark" />
      </button>
    </div>
  );
}
