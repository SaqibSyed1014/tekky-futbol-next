import { DEFAULT_FABRIC } from '@/data/productSpecs';

function WeightIcon() {
  return (
    <svg className="fabric-tag__icon" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
      <rect x="1.5" y="1.5" width="9" height="9" />
      <path d="M1.5 6L6 1.5M1.5 10.5l9-9M6 10.5l4.5-4.5" />
    </svg>
  );
}

function WeaveIcon() {
  return (
    <svg className="fabric-tag__icon" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
      <path d="M1.5 6c1-3 2-3 3 0s2 3 3 0 2-3 3 0" />
    </svg>
  );
}

/**
 * Technical fabric callouts for a clothing product card — e.g. "480 GSM" and
 * "FRENCH TERRY". Presentational only, so it renders in server or client trees.
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
  // Spans + list roles (not <ul>/<li>) so the tags are valid phrasing content
  // even when rendered inside a <button>, like the bundle picker's cards.
  return (
    <span className={`fabric-tags${className ? ` ${className}` : ''}`} role="list" aria-label="Fabric specifications">
      <span className="fabric-tag" role="listitem" title={`Fabric weight: ${weight}`}>
        <WeightIcon />
        <span className="visually-hidden">Fabric weight: </span>
        {weight}
      </span>
      <span className="fabric-tag fabric-tag--accent" role="listitem" title={`Fabric: ${fabric}`}>
        <WeaveIcon />
        <span className="visually-hidden">Fabric: </span>
        {fabric}
      </span>
    </span>
  );
}
