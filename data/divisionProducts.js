/**
 * Shop catalog for the North/South division product grids — single source
 * of truth, reused by the shop pages (app/shop/{north,south}-division) and
 * the Supporter Bundle merch picker on the ticket pages. `id` mirrors the
 * keys backend-side in apps.tickets.constants.SUPPORTER_BUNDLE_MERCH, which
 * revalidates whatever gets sent at checkout.
 */

export const DEFAULT_PRODUCT_COLOR = 'blue';

export const DIVISION_PRODUCTS = {
  north: [
    { id: 'north-hoodie', productType: 'Hoodie', name: 'PITCH SIDE HOODIE', sub: 'Season 01 North Drop', price: '$80' },
    { id: 'north-pant', productType: 'Pant', name: 'PITCH WARM-UP TROUSER', sub: 'Season 01 North Drop', price: '$60' },
    { id: 'north-short', productType: 'Short', name: 'S01 MATCH SHORTS', sub: 'Season 01 North Drop', price: '$50' },
    { id: 'north-tshirt', productType: 'Tshirt', name: 'S01 MATCH JERSEY', sub: 'Season 01 North Drop', price: '$90' },
  ],
  south: [
    { id: 'south-hoodie', productType: 'Hoodie', name: 'PITCH SIDE HOODIE', sub: 'Season 01 South Drop', price: '$80' },
    { id: 'south-pant', productType: 'Pant', name: 'PITCH WARM-UP TROUSER', sub: 'Season 01 South Drop', price: '$60' },
    { id: 'south-short', productType: 'Short', name: 'S01 MATCH SHORTS', sub: 'Season 01 South Drop', price: '$50' },
    { id: 'south-tshirt', productType: 'Tshirt', name: 'S01 MATCH JERSEY', sub: 'Season 01 South Drop', price: '$90' },
  ],
};

export function getDivisionProducts(division) {
  return DIVISION_PRODUCTS[division] || [];
}

export function getProductImage(division, productType, color = DEFAULT_PRODUCT_COLOR) {
  return `/images/divisions/${division}/${productType}/${color}.jpg`;
}

export function findProduct(division, id) {
  return getDivisionProducts(division).find((p) => p.id === id) || null;
}
