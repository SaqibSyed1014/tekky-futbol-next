import Link from 'next/link';
import GlowDivider from '@/components/ui/GlowDivider';

export const metadata = {
  title: 'TekkyFutbol Shop — Media & Highlights',
  description: 'Watch match highlights and view the latest TekkyFutbol media.',
};

const galleryImages = [
  '/images/media/gallery-1.webp',
  '/images/media/gallery-2.webp',
  '/images/media/gallery-3.webp',
  '/images/media/gallery-4.webp',
  '/images/media/gallery-5.webp',
  '/images/media/gallery-6.webp',
];

export default function MediaPage() {
  return (
    <>
      <header style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="hero" style={{ position: 'relative', zIndex: 2, maxWidth: 980, padding: '0 1rem' }}>
          <h1>MEDIA & HIGHLIGHTS</h1>
          <p className="tagline">For Ballers Who Create</p>
          <p className="subtext">The moments worth watching. Again and again.</p>
        </div>
      </header>

      <main style={{ maxWidth: 1080, margin: '2.8rem auto 4rem', padding: '0 1.25rem', textAlign: 'center' }}>
        <GlowDivider />

        <section style={{ margin: '3rem 0' }}>
          <h2>MATCH HIGHLIGHTS</h2>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            Relive the best moments from the 2026 season.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', margin: '2rem 0' }}>
            <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px' }}>
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Match Highlights 1"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
              />
            </div>
            <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px' }}>
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Match Highlights 2"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
              />
            </div>
            <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px' }}>
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Match Highlights 3"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
              />
            </div>
          </div>
        </section>

        <GlowDivider />

        <section style={{ margin: '3rem 0' }}>
          <h2>PHOTO GALLERY</h2>
          <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
            Shots from the pitch, the sidelines, and beyond.
          </p>
          <div className="grid" style={{ marginTop: '2rem' }}>
            {galleryImages.map((src, i) => (
              <div key={i} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="img-placeholder" style={{ minHeight: 180, background: 'rgba(0,116,255,0.1)' }}>
                  <img
                    src={src}
                    alt={`Gallery photo ${i + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <GlowDivider />

        <div className="sec-cta">
          <Link className="cta" href="/results">View Results</Link>
          <Link className="cta" href="/">Back to Home</Link>
        </div>
      </main>
    </>
  );
}
