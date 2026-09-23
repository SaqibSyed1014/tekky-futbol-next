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

export function colorLabelFor(key) {
  return PRODUCT_COLORS.find((c) => c.key === key)?.label || key;
}

/**
 * Row of circular color swatches. Controlled — pass `value` (color key) and `onChange`.
 */
export default function ColorSwatches({ value, onChange }) {
  return (
    <div className="color-swatches" role="radiogroup" aria-label="Color">
      {PRODUCT_COLORS.map((c) => {
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
