'use client';

import { useState } from 'react';
import Image from 'next/image';
import ShopProductActions from './ShopProductActions';
import ColorSwatches, { DEFAULT_COLOR_KEY, colorLabelFor } from './ColorSwatches';

/**
 * One division-shop product card — image, quantity, and color swatches.
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
  const [quantity, setQuantity] = useState(1);

  const image = `/images/divisions/${division}/${productType}/${color}.jpg`;
  const colorLabel = colorLabelFor(color);

  return (
    <div className="shop-product-card">
      <div className="shop-product-card__media">
        <Image
          src={image}
          alt={`${name} — ${colorLabel}`}
          width={400}
          height={320}
          style={{ width: '100%', height: 'auto' }}
        />
      </div>

      <div className="shop-product-card__body">
        <h3 className="shop-product-card__title">{name}</h3>
        <p className="shop-product-card__desc">{sub}</p>

        <div className="shop-product-card__price-row">
          <span className="shop-product-card__price">{price}</span>
          <div className="qty-stepper">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              &minus;
            </button>
            <span>{quantity}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQuantity((q) => Math.min(99, q + 1))}
            >
              +
            </button>
          </div>
        </div>

        <div className="shop-product-card__field">
          <span className="shop-product-card__label">Colors</span>
          <ColorSwatches value={color} onChange={setColor} division={division} />
        </div>
      </div>

      <ShopProductActions
        name={name}
        sub={sub}
        price={price}
        image={image}
        variant={colorLabel}
        quantity={quantity}
        className="shop-product-card__cta"
      />
    </div>
  );
}
