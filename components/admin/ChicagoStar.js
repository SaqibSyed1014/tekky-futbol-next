const VARIANTS = {
  official: { fill: '#0a3d91', stroke: '#e67a2e' },
  silver: { fill: '#c5ccd6', stroke: '#8b93a0' },
  blue: { fill: '#0074ff', stroke: '#4da3ff' },
  ghost: { fill: 'rgba(21,83,209,0.14)', stroke: 'rgba(12,47,140,0.4)' },
  ink: { fill: '#071536', stroke: '#1553d1' },
};

/** Six-point Chicago star. Official: blue field, orange border. */
export default function ChicagoStar({
  size = 16,
  variant = 'official',
  className = '',
}) {
  const c = VARIANTS[variant] || VARIANTS.official;
  return (
    <svg
      className={`ad-star ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden="true"
    >
      <polygon
        points="50,4 59,34.4 89.8,27 68,50 89.8,73 59,65.6 50,96 41,65.6 10.2,73 32,50 10.2,27 41,34.4"
        fill={c.fill}
        stroke={c.stroke}
        strokeWidth="4"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

export function AdminStarsDivider() {
  return (
    <div className="ad-divider" role="separator" aria-hidden="true">
      <div className="ad-divider__stars">
        <ChicagoStar size={11} variant="official" />
        <ChicagoStar size={11} variant="official" />
        <ChicagoStar size={11} variant="official" />
        <ChicagoStar size={11} variant="official" />
      </div>
    </div>
  );
}

export function AdminStarCrop({ size = 220, className = '' }) {
  return (
    <span className={`ad-star-crop ${className}`.trim()} aria-hidden="true">
      <ChicagoStar size={size} variant="official" />
    </span>
  );
}

export function AdminLoader() {
  return (
    <div className="ad-loader">
      <div className="ad-loader__stars">
        <ChicagoStar size={14} variant="official" />
        <ChicagoStar size={14} variant="official" />
        <ChicagoStar size={14} variant="official" />
        <ChicagoStar size={14} variant="official" />
      </div>
    </div>
  );
}
