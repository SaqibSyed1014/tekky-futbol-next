import { useId } from 'react';
import './venue.css';

/**
 * Match-environment artwork (roadmap §4): raw outdoor urban specs drawn as flat
 * line art — street-light poles with flat light cones, a chain-link perimeter,
 * and the league's precise urban coordinates. No gradients, glows or blur.
 */

export const VENUE_COORDS = {
  display: '41°52\'59"N 87°40\'40"W',
  lat: 41.883056,
  lng: -87.677778,
};

export const VENUE_MAP_URL = `https://www.google.com/maps/search/?api=1&query=${VENUE_COORDS.lat},${VENUE_COORDS.lng}`;

const GROUND_Y = 236;

// Pole x-positions per environment; fence height differs for the championship slab.
const VARIANTS = {
  attrition: { lights: [150, 810], fenceTop: 100 },
  dominion: { lights: [150, 480, 810], fenceTop: 78 },
  festival: { lights: [120, 360, 600, 840], fenceTop: 100 },
};

function StreetLight({ x, dir }) {
  const armEnd = x + dir * 40;
  const headX = dir === 1 ? armEnd - 6 : armEnd - 30 + 6;
  return (
    <g className="venue-scene__light">
      {/* flat light cone — two stepped layers, no blur */}
      <polygon className="venue-scene__cone" points={`${armEnd},52 ${armEnd - 78},${GROUND_Y} ${armEnd + 78},${GROUND_Y}`} />
      <polygon className="venue-scene__cone venue-scene__cone--core" points={`${armEnd},52 ${armEnd - 36},${GROUND_Y} ${armEnd + 36},${GROUND_Y}`} />
      {/* pole, arm, lamp head */}
      <rect className="venue-scene__pole" x={x - 2.5} y="40" width="5" height={GROUND_Y - 40} />
      <rect className="venue-scene__pole" x={x - 7} y={GROUND_Y - 10} width="14" height="10" />
      <path className="venue-scene__arm" d={`M${x} 56 Q${x} 40 ${x + dir * 18} 40 H${armEnd}`} />
      <rect className="venue-scene__lamp" x={headX} y="38" width="30" height="9" rx="2" />
    </g>
  );
}

export function VenueScene({ variant = 'attrition', className = '' }) {
  const uid = useId().replace(/:/g, '');
  const meshId = `mesh-${uid}`;
  const { lights, fenceTop } = VARIANTS[variant] ?? VARIANTS.attrition;
  const fenceH = GROUND_Y - fenceTop;
  const posts = [40, 245, 450, 655, 860];

  return (
    <svg
      className={`venue-scene venue-scene--${variant} ${className}`.trim()}
      viewBox="0 0 960 280"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id={meshId} width="14" height="14" patternUnits="userSpaceOnUse">
          <path className="venue-scene__meshpath" d="M0 7 L7 0 L14 7 L7 14 Z" />
        </pattern>
      </defs>

      {/* ground slab */}
      <rect className="venue-scene__ground" x="0" y={GROUND_Y} width="960" height="44" />
      <line className="venue-scene__line" x1="0" y1={GROUND_Y} x2="960" y2={GROUND_Y} />
      {variant === 'attrition' && (
        <g className="venue-scene__marks">
          <line x1="480" y1={GROUND_Y + 4} x2="480" y2="276" />
          <path d={`M410 276 A70 22 0 0 1 550 276`} />
        </g>
      )}
      {variant === 'dominion' && (
        <g className="venue-scene__marks">
          {[120, 300, 480, 660, 840].map((x) => (
            <line key={x} x1={x} y1={GROUND_Y} x2={x - 26} y2="280" />
          ))}
        </g>
      )}

      {/* chain-link perimeter */}
      <g className="venue-scene__fence">
        <rect className="venue-scene__mesh" x="40" y={fenceTop} width="880" height={fenceH} fill={`url(#${meshId})`} />
        <line className="venue-scene__rail" x1="34" y1={fenceTop} x2="926" y2={fenceTop} />
        <line className="venue-scene__rail venue-scene__rail--low" x1="34" y1={GROUND_Y - 3} x2="926" y2={GROUND_Y - 3} />
        {posts.map((x) => (
          <rect key={x} className="venue-scene__post" x={x - 3} y={fenceTop - 8} width="6" height={fenceH + 8} />
        ))}
        <rect className="venue-scene__post" x="917" y={fenceTop - 8} width="6" height={fenceH + 8} />
        {variant === 'dominion' && (
          <path className="venue-scene__rail" d={`M34 ${fenceTop} l16 -16 M926 ${fenceTop} l-16 -16 M34 ${fenceTop - 8} H926`} />
        )}
      </g>

      {/* festival pennants strung between poles */}
      {variant === 'festival' && (
        <g className="venue-scene__pennants">
          {lights.slice(0, -1).map((x, i) => {
            const nx = lights[i + 1];
            const count = 9;
            return (
              <g key={x}>
                <path className="venue-scene__arm" d={`M${x + 40} 40 Q${(x + nx) / 2} 76 ${nx - 40} 40`} />
                {Array.from({ length: count }, (_, k) => {
                  const t = (k + 1) / (count + 1);
                  const px = x + 40 + (nx - 40 - (x + 40)) * t;
                  const py = 40 + 4 * 36 * t * (1 - t);
                  return <polygon key={k} points={`${px - 6},${py} ${px + 6},${py} ${px},${py + 14}`} />;
                })}
              </g>
            );
          })}
        </g>
      )}

      {/* street lights in front of the fence */}
      {lights.map((x, i) => (
        <StreetLight key={x} x={x} dir={x < 480 || (x === 480 && i === 0) ? 1 : -1} />
      ))}

      {/* registration crosshair + coordinates, printed on the slab */}
      <g className="venue-scene__coords">
        <circle cx="64" cy="262" r="8" />
        <path d="M64 249 V275 M51 262 H77" />
        <text x="86" y="267">{VENUE_COORDS.display}</text>
      </g>
    </svg>
  );
}

export function CoordinateTag({ className = '' }) {
  return (
    <a
      className={`venue-coord ${className}`.trim()}
      href={VENUE_MAP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${VENUE_COORDS.display} in Maps`}
    >
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
        <circle cx="8" cy="8" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path d="M8 0.5V4M8 12V15.5M0.5 8H4M12 8H15.5" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      <span>{VENUE_COORDS.display}</span>
    </a>
  );
}

export function EnvironmentSpecs({ className = '' }) {
  return (
    <ul className={`venue-specs ${className}`.trim()}>
      <li>
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
          <path d="M3 15V3.5Q3 2 4.5 2H10M10 2l3 0M10 2v2.2" fill="none" stroke="currentColor" strokeWidth="1.3" />
          <rect x="8.5" y="4" width="4.5" height="2" fill="currentColor" />
        </svg>
        Street lights
      </li>
      <li>
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
          <path d="M1 3h14M1 13h14M3 3l4 5-4 5M7 3l4 5-4 5M11 3l4 5-4 5M3 13l4-5-4-5M7 13l4-5-4-5M11 13l4-5-4-5" fill="none" stroke="currentColor" strokeWidth="0.9" />
        </svg>
        Chain-link perimeter
      </li>
      <li>
        <CoordinateTag />
      </li>
    </ul>
  );
}

/** Banner used on schedule + fixtures interfaces. */
export function VenueEnvironmentBanner({ variant = 'attrition', label }) {
  return (
    <figure className="venue-banner">
      <VenueScene variant={variant} />
      <figcaption>
        <span className="venue-banner__label">{label ?? 'Match environment // Outdoor urban'}</span>
        <EnvironmentSpecs />
      </figcaption>
    </figure>
  );
}
