/** Stable product id from name + optional variant (size, etc.). */
export function getProductId(name, variant = null) {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  if (!variant) return base;
  const suffix = String(variant)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${base}--${suffix}`;
}

/** Parse "$80" → 80 */
export function parsePrice(priceDisplay) {
  return parseFloat(String(priceDisplay).replace(/[^0-9.]/g, '')) || 0;
}

/** Format 80 → "$80" (whole dollars) or "$80.00" if cents exist */
export function formatPrice(amount) {
  const hasCents = Math.round(amount * 100) % 100 !== 0;
  return hasCents ? `$${amount.toFixed(2)}` : `$${Math.round(amount)}`;
}

/**
 * Build checkout payload for one or many cart line items.
 * Backend accepts single-product fields or an `items` array for multi-item sessions.
 */
export function buildCheckoutPayload(items, { cancelUrl, returnPath }) {
  const lineItems = items.map((item) => ({
    name: item.name,
    description: item.description,
    image_url:
      item.image.startsWith('http') ? item.image : `${window.location.origin}${item.image}`,
    amount: item.price,
    quantity: item.quantity,
    ...(item.variant ? { variant: item.variant } : {}),
  }));

  if (lineItems.length === 1) {
    const [item] = lineItems;
    return {
      name: item.name,
      description: item.description,
      image_url: item.image_url,
      amount: item.amount,
      quantity: item.quantity,
      ...(item.variant ? { variant: item.variant } : {}),
      cancel_url: cancelUrl,
      return_path: returnPath,
    };
  }

  return {
    items: lineItems,
    cancel_url: cancelUrl,
    return_path: returnPath,
  };
}
