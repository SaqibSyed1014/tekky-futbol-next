import Link from 'next/link';
import GlowDivider from '@/components/ui/GlowDivider';

export const metadata = {
  title: 'TekkyFutbol Shop — Kit & Branding Policy',
  description: 'This policy governs team uniforms, sponsor placement, and visual standards within TekkyFutbol competitions.',
};

export default function KitAndBrandingPolicyPage() {
  return (
    <>
      <header style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="hero" style={{ position: 'relative', zIndex: 2, maxWidth: 980, padding: '0 1rem' }}>
          <h1>Kit &amp; Branding Policy</h1>
          <p className="tagline">For Ballers Who Create</p>
          <p className="subtext">This policy governs team uniforms, sponsor placement, and visual standards within TekkyFutbol competitions.</p>
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: '3rem auto 4rem', padding: '0 1.25rem', lineHeight: 1.8 }}>
        <GlowDivider />

        <section style={{ margin: '3rem 0' }}>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', color: 'var(--tekky-blue)', fontSize: '1.8rem', marginBottom: '1rem' }}>1. League-Issued Kits</h2>
          <ul className="bullet-list">
            <li style={{ maxWidth: "100%", marginBottom: '0.8rem' }}>TekkyFutbol provides standardized team kits</li>
            <li style={{ maxWidth: "100%", marginBottom: '0.8rem' }}>Sponsor placement and league branding are uniform across all teams</li>
            <li style={{ maxWidth: "100%", marginBottom: '0.8rem' }}>Coaches may select from approved templates and color options</li>
          </ul>

          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', color: 'var(--tekky-blue)', fontSize: '1.8rem', marginBottom: '1rem', marginTop: '2rem' }}>2. Custom Team Kits (Eligibility &amp; Requests)</h2>
          <p style={{ maxWidth: "100%", marginBottom: '0.8rem' }}>Teams in good standing may request approval to use custom-designed uniforms in future seasons.</p>
          <p style={{ maxWidth: "100%", marginBottom: '0.8rem' }}>Minimum eligibility considerations may include:</p>
          <ul className="bullet-list">
            <li style={{ maxWidth: "100%", marginBottom: '0.8rem' }}>Completion of a full TekkyFutbol season</li>
            <li style={{ maxWidth: "100%", marginBottom: '0.8rem' }}>Timely payment of all league fees</li>
            <li style={{ maxWidth: "100%", marginBottom: '0.8rem' }}>No outstanding disciplinary or branding violations</li>
            <li style={{ maxWidth: "100%", marginBottom: '0.8rem' }}>Demonstrated professionalism and reliability</li>
            <li style={{ maxWidth: "100%", marginBottom: '0.8rem' }}>Design alignment with league standards</li>
          </ul>
          <p style={{ maxWidth: "100%", marginBottom: '0.8rem' }}>Meeting these criteria does not guarantee approval. TekkyFutbol retains sole discretion over all kit approvals.</p>

          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', color: 'var(--tekky-blue)', fontSize: '1.8rem', marginBottom: '1rem', marginTop: '2rem' }}>3. Returning Teams &amp; Uniform Continuity</h2>
          <p style={{ maxWidth: "100%", marginBottom: '0.8rem' }}>Returning teams may retain their existing uniforms for future seasons, provided the kits remain compliant with current league branding and sponsor requirements.</p>
          <p style={{ maxWidth: "100%", marginBottom: '0.8rem' }}>Returning teams in good standing may submit requests for uniform customization between seasons. All customization requests are subject to league approval and must adhere to standardized sponsor placement and branding rules.</p>
          <p style={{ maxWidth: "100%", marginBottom: '0.8rem' }}>Changes to league sponsorships or branding requirements may require uniform updates. In such cases, TekkyFutbol reserves the right to modify or replace kits to reflect current partnerships.</p>
          <p style={{ maxWidth: "100%", marginBottom: '0.8rem' }}>Reasonable efforts will be made to minimize unnecessary kit changes for returning teams.</p>

          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', color: 'var(--tekky-blue)', fontSize: '1.8rem', marginBottom: '1rem', marginTop: '2rem' }}>4. Design Authority</h2>
          <ul className="bullet-list">
            <li style={{ maxWidth: "100%", marginBottom: '0.8rem' }}>TekkyFutbol retains final approval over all kits</li>
            <li style={{ maxWidth: "100%", marginBottom: '0.8rem' }}>Teams may not alter or obscure sponsor marks</li>
            <li style={{ maxWidth: "100%", marginBottom: '0.8rem' }}>Unauthorized kits may result in disqualification or replacement</li>
          </ul>

          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', color: 'var(--tekky-blue)', fontSize: '1.8rem', marginBottom: '1rem', marginTop: '2rem' }}>5. TEAM NAMES &amp; LOGO RIGHTS</h2>
          <ul className="bullet-list">
            <li style={{ maxWidth: "100%", marginBottom: '0.8rem' }}>Teams may submit an original team name and logo for use on league kits and digital materials.</li>
            <li style={{ maxWidth: "100%", marginBottom: '0.8rem' }}>Teams are responsible for ensuring that submitted names and logos do not infringe on trademarks, copyrights, or other intellectual property rights.</li>
            <li style={{ maxWidth: "100%", marginBottom: '0.8rem' }}>By submitting a logo, teams confirm they own the design or have authorization to use it.</li>
            <li style={{ maxWidth: "100%", marginBottom: '0.8rem' }}>TekkyFutbol reserves the right to reject, modify, or request replacement of any team name or logo that may violate intellectual property laws or league branding standards.</li>
            <li style={{ maxWidth: "100%", marginBottom: '0.8rem' }}>Team names, uniforms, and logos may appear in league photos, video recordings, match broadcasts, highlights, and promotional materials.</li>
          </ul>

          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', color: 'var(--tekky-blue)', fontSize: '1.8rem', marginBottom: '1rem', marginTop: '2rem' }}>6. Amendments</h2>
          <ul className="bullet-list">
            <li style={{ maxWidth: "100%", marginBottom: '0.8rem' }}>TekkyFutbol may update this policy between seasons</li>
          </ul>
        </section>
      </main>
    </>
  );
}
