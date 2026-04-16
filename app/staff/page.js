import Link from 'next/link';
import GlowDivider from '@/components/ui/GlowDivider';

export const metadata = {
  title: 'TekkyFutbol — Staff & Volunteers',
  description: 'Meet the organizers, creatives, and volunteers who keep TekkyFutbol moving week after week.',
};

export default function StaffPage() {
  return (
    <>
      <header style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="hero" style={{ position: 'relative', zIndex: 2, maxWidth: 980, padding: '0 1rem' }}>
          <h1>STAFF & VOLUNTEERS</h1>
          <p className="tagline">For Ballers Who Create</p>
          <p className="subtext">Meet the organizers, creatives, and volunteers who keep TekkyFutbol moving week after week.</p>
        </div>
      </header>

      <main style={{ maxWidth: 1080, margin: '3rem auto 4rem', padding: '0 1.25rem', textAlign: 'center' }}>
        <GlowDivider />

        <section id="staff" style={{ margin: '3rem 0' }}>
          <h2>Core Team</h2>

          <div className="staff-grid" style={{ marginTop: '2rem' }}>
            <div className="staff-card" style={{ textAlign: 'center' }}>
              <div className="img-placeholder show" style={{ borderRadius: '50%', width: 120, height: 120, margin: '0 auto 1rem' }}>
                <img src="/images/staff.jpg" alt="Jesus" />
              </div>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.4rem', color: 'var(--tekky-blue)' }}>Jesus</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.95rem', marginTop: '0.2rem', fontWeight: 600 }}>League Director</div>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', lineHeight: 1.5 }}>
                Oversees league operations, partnerships, and season structure.
              </p>
            </div>
            <div className="staff-card" style={{ textAlign: 'center' }}>
              <div className="img-placeholder show" style={{ borderRadius: '50%', width: 120, height: 120, margin: '0 auto 1rem' }}>
                <img src="/images/staff.jpg" alt="Josue" />
              </div>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.4rem', color: 'var(--tekky-blue)' }}>Josue</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.95rem', marginTop: '0.2rem', fontWeight: 600 }}>Creative Media Lead</div>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', lineHeight: 1.5 }}>
                Directs photo, video, and storytelling content across Tekky platforms.
              </p>
            </div>
          </div>
        </section>

        <GlowDivider />

        <section id="volunteer" style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2>Join the Tekky Crew</h2>
          <p style={{ maxWidth: 700, margin: '0 auto 1rem', color: 'var(--muted)', lineHeight: 1.8 }}>
            We&#39;re always looking for photographers, videographers, commentators, and event volunteers who live for football culture. If that&#39;s you — let&#39;s connect.
          </p>
          <div className="sec-cta">
            <a className="cta" href="mailto:contact@tekkyfutbol.net">Volunteer with Us</a>
          </div>
        </section>

        <GlowDivider />

        <div className="sec-cta">
          <Link className="cta" href="/registration">Register Your Squad</Link>
          <Link className="cta" href="/partners">View Partners</Link>
          <Link className="cta" href="/">Back to Home</Link>
        </div>
      </main>
    </>
  );
}
