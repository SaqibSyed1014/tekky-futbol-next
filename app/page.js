'use client';

import { useState } from 'react';
import Link from 'next/link';
import Modal from '@/components/ui/Modal';
import GlowDivider from '@/components/ui/GlowDivider';
import { useWeb3Form } from '@/components/ui/useWeb3Form';

// metadata must live in a Server Component — defined in layout.js or a parent page wrapper.

/* ─── Highlights signup form ─── */
function HighlightsSignupForm({ onSuccess }) {
  const { submitting, handleSubmit } = useWeb3Form();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  function onSubmit(e) {
    handleSubmit(
      e,
      { access_key: '11f721a1-d8fd-4e57-b071-74af8292fb15', botcheck: '', name, email },
      () => {
        setName('');
        setEmail('');
        onSuccess();
      }
    );
  }

  return (
    <form onSubmit={onSubmit} id="futureUpdatesForm">
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Enter your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit" className="cta close-overlay" disabled={submitting}>
        {submitting ? (
          <>
            <span className="spinner" />
            Submitting
          </>
        ) : (
          'Notify Me'
        )}
      </button>
    </form>
  );
}

export default function HomePage() {
  const [highlightOpen, setHighlightOpen] = useState(false);
  const [highlightSuccess, setHighlightSuccess] = useState(false);

  return (
    <>
      <header className="no-space" style={{ position: 'relative', zIndex: 0, minHeight: '70vh', display: 'flex', alignItems: 'stretch', justifyContent: 'center', textAlign: 'center' }}>
        <div
          className="hero"
          style={{
            position: 'relative',
            zIndex: 0,
            padding: '0 1rem',
            minHeight: '100%',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          {/* hero background */}
          <style>{`
            .hero::before {
              content: '';
              position: absolute;
              background: url('/images/hero-bg.png') no-repeat;
              background-size: cover;
              background-position: 100% 30%;
              left: 0; top: 0;
              z-index: -1;
              width: 100%; height: 100%;
              background-color: rgba(0,0,0,0.4);
            }
            @media (max-width: 768px) {
              .hero::before { background-position: center; }
            }
          `}</style>

          <div style={{ width: '100%', maxWidth: 980, margin: '0 auto' }}>
            <h1>TEKKYFUTBOL</h1>
            <p className="tagline">For Ballers Who Create</p>
            <p className="subtext">
              One league. Two divisions.{' '}
              Sixteen weeks to earn your place.{' '}
              Two matches to take the crown.
            </p>
            <Link className="cta" href="/registration">
              Join the League
            </Link>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1080, margin: '2.8rem auto 4rem', padding: '0 1.25rem' }}>
        <section id="league" style={{ margin: '3rem 0' }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', color: 'var(--tekky-blue)', textAlign: 'center', marginBottom: '0.5rem' }}>The League</h2>
          <p style={{ textAlign: 'center', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Regular season rotates across surfaces. The finale stands alone.</p>
          <p style={{ textAlign: 'center', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Phase 1: Attrition — 8 teams per division. 16 matchweeks. Earn position.</p>
          <p style={{ textAlign: 'center', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Phase 2: Dominion — Top 2 per division. Single-elimination. Champion crowned.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.4rem', marginTop: '1.3rem' }}>
            <div style={{ background: 'black', border: '1px solid rgba(0,116,255,0.25)', borderRadius: 12, padding: '1.2rem', textAlign: 'center', boxShadow: '0 0 12px var(--tekky-blue)', transition: '.25s' }}>
              <i className="fas fa-location-dot" style={{ fontSize: '2rem', color: 'var(--tekky-blue)', marginBottom: '0.4rem' }}></i>
              <h3>Two Divisions</h3>
              <p>North &amp; South compete as one league — with the season culminating at a neutral Finale venue.</p>
            </div>
            <div style={{ background: 'black', border: '1px solid rgba(0,116,255,0.25)', borderRadius: 12, padding: '1.2rem', textAlign: 'center', boxShadow: '0 0 12px var(--tekky-blue)', transition: '.25s' }}>
              <i className="fas fa-trophy" style={{ fontSize: '2rem', color: 'var(--tekky-blue)', marginBottom: '0.4rem' }}></i>
              <h3>Playoffs</h3>
              <p>When the margin disappears. Win and advance. Lose and it ends. The season tightens — and only the strongest remain.</p>
            </div>
            <div style={{ background: 'black', border: '1px solid rgba(0,116,255,0.25)', borderRadius: 12, padding: '1.2rem', textAlign: 'center', boxShadow: '0 0 12px var(--tekky-blue)', transition: '.25s' }}>
              <i className="fa-solid fa-heart" style={{ fontSize: '2rem', color: 'var(--tekky-blue)', marginBottom: '0.4rem' }}></i>
              <h3>Culture</h3>
              <p>Creative football. Cinematic energy. Rules designed for flow.</p>
            </div>
          </div>

          <div className="sec-cta">
            <Link className="cta" href="/schedule">See the Schedule</Link>
          </div>
        </section>

        <GlowDivider />

        <section id="experience" style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', color: 'var(--tekky-blue)', textAlign: 'center', marginBottom: '0.5rem' }}>The Experience</h2>
          <p style={{ textAlign: 'center', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Every match is built for atmosphere.</p>
          <p style={{ textAlign: 'center', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Night games. Recorded highlights. Energy that builds week after week.</p>
          <p style={{ textAlign: 'center', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>The league grows louder as the stakes rise.</p>
          <div className="sec-cta">
            <Link className="cta" href="/rules">View the Rules</Link>
          </div>
        </section>

        <GlowDivider />

        <section id="media" style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', color: 'var(--tekky-blue)', textAlign: 'center', marginBottom: '0.5rem' }}>The Culture</h2>
          <p style={{ textAlign: 'center', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Creative football. Cinematic energy. Competitive street culture.</p>
          <p style={{ textAlign: 'center', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Rules built for flow. Players built for moments.</p>
          <p style={{ textAlign: 'center', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Street football deserves a stage.</p>
          <div className="sec-cta">
            <button className="cta" onClick={() => setHighlightOpen(true)}>
              Watch Highlights
            </button>
          </div>
        </section>

        <GlowDivider />

        <section id="finale" style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', color: 'var(--tekky-blue)', textAlign: 'center', marginBottom: '0.5rem' }}>The Finale</h2>
          <p style={{ textAlign: 'center', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>The season ends in one defining day.</p>
          <p style={{ textAlign: 'center', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Semifinals. Third place. Championship.</p>
          <p style={{ textAlign: 'center', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Four matches decide everything.</p>
          <p style={{ textAlign: 'center', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Then the night shifts to the TekkyFutbol Finale Celebration — where players, fans, and creators close the season together.</p>
          <div className="sec-cta">
            <Link className="cta" href="/season-finale">Enter the Finale</Link>
          </div>
        </section>

        <GlowDivider />

        <section id="merch" style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', color: 'var(--tekky-blue)', textAlign: 'center', marginBottom: '0.5rem' }}>The Drip</h2>
          <p style={{ textAlign: 'center', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Each season drops limited gear. Built for creators on and off the pitch.</p>
          <div className="sec-cta">
            <Link className="cta" href="/shop">Shop the Collection</Link>
          </div>
        </section>

        <section id="founding" style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', color: 'var(--tekky-blue)', textAlign: 'center', marginBottom: '0.5rem' }}>FOUNDING SEASON</h2>
          <p style={{ textAlign: 'center', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>The first season sets the standard.</p>
          <p style={{ textAlign: 'center', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Limited teams. Limited spots.</p>
          <p style={{ textAlign: 'center', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Founding players become part of the league&apos;s history.</p>
          <div className="sec-cta">
            <Link className="cta" href="/registration">JOIN THE LEAGUE</Link>
          </div>
        </section>

        <section id="cta-block" style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', color: 'var(--tekky-blue)', textAlign: 'center', marginBottom: '0.5rem' }}>Join the Movement</h2>
          <p style={{ textAlign: 'center', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Players. Creators. Sponsors. Be part of the Tekky era.</p>
          <div className="sec-cta">
            <Link className="cta" href="/partners">Sponsor the Movement</Link>
            <Link className="cta" href="/staff" style={{ marginLeft: '0.8rem' }}>Volunteer / Join Staff</Link>
          </div>
        </section>
      </main>

      {/* ── Highlights Popup ── */}
      <Modal isOpen={highlightOpen} onClose={() => { setHighlightOpen(false); setHighlightSuccess(false); }}>
        {!highlightSuccess ? (
          <>
            <h3>Get Notified When Highlights Drop</h3>
            <p className="subtext">
              Cinematic match recaps, player moments, and culture-driven content — released throughout
              the season. Enter your email to be notified when new highlights go live.
            </p>
            <HighlightsSignupForm onSuccess={() => { setHighlightOpen(false); setHighlightSuccess(true); }} />
          </>
        ) : (
          <>
            <h3>You&apos;re on the list</h3>
            <p className="subtext">
              We&apos;ll notify you when highlights are released. Some content may be exclusive to
              players, partners, or event attendees.
            </p>
            <button className="cta close-overlay" onClick={() => setHighlightSuccess(false)}>
              Back to site
            </button>
          </>
        )}
      </Modal>

      <Modal isOpen={highlightSuccess} onClose={() => setHighlightSuccess(false)}>
        <h3>You&apos;re on the list</h3>
        <p className="subtext">
          We&apos;ll notify you when highlights are released. Some content may be exclusive to
          players, partners, or event attendees.
        </p>
        <button className="cta close-overlay" onClick={() => setHighlightSuccess(false)}>
          Back to site
        </button>
      </Modal>
    </>
  );
}
