const SHAPES = {
  // ⊕ — coordinate crosshair
  crosshair: (
    <>
      <circle cx="24" cy="24" r="13" />
      <path d="M24 5v38M5 24h38" />
    </>
  ),
  // ⌖ — position indicator
  position: (
    <>
      <circle cx="24" cy="24" r="10" />
      <path d="M24 5v14M24 29v14M5 24h14M29 24h14" />
    </>
  ),
  // ⬡ — hexagon
  hexagon: <path d="M24 5l16.5 9.5v19L24 43 7.5 33.5v-19z" />,
};

/**
 * Metallic-silver vector glyph. Brushed-metal banding comes from a hard-stop
 * linear gradient — no blur, glow or drop shadow (roadmap: no neon / esports effects).
 *
 * userSpaceOnUse matters: the crosshair strokes are perfectly horizontal /
 * vertical, so their bounding box has zero width or height and a default
 * objectBoundingBox gradient would render them invisible.
 *
 * @param {Object} props
 * @param {'crosshair'|'position'|'hexagon'} props.kind
 * @param {number} [props.size]
 */
export default function SilverGlyph({ kind, size = 40 }) {
  const gradientId = `silver-metal-${kind}`;

  return (
    <svg
      className="silver-glyph"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1="6" y1="4" x2="42" y2="44">
          <stop offset="0" stopColor="#F8FAFC" />
          <stop offset="0.3" stopColor="#CBD5E1" />
          <stop offset="0.5" stopColor="#8A9BB2" />
          <stop offset="0.7" stopColor="#E2E8F0" />
          <stop offset="1" stopColor="#94A3B8" />
        </linearGradient>
      </defs>
      <g stroke={`url(#${gradientId})`} strokeWidth="2.25" strokeLinecap="square" strokeLinejoin="miter">
        {SHAPES[kind]}
      </g>
    </svg>
  );
}
