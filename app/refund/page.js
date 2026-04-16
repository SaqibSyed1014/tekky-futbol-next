import Link from 'next/link';
import GlowDivider from '@/components/ui/GlowDivider';

export const metadata = {
  title: 'TekkyFutbol Shop — Refund Policy',
  description: 'Every registration counts — but we play fair.',
};

export default function RefundPage() {
  return (
    <>
      <header style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="hero" style={{ position: 'relative', zIndex: 2, maxWidth: 980, padding: '0 1rem' }}>
          <h1>REFUND POLICY</h1>
          <p className="tagline">For Ballers Who Create</p>
          <p className="subtext">Every registration counts — but we play fair.</p>
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: '3rem auto 4rem', padding: '0 1.25rem', textAlign: 'left' }}>
        <GlowDivider />

        <div style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(0,116,255,0.4)', borderRadius: 16, padding: '2rem', boxShadow: '0 0 25px rgba(0,116,255,0.25)', lineHeight: 1.8, color: '#e2e8f3' }}>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', color: 'var(--tekky-blue)', fontSize: '1.8rem', marginBottom: '1rem' }}>Refund Timeline</h2>
          <p style={{ marginBottom: '1rem' }}>Refunds allowed up to 7–14 days before the season start date.</p>

          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', color: 'var(--tekky-blue)', fontSize: '1.8rem', marginBottom: '1rem' }}>Eligibility</h2>
          <ul className="bullet-list" style={{ maxWidth: "100%", marginBottom: '1.5rem' }}>
            <li style={{ maxWidth: "100%", marginBottom: '0.6rem' }}>Refunds apply only to officially registered players and coaches who paid through TekkyFutbol.</li>
            <li style={{ maxWidth: "100%",marginBottom: '0.6rem' }}>Jerseys or gear already distributed are <strong>non-refundable</strong>.</li>
          </ul>

          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', color: 'var(--tekky-blue)', fontSize: '1.8rem', marginBottom: '1rem' }}>How to Request</h2>
          <p style={{ marginBottom: '1rem' }}>Send your refund request to <strong>refund@tekkyfutbol.net</strong> and include:</p>
          <ul className="bullet-list" style={{ marginBottom: '1.5rem' }}>
            <li style={{ maxWidth: "100%", marginBottom: '0.6rem' }}>Team name</li>
            <li style={{ maxWidth: "100%", marginBottom: '0.6rem' }}>Player or coach name</li>
            <li style={{ maxWidth: "100%", marginBottom: '0.6rem' }}>Proof of payment</li>
          </ul>

          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', color: 'var(--tekky-blue)', fontSize: '1.8rem', marginBottom: '1rem' }}>Processing</h2>
          <p style={{ marginBottom: '1rem' }}>Refunds are issued via the original payment method within <strong>7–10 business days</strong> after approval.</p>

          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', color: 'var(--tekky-blue)', fontSize: '1.8rem', marginBottom: '1rem' }}>Notes</h2>
          <ul className="bullet-list" style={{ marginBottom: '1.5rem' }}>
            <li style={{ maxWidth: "100%", marginBottom: '0.6rem' }}>Service fees (e.g., Stripe, bank processing) are not refundable.</li>
            <li style={{ maxWidth: "100%", marginBottom: '0.6rem' }}>Repeated refund requests or disputes may affect future eligibility.</li>
          </ul>
        </div>

        <GlowDivider />

        <div className="sec-cta">
          <a href="mailto:refund@tekkyfutbol.net" className="cta">Request a Refund</a>
        </div>
      </main>
    </>
  );
}
