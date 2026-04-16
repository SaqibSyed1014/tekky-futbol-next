import Link from 'next/link';
import GlowDivider from '@/components/ui/GlowDivider';

export const metadata = {
  title: 'All Tickets — TekkyFutbol',
  description: 'Purchase TekkyFutbol tickets for any match or event.',
};

export default function TicketsPage() {
  return (
    <>
      <header style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="hero" style={{ position: 'relative', zIndex: 2, maxWidth: 980, padding: '0 1rem' }}>
          <h1>TICKETS</h1>
          <p className="tagline">For Ballers Who Create</p>
          <p className="subtext">Get in the stands. Feel the game live.</p>
        </div>
      </header>

      <main style={{ maxWidth: 1080, margin: '2.8rem auto 4rem', padding: '0 1.25rem', textAlign: 'center' }}>
        <GlowDivider />

        <section style={{ margin: '3rem 0' }}>
          <h2>SEASON PASS</h2>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            Full season access. Every regular season match included.
          </p>
          <p className="price" style={{ fontSize: '1.8rem', margin: '0.5rem 0' }}>$80</p>
          <div className="sec-cta">
            <Link className="cta" href="/tickets/season-pass-checkout">Get Season Pass</Link>
          </div>
        </section>

        <GlowDivider />

        <section style={{ margin: '3rem 0' }}>
          <h2>SINGLE GAME TICKET</h2>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            One game. Full experience. Pick your matchday.
          </p>
          <p className="price" style={{ fontSize: '1.8rem', margin: '0.5rem 0' }}>$10</p>
          <div className="sec-cta">
            <Link className="cta" href="/tickets/single-checkout">Get Single Ticket</Link>
          </div>
        </section>

        <GlowDivider />

        <section style={{ margin: '3rem 0' }}>
          <h2>PLAYOFF TICKET</h2>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            Access to one playoff match. The stakes are higher.
          </p>
          <p className="price" style={{ fontSize: '1.8rem', margin: '0.5rem 0' }}>$15</p>
          <div className="sec-cta">
            <Link className="cta" href="/tickets/playoff-checkout">Get Playoff Ticket</Link>
          </div>
        </section>

        <GlowDivider />

        <section style={{ margin: '3rem 0' }}>
          <h2>SUPPORTER BUNDLE</h2>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            Regular season plus playoff access bundled into one package.
          </p>
          <p className="price" style={{ fontSize: '1.8rem', margin: '0.5rem 0' }}>$60</p>
          <div className="sec-cta">
            <Link className="cta" href="/tickets/supporter-bundle-checkout">Get Supporter Bundle</Link>
          </div>
        </section>

        <GlowDivider />

        <section style={{ margin: '3rem 0' }}>
          <h2>FINALE TICKET</h2>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            The championship event. The biggest night of the season.
          </p>
          <p className="price" style={{ fontSize: '1.8rem', margin: '0.5rem 0' }}>$25</p>
          <p style={{ margin: '0.4rem 0', color: '#888' }}>Coming Soon</p>
        </section>

        <GlowDivider />

        <div className="sec-cta">
          <Link className="cta" href="/season-finale">Season Finale Info</Link>
          <Link className="cta" href="/schedule">View Schedule</Link>
          <Link className="cta" href="/">Back to Home</Link>
        </div>
      </main>
    </>
  );
}
