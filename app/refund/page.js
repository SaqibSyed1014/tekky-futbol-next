import Link from 'next/link';
import GlowDivider from '@/components/ui/GlowDivider';
import './refund.css';

export const metadata = {
  title: 'TekkyFutbol — Refund Policy',
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

        <div className="policy-panel">
          <section className="policy-block">
            <h2>Refund Timeline</h2>
            <p>Refunds allowed up to 7–14 days before the season start date.</p>
          </section>
          <section className="policy-block">
            <h2>Eligibility</h2>
            <ul className="bullet-list" style={{ maxWidth: "100%" }}>
              <li style={{ maxWidth: "100%", marginBottom: '0.6rem' }}>Refunds apply only to officially registered players and coaches who paid through TekkyFutbol.</li>
              <li style={{ maxWidth: "100%",marginBottom: '0.6rem' }}>Jerseys or gear already distributed are <strong>non-refundable</strong>.</li>
            </ul>
          </section>
          <section className="policy-block">
            <h2>How to Request</h2>
            <p style={{ marginBottom: '1rem' }}>Send your refund request to <strong>refund@tekkyfutbol.net</strong> and include:</p>
            <ul className="bullet-list">
              <li style={{ maxWidth: "100%", marginBottom: '0.6rem' }}>Team name</li>
              <li style={{ maxWidth: "100%", marginBottom: '0.6rem' }}>Player or coach name</li>
              <li style={{ maxWidth: "100%", marginBottom: '0.6rem' }}>Proof of payment</li>
            </ul>
          </section>
          <section className="policy-block">
            <h2>Processing</h2>
            <p>Refunds are issued via the original payment method within <strong>7–10 business days</strong> after approval.</p>
          </section>
          <section className="policy-block">
            <h2>Notes</h2>
            <ul className="bullet-list">
              <li style={{ maxWidth: "100%", marginBottom: '0.6rem' }}>Service fees (e.g., Stripe, bank processing) are not refundable.</li>
              <li style={{ maxWidth: "100%", marginBottom: '0.6rem' }}>Repeated refund requests or disputes may affect future eligibility.</li>
            </ul>
          </section>
        </div>

        <GlowDivider />

        <div className="sec-cta">
          <a href="mailto:refund@tekkyfutbol.net" className="cta">Request a Refund</a>
        </div>
      </main>
    </>
  );
}
