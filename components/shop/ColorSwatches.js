'use client';

/**
 * The 5 color variants every division product ships in.
 * `key` matches the image filename under public/images/divisions/<division>/<productType>/<key>.jpg
 */
export const PRODUCT_COLORS = [
  { key: 'blue', label: 'Blue', hex: '#2159E0' },
  { key: 'purple', label: 'Purple', hex: '#6C2BD9' },
  { key: 'sky-blue', label: 'Sky Blue', hex: '#17B8C9' },
  { key: 'green', label: 'Green', hex: '#22B14C' },
  { key: 'orange', label: 'Orange', hex: '#992a45' },
];

export const DEFAULT_COLOR_KEY = PRODUCT_COLORS[0].key;

/** Per-division swatch-color overrides — label stays the same, only the dot's hex changes. */
const DIVISION_COLOR_OVERRIDES = {
  finale: { orange: '#bf4845' },
};

function colorsForDivision(division) {
  const overrides = DIVISION_COLOR_OVERRIDES[division];
  if (!overrides) return PRODUCT_COLORS;
  return PRODUCT_COLORS.map((c) => (overrides[c.key] ? { ...c, hex: overrides[c.key] } : c));
}

export function colorLabelFor(key) {
  return PRODUCT_COLORS.find((c) => c.key === key)?.label || key;
}

/**
 * Row of circular color swatches. Controlled — pass `value` (color key) and `onChange`.
 * `division` is optional — lets a specific division override a swatch's hex
 * (e.g. Finale's last swatch) without affecting the others.
 */
export default function ColorSwatches({ value, onChange, division }) {
  const colors = colorsForDivision(division);
  return (
    <div className="color-swatches" role="radiogroup" aria-label="Color">
      {colors.map((c) => {
        const selected = value === c.key;
        return (
          <button
            key={c.key}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={c.label}
            title={c.label}
            className={`color-swatch${selected ? ' is-selected' : ''}`}
            style={{ '--swatch-color': c.hex }}
            onClick={() => onChange(c.key)}
          />
        );
      })}
    </div>
  );
}
