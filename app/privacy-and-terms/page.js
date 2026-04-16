import Link from 'next/link';
import GlowDivider from '@/components/ui/GlowDivider';

export const metadata = {
  title: 'TekkyFutbol — Privacy & Terms',
  description: 'Because creators deserve transparency and trust both on and off the pitch.',
};

export default function PrivacyAndTermsPage() {
  return (
    <>
      <header style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="hero" style={{ position: 'relative', zIndex: 2, maxWidth: 980, padding: '0 1rem' }}>
          <h1>PRIVACY POLICY & TERMS OF USE</h1>
          <p className="tagline">For Ballers Who Create</p>
          <p className="subtext">Because creators deserve transparency and trust both on and off the pitch.</p>
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: '3rem auto 4rem', padding: '0 1.25rem', lineHeight: 1.8 }}>
        <GlowDivider />

        <section id="privacy" style={{ margin: '3rem 0' }}>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', color: 'var(--tekky-blue)', fontSize: '1.8rem', marginBottom: '1rem' }}>Privacy Policy</h2>
          <p style={{ maxWidth: '100%', marginBottom: '0.8rem' }}>At TekkyFutbol, we value your privacy and are committed to protecting your personal data. This policy explains what we collect, why we collect it, and how we use it.</p>
          <ul className="bullet-list">
            <li style={{ maxWidth: '100%', marginBottom: '0.8rem' }}><strong>Information We Collect:</strong> Names, emails, payment details, and registration data provided voluntarily through forms or checkout.</li>
            <li style={{ maxWidth: '100%', marginBottom: '0.8rem' }}><strong>How We Use It:</strong> To manage player registrations, communicate updates, process payments, and enhance your experience.</li>
            <li style={{ maxWidth: '100%', marginBottom: '0.8rem' }}><strong>Data Security:</strong> Payments are processed via secure third-party systems (Stripe, PayPal). We never store full card details.</li>
            <li style={{ maxWidth: '100%', marginBottom: '0.8rem' }}><strong>Cookies:</strong> Used for analytics and smoother navigation. You can disable them in browser settings.</li>
            <li style={{ maxWidth: '100%', marginBottom: '0.8rem' }}><strong>Third Parties:</strong> We don&#39;t sell or rent personal data. Analytics tools may collect anonymized usage info.</li>
            <li style={{ maxWidth: '100%', marginBottom: '0.8rem' }}><strong>Your Rights:</strong> You may request data deletion or correction by contacting <a href="mailto:legal@tekkyfutbol.net" style={{ color: 'var(--tekky-blue)', textDecoration: "underline" }}>legal@tekkyfutbol.net</a>.</li>
          </ul>
        </section>

        <GlowDivider />

        <section id="terms" style={{ margin: '3rem 0' }}>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', color: 'var(--tekky-blue)', fontSize: '1.8rem', marginBottom: '1rem' }}>Terms of Use</h2>
          <ul className="bullet-list">
            <li style={{ maxWidth: '100%', marginBottom: '0.8rem' }}><strong>Acceptance:</strong> By using TekkyFutbol.net or participating in any event, you agree to these terms.</li>
            <li style={{ maxWidth: '100%', marginBottom: '0.8rem' }}><strong>Conduct:</strong> Players, coaches, and fans must uphold respect, creativity, and sportsmanship at all times.</li>
            <li style={{ maxWidth: '100%', marginBottom: '0.8rem' }}><strong>Content &amp; Media Rights:</strong> Photos and videos captured during TekkyFutbol matches or events may be recorded and used for league operations, highlights, marketing, and media distribution. By participating or attending, you consent to being photographed or recorded.</li>
            <li style={{ maxWidth: '100%', marginBottom: '0.8rem' }}><strong>Refunds &amp; Payments:</strong> Governed by our <Link href="/refund" style={{ color: 'var(--tekky-blue)', textDecoration: "underline" }}>Refund Policy</Link>.</li>
            <li style={{ maxWidth: '100%', marginBottom: '0.8rem' }}><strong>Event Changes:</strong> Dates or venues may shift due to unforeseen circumstances — announcements will be posted.</li>
            <li style={{ maxWidth: '100%', marginBottom: '0.8rem' }}><strong>Liability:</strong> Participation involves physical activity; TekkyFutbol isn&#39;t liable for injuries or personal loss.</li>
            <li style={{ maxWidth: '100%', marginBottom: '0.8rem' }}><strong>Team Names &amp; Logos:</strong> Teams are responsible for ensuring their names and logos do not infringe on trademarks, copyrights, or intellectual property rights.</li>
            <li style={{ maxWidth: '100%', marginBottom: '0.8rem' }}>By submitting a team name or logo, participants confirm they own the rights or have authorization to use it.</li>
            <li style={{ maxWidth: '100%', marginBottom: '0.8rem' }}>TekkyFutbol reserves the right to reject, modify, or remove any branding that may violate intellectual property or league standards.</li>
            <li style={{ maxWidth: '100%', marginBottom: '0.8rem' }}><strong>Termination:</strong> TekkyFutbol reserves the right to remove participants who violate rules or damage the brand experience.</li>
          </ul>
        </section>

        <GlowDivider />

        <section id="contact" style={{ margin: '3rem 0' }}>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', color: 'var(--tekky-blue)', fontSize: '1.8rem', marginBottom: '1rem' }}>Contact Us</h2>
          <p style={{ maxWidth: '100%', marginBottom: '0.8rem' }}>Questions, privacy concerns, or legal inquiries? Reach out — we&#39;ll respond as fast as our players move.</p>
          <div className="sec-cta">
            <a className="cta" href="mailto:legal@tekkyfutbol.net">Email Us</a>
            <Link className="cta" href="/">Back to Home</Link>
          </div>
        </section>
      </main>
    </>
  );
}
