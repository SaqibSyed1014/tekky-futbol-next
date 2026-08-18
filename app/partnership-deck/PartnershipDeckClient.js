'use client';

import Script from 'next/script';
import Link from 'next/link';
import GlowDivider from '@/components/ui/GlowDivider';

export default function PartnershipDeckClient() {
  function initSwiper() {
    if (typeof window !== 'undefined' && window.Swiper) {
      new window.Swiper('.deck-swiper', {
        direction: 'horizontal',
        spaceBetween: 50,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      });
    }
  }

  return (
    <>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
      <Script
        src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"
        strategy="afterInteractive"
        onLoad={initSwiper}
      />

      <header style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="hero" style={{ position: 'relative', zIndex: 2, maxWidth: 980, padding: '0 1rem' }}>
          <h1>Partnership deck</h1>
          <p className="tagline">For Ballers Who Create</p>
          <p className="subtext">A next-generation football platform built on creativity, culture, and competition</p>
        </div>
      </header>

      <main className="tight-list-content" style={{ maxWidth: 1080, margin: '2.8rem auto 4rem', padding: '0 1.25rem' }}>
        <GlowDivider />

        <section style={{ textAlign: 'center' }}>
          <div className="swiper deck-swiper" style={{ padding: '2rem 0 2rem' }}>
            <div className="swiper-wrapper" style={{ alignItems: 'center' }}>

              {/* Slide 1 */}
              <div className="swiper-slide">
                <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', textAlign: 'center' }}>
                  <h2>Founding Partners</h2>
                  <p className="tagline">Build Season One Together</p>
                  <p className="subtext">Reserved for a small group of organizations committed to shaping TekkyFutbol from the beginning. Founding Partners receive long-term recognition and collaborate with us on experiences that define the league.</p>
                </div>
              </div>

              {/* Slide 2 */}
              <div className="swiper-slide">
                <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', textAlign: 'center' }}>
                  <h2>Experience Partners</h2>
                  <p className="tagline">Elevate Matchday</p>
                  <div className="subtext">Create memorable moments for players and supporters through activations, hospitality, product sampling, entertainment, and the Season Finale experience.</div>
                </div>
              </div>

              {/* Slide 3 */}
              <div className="swiper-slide">
                <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', textAlign: 'center' }}>
                  <h2>Performance Partners</h2>
                  <div className="tagline">Help Players Perform</div>
                  <div className="subtext">Designed for brands that improve the player experience through equipment, apparel, nutrition, recovery, technology, health, or performance services.</div>
                </div>
              </div>

              {/*/!* Slide 4 *!/*/}
              {/*<div className="swiper-slide">*/}
              {/*  <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', textAlign: 'center' }}>*/}
              {/*    <h2>The Gap We Fill</h2>*/}
              {/*    <p className="subtext">Traditional football platforms:</p>*/}
              {/*    <ul className="bullet-list" style={{ marginBottom: ".6rem" }}>*/}
              {/*      <li>Feel corporate or outdated</li>*/}
              {/*      <li>Miss culture and creativity</li>*/}
              {/*      <li>Treat fans as spectators</li>*/}
              {/*    </ul>*/}
              {/*    <p className="subtext">TekkyFutbol:</p>*/}
              {/*    <ul className="bullet-list" style={{ marginBottom: ".6rem" }}>*/}
              {/*      <li>Puts creators and players at the center</li>*/}
              {/*      <li>Builds identity, not just competition</li>*/}
              {/*      <li>Creates moments worth sharing</li>*/}
              {/*    </ul>*/}
              {/*    <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>We don&#39;t chase attention — we earn it.</p>*/}
              {/*  </div>*/}
              {/*</div>*/}

              {/*/!* Slide 5 *!/*/}
              {/*<div className="swiper-slide">*/}
              {/*  <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', textAlign: 'center' }}>*/}
              {/*    <h2>Who We Reach</h2>*/}
              {/*    <p className="subtext">Our audience lives where football meets culture:</p>*/}
              {/*    <ul className="bullet-list" style={{ marginBottom: ".6rem" }}>*/}
              {/*      <li>Competitive players</li>*/}
              {/*      <li>Street-football enthusiasts</li>*/}
              {/*      <li>Creators &amp; digital natives</li>*/}
              {/*      <li>Style-conscious fans</li>*/}
              {/*    </ul>*/}
              {/*    <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>They don&#39;t respond to ads.</p>*/}
              {/*    <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>They respond to energy, identity, and authenticity.</p>*/}
              {/*  </div>*/}
              {/*</div>*/}

              {/*/!* Slide 6 *!/*/}
              {/*<div className="swiper-slide">*/}
              {/*  <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', textAlign: 'center' }}>*/}
              {/*    <h2>How TekkyFutbol Shows Up</h2>*/}
              {/*    <p className="subtext">TekkyFutbol operates across multiple touchpoints:</p>*/}
              {/*    <ul className="bullet-list" style={{ marginBottom: ".6rem" }}>*/}
              {/*      <li>Live matchdays &amp; league play</li>*/}
              {/*      <li>Branded kits &amp; limited drops</li>*/}
              {/*      <li>Digital content &amp; storytelling</li>*/}
              {/*      <li>Community-driven events</li>*/}
              {/*    </ul>*/}
              {/*    <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Partners integrate into the ecosystem, not just a logo placement.</p>*/}
              {/*  </div>*/}
              {/*</div>*/}

              {/*/!* Slide 7 *!/*/}
              {/*<div className="swiper-slide">*/}
              {/*  <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', textAlign: 'center' }}>*/}
              {/*    <h2>Ways to Collaborate</h2>*/}
              {/*    <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>We work with aligned partners across:</p>*/}
              {/*    <ul className="bullet-list" style={{ marginBottom: ".6rem" }}>*/}
              {/*      <li>Seasonal league partnerships</li>*/}
              {/*      <li>Branded kits &amp; limited-edition merch</li>*/}
              {/*      <li>Event activations &amp; pop-ups</li>*/}
              {/*      <li>Digital content collaborations</li>*/}
              {/*      <li>Community &amp; culture initiatives</li>*/}
              {/*    </ul>*/}
              {/*    <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Each partnership is custom-fit, not templated.</p>*/}
              {/*  </div>*/}
              {/*</div>*/}

              {/*/!* Slide 8 *!/*/}
              {/*<div className="swiper-slide">*/}
              {/*  <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', textAlign: 'center' }}>*/}
              {/*    <h2>How We Define Alignment</h2>*/}
              {/*    <p className="subtext">All sponsors are partners. Not all partners are sponsors.</p>*/}
              {/*    <ul className="bullet-list" style={{ marginBottom: ".6rem" }}>*/}
              {/*      <li>Partners contribute creatively, culturally, or operationally</li>*/}
              {/*      <li>Sponsors provide financial backing tied to specific activations</li>*/}
              {/*    </ul>*/}
              {/*    <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>We prioritize alignment over scale — and say no often.</p>*/}
              {/*  </div>*/}
              {/*</div>*/}

              {/*/!* Slide 9 *!/*/}
              {/*<div className="swiper-slide">*/}
              {/*  <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', textAlign: 'center' }}>*/}
              {/*    <h2>The Value Exchange</h2>*/}
              {/*    <p className="subtext">Partners gain:</p>*/}
              {/*    <ul className="bullet-list" style={{ marginBottom: ".6rem" }}>*/}
              {/*      <li>Authentic exposure within football culture</li>*/}
              {/*      <li>Direct connection to players &amp; creators</li>*/}
              {/*      <li>Branded moments that live beyond one event</li>*/}
              {/*      <li>Association with a growing, modern platform</li>*/}
              {/*    </ul>*/}
              {/*    <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>We focus on quality of attention, not quantity.</p>*/}
              {/*  </div>*/}
              {/*</div>*/}

              {/*/!* Slide 10 *!/*/}
              {/*<div className="swiper-slide">*/}
              {/*  <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', textAlign: 'center' }}>*/}
              {/*    <h2>Our Approach</h2>*/}
              {/*    <p className="subtext">We partner selectively. We look for brands that:</p>*/}
              {/*    <ul className="bullet-list" style={{ marginBottom: ".6rem" }}>*/}
              {/*      <li>Respect football culture</li>*/}
              {/*      <li>Value creativity and community</li>*/}
              {/*      <li>Want long-term presence, not one-offs</li>*/}
              {/*    </ul>*/}
              {/*    <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>If it doesn&#39;t feel real, we don&#39;t do it.</p>*/}
              {/*  </div>*/}
              {/*</div>*/}

              {/*/!* Slide 11 *!/*/}
              {/*<div className="swiper-slide">*/}
              {/*  <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', textAlign: 'center' }}>*/}
              {/*    <h2>Collaboration Over Transactions</h2>*/}
              {/*    <p className="subtext">The best partnerships feel natural. They enhance the experience — not interrupt it. If you believe in:</p>*/}
              {/*    <ul className="bullet-list" style={{ marginBottom: ".6rem" }}>*/}
              {/*      <li>Football culture</li>*/}
              {/*      <li>Creative expression</li>*/}
              {/*      <li>Building something meaningful</li>*/}
              {/*    </ul>*/}
              {/*    <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>We should talk.</p>*/}
              {/*  </div>*/}
              {/*</div>*/}

              {/*/!* Slide 12 *!/*/}
              {/*<div className="swiper-slide">*/}
              {/*  <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', textAlign: 'center' }}>*/}
              {/*    <h2>Start the Conversation</h2>*/}
              {/*    <p className="subtext">Start a Partnership Conversation</p>*/}
              {/*    <p>We collaborate with a limited number of aligned partners each season.</p>*/}
              {/*    <div className="sec-cta" style={{ marginTop: '0' }}>*/}
              {/*      <Link className="cta" href="/partners">Start a Partnership Conversation</Link>*/}
              {/*    </div>*/}
              {/*  </div>*/}
              {/*</div>*/}

            </div>

            <div className="swiper-pagination" />
            <div className="swiper-button-prev" />
            <div className="swiper-button-next" />
          </div>
        </section>

        {/*<GlowDivider />*/}

        {/*<div className="sec-cta">*/}
        {/*  <Link className="cta" href="/partners">Partner with Us</Link>*/}
        {/*  <Link className="cta" href="/partnership-inquiry">Partnership Inquiry</Link>*/}
        {/*</div>*/}
      </main>

      <style>{`
        .deck-swiper .swiper-pagination-bullet {
          background: var(--tekky-blue);
        }
        .deck-swiper .swiper-button-next,
        .deck-swiper .swiper-button-prev {
          color: var(--tekky-blue);
        }
        @media (max-width: 768px) {
          .deck-swiper .swiper-button-next,
          .deck-swiper .swiper-button-prev {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
