'use client';

import { useState } from 'react';
import Image from 'next/image';
import ShopProductActions from './ShopProductActions';
import ColorSwatches, { DEFAULT_COLOR_KEY, colorLabelFor } from './ColorSwatches';

/**
 * One division-shop product card with a color swatch selector.
 * Product images live at /images/divisions/<division>/<productType>/<color>.jpg —
 * switching the swatch swaps the displayed image and the color that gets
 * added to the cart (and, from there, shown on the Stripe checkout line item).
 *
 * @param {Object} props
 * @param {'north'|'south'|'finale'} props.division
 * @param {'Hoodie'|'Pant'|'Short'|'Tshirt'} props.productType
 * @param {string} props.name
 * @param {string} props.sub
 * @param {string} props.price
 */
export default function DivisionProductCard({ division, productType, name, sub, price }) {
  const [color, setColor] = useState(DEFAULT_COLOR_KEY);
  const image = `/images/divisions/${division}/${productType}/${color}.jpg`;
  const colorLabel = colorLabelFor(color);

  return (
    <div className="card">
      <div className="img-placeholder real">
        <Image
          src={image}
          alt={`${name} — ${colorLabel}`}
          width={300}
          height={200}
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
      <h3>{name}</h3>
      <span className="muted">{sub}</span>
      <p className="price">{price}</p>
      <ColorSwatches value={color} onChange={setColor} />
      <ShopProductActions
        name={name}
        sub={sub}
        price={price}
        image={image}
        variant={colorLabel}
      />
    </div>
  );
}
