/**
 * Ticketing artwork — one hero graphic per pass family (roadmap §5):
 *   North  → high-contrast monochrome player silhouette (watermark)
 *   South  → geometric asphalt-grid wireframe
 *   Hub    → balanced technical blueprint node graphic
 * Each is a single flat SVG layer (no gradients, no blur) coloured via
 * `currentColor`, so the theme in tickets.css controls tone and opacity.
 */

export function PlayerSilhouette({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 480 560"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {/* head + neck */}
      <circle cx="252" cy="76" r="34" fill="currentColor" stroke="none" />
      <path d="M248 112 L244 140" strokeWidth="22" />
      {/* shoulders + torso (leaning into the strike) */}
      <path d="M204 152 L296 142" strokeWidth="34" />
      <path d="M252 150 L228 268" strokeWidth="64" />
      {/* hips */}
      <path d="M208 276 L250 272" strokeWidth="44" />
      {/* plant leg */}
      <path d="M222 282 L204 384" strokeWidth="38" />
      <path d="M204 384 L184 488" strokeWidth="28" />
      <path d="M184 492 L232 502" strokeWidth="22" />
      {/* kicking leg */}
      <path d="M238 284 L316 332" strokeWidth="36" />
      <path d="M316 332 L396 376" strokeWidth="26" />
      <path d="M396 376 L424 362" strokeWidth="20" />
      {/* arms */}
      <path d="M206 154 L146 206" strokeWidth="20" />
      <path d="M146 206 L96 172" strokeWidth="16" />
      <path d="M294 146 L350 192" strokeWidth="20" />
      <path d="M350 192 L402 160" strokeWidth="16" />
      {/* ball */}
      <circle cx="446" cy="340" r="22" fill="currentColor" stroke="none" />
      {/* ground line */}
      <path d="M40 520 H440" strokeWidth="4" />
    </svg>
  );
}

export function AsphaltGrid({ className = '' }) {
  // Perspective floor: verticals converge on a vanishing point, horizontals
  // compress toward the horizon. A court circle + halfway line anchor it.
  const vx = 400;
  const vy = 40;
  const bottom = 400;
  const verticals = Array.from({ length: 13 }, (_, i) => -300 + i * 100); // x at bottom edge
  const rows = Array.from({ length: 9 }, (_, i) => {
    const t = (i + 1) / 9;
    return vy + (bottom - vy) * t * t;
  });
  const xAt = (xb, y) => vx + (xb - vx) * ((y - vy) / (bottom - vy));

  return (
    <svg
      className={className}
      viewBox="0 0 800 400"
      fill="none"
      stroke="currentColor"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
    >
      {verticals.map((xb) => (
        <line key={xb} x1={vx} y1={vy} x2={xb} y2={bottom} strokeWidth={xb === 400 ? 2 : 1} />
      ))}
      {rows.map((y) => (
        <line key={y} x1={xAt(-300, y)} y1={y} x2={xAt(1100, y)} y2={y} strokeWidth="1" />
      ))}
      {/* halfway line + centre circle */}
      <line x1={xAt(-300, 220)} y1="220" x2={xAt(1100, 220)} y2="220" strokeWidth="2.5" />
      <ellipse cx="400" cy="220" rx="150" ry="38" strokeWidth="2.5" />
      <circle cx="400" cy="220" r="4" fill="currentColor" stroke="none" />
      {/* corner registration ticks */}
      <path d="M24 24 V56 M24 24 H56 M776 24 V56 M776 24 H744" strokeWidth="2.5" />
    </svg>
  );
}

const NODE_FONT = { fontFamily: 'var(--font-tactical)', fontSize: 11, letterSpacing: '0.18em' };

export function BlueprintNodes({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 640 340"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      {/* links */}
      <path d="M320 150 L130 90" strokeWidth="1.4" />
      <path d="M320 150 L510 90" strokeWidth="1.4" />
      <path d="M320 150 L200 258" strokeWidth="1.4" strokeDasharray="5 6" />
      <path d="M320 150 L440 258" strokeWidth="1.4" strokeDasharray="5 6" />
      <path d="M130 90 H60 M510 90 H580" strokeWidth="1" strokeDasharray="2 5" />

      {/* hub node */}
      <polygon points="320,112 353,131 353,169 320,188 287,169 287,131" strokeWidth="1.6" />
      <circle cx="320" cy="150" r="8" strokeWidth="1.6" />
      <circle cx="320" cy="150" r="2.5" fill="currentColor" stroke="none" />

      {/* division nodes */}
      <rect x="106" y="66" width="48" height="48" strokeWidth="1.6" />
      <path d="M106 66 L154 114 M154 66 L106 114" strokeWidth="0.8" />
      <rect x="486" y="66" width="48" height="48" strokeWidth="1.6" />
      <circle cx="510" cy="90" r="12" strokeWidth="0.8" />

      {/* season nodes */}
      <circle cx="200" cy="258" r="20" strokeWidth="1.6" />
      <circle cx="200" cy="258" r="6" strokeWidth="0.8" />
      <circle cx="440" cy="258" r="20" strokeWidth="1.6" />
      <circle cx="440" cy="258" r="6" strokeWidth="0.8" />

      {/* dimension line */}
      <path d="M60 312 H580 M60 304 V320 M580 304 V320 M320 308 V316" strokeWidth="1" />

      {/* annotations */}
      <g fill="currentColor" stroke="none" style={NODE_FONT}>
        <text x="130" y="140" textAnchor="middle">NORTH</text>
        <text x="510" y="140" textAnchor="middle">SOUTH</text>
        <text x="320" y="214" textAnchor="middle">LEAGUE</text>
        <text x="200" y="298" textAnchor="middle" fontSize="10">SEASON</text>
        <text x="440" y="298" textAnchor="middle" fontSize="10">FINALE</text>
        <text x="320" y="333" textAnchor="middle" fontSize="10">41°52&apos;59&quot;N  87°40&apos;40&quot;W</text>
      </g>
    </svg>
  );
}
