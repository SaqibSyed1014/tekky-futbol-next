import { DEFAULT_FABRIC } from '@/data/productSpecs';

function WeightIcon() {
  return (
    <svg className="fabric-tag__icon" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
      <rect x="1.5" y="1.5" width="9" height="9" />
      <path d="M1.5 6L6 1.5M1.5 10.5l9-9M6 10.5l4.5-4.5" />
    </svg>
  );
}

/**
 * Technical fabric callout for a clothing product card — a single tag reading
 * "480 GSM FRENCH TERRY" (weight + fabric are one spec, not two). Presentational
 * only, so it renders in server or client trees.
 *
 * @param {Object} props
 * @param {string} [props.weight]  — fabric weight, defaults to the storefront-wide spec
 * @param {string} [props.fabric]  — fabric type, defaults to the storefront-wide spec
 * @param {string} [props.className]
 */
export default function FabricTags({
  weight = DEFAULT_FABRIC.weight,
  fabric = DEFAULT_FABRIC.fabric,
  className = '',
}) {
  // Spans + list roles (not <ul>/<li>) so the tag is valid phrasing content
  // even when rendered inside a <button>, like the bundle picker's cards.
  const spec = `${weight} ${fabric}`;
  return (
    <span className={`fabric-tags${className ? ` ${className}` : ''}`} role="list" aria-label="Fabric specification">
      <span className="fabric-tag" role="listitem" title={`Fabric: ${spec}`}>
        <WeightIcon />
        <span className="visually-hidden">Fabric: </span>
        {spec}
      </span>
    </span>
  );
}
