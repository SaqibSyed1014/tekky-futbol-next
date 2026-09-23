'use client';

import { useEffect, useState } from 'react';
import { getKitStatus } from '@/services/kitsApi';

const NORTH_KITS = Array.from({ length: 8 }, (_, i) => ({
  slug: `north-${i + 1}`,
  img: `/images/tf-kits/north-${i + 1}.JPEG`,
  name: `North Division Kit ${i + 1}`,
}));

const SOUTH_KITS = Array.from({ length: 8 }, (_, i) => ({
  slug: `south-${i + 1}`,
  img: `/images/tf-kits/south-${i + 1}.JPEG`,
  name: `South Division Kit ${i + 1}`,
}));

function KitCard({ kit, claimed }) {
  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div style={{
        width: '100%', height: 200, borderRadius: 12, overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '1rem', background: 'rgba(0,116,255,0.05)',
      }}>
        <img src={kit.img} alt={kit.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
      <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{kit.name}</div>
      <div style={{
        border: `1px solid ${claimed ? 'rgba(255,90,90,0.5)' : 'var(--line-blue)'}`,
        borderRadius: 40,
        padding: '6px 20px',
        color: claimed ? '#ff8080' : '#fff',
        fontSize: 14,
        display: 'inline-block',
        background: claimed ? 'rgba(255,60,60,0.12)' : 'rgba(61, 139, 255, 0.12)',
      }}>
        {claimed ? 'Claimed' : 'Available'}
      </div>
    </div>
  );
}

function DivisionToggle({ division, onChange }) {
  return (
    <div style={{
      display: 'inline-flex', gap: 0, margin: '1.5rem 0',
      background: 'var(--card)', border: '1px solid var(--line-blue)',
      borderRadius: 999, overflow: 'hidden', padding: 4,
    }}>
      {['north', 'south'].map((d) => {
        const active = division === d;
        return (
          <button
            key={d}
            type="button"
            onClick={() => onChange(d)}
            style={{
              padding: '0.65rem 2rem',
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
              fontFamily: "'Bebas Neue', sans-serif",
              letterSpacing: '1px',
              fontSize: '0.95rem',
              color: active ? '#fff' : 'var(--muted)',
              background: active
                ? 'linear-gradient(180deg, #5aa4ff 0%, #3d8bff 38%, #1e5fe0 72%, #1553d1 100%)'
                : 'transparent',
              transition: 'all 0.2s ease',
            }}
          >
            {d === 'north' ? 'North' : 'South'}
          </button>
        );
      })}
    </div>
  );
}

export default function SeasonKitsBrowser() {
  const [division, setDivision] = useState(null); // null = nothing shown until user picks
  const [claimedSlugs, setClaimedSlugs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!division) return undefined;
    let cancelled = false;
    setLoading(true);
    setError('');
    getKitStatus()
      .then((data) => { if (!cancelled) setClaimedSlugs(data.claimed || []); })
      .catch(() => { if (!cancelled) setError('Could not load kit availability. Please try again.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [division]);

  const kits = division === 'north' ? NORTH_KITS : division === 'south' ? SOUTH_KITS : [];

  return (
    <section style={{ margin: '3rem 0', textAlign: 'center' }}>
      <h2>Browse Kits by Division</h2>
      <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
        Pick a division to see its kit designs and whether they&#39;ve already been claimed.
      </p>

      <DivisionToggle division={division} onChange={setDivision} />

      {division && loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
          <span className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
        </div>
      )}

      {division && !loading && error && (
        <p style={{ color: '#ff6b6b', margin: '1rem auto' }}>{error}</p>
      )}

      {division && !loading && !error && (
        <div className="divisions-grid" style={{ marginTop: '1.5rem' }}>
          {kits.map((kit) => (
            <KitCard key={kit.slug} kit={kit} claimed={claimedSlugs.includes(kit.slug)} />
          ))}
        </div>
      )}
    </section>
  );
}
