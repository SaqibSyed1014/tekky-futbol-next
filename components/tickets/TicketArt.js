/**
 * Ticketing artwork — one hero graphic per pass family (roadmap §5):
 *   North  → high-contrast monochrome player silhouette (watermark)
 *   South  → geometric asphalt-grid wireframe
 *   Hub    → balanced technical blueprint node graphic
 * Each is a single flat layer (no gradients, no blur) coloured via
 * `currentColor`, so the theme in tickets.css controls tone and opacity.
 * The North player is a PNG alpha mask (public/images/north-silhouette.png).
 */

export function PlayerSilhouette({ className = '' }) {
  return (
    <span className={className} aria-hidden="true">
      <span className="tkt-silhouette" />
    </span>
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
