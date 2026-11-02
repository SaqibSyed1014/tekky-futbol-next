'use client';

import { useState } from 'react';
import Image from 'next/image';
import ShopProductActions from './ShopProductActions';
import FabricTags from './FabricTags';
import SizeSelector from './SizeSelector';
import { DEFAULT_FABRIC } from '@/data/productSpecs';

/**
 * A shop product card with no color variants — same visual design as
 * DivisionProductCard (image, fabric tags, price + quantity row, size,
 * full-width CTA), used for one-off items that ship in a single fixed
 * design, e.g. the Streetwear capsule drops.
 *
 * @param {Object} props
 * @param {string} props.image
 * @param {string} props.name
 * @param {string} props.sub
 * @param {string} props.price
 * @param {{ weight: string, fabric: string }} [props.fabric] — overrides the storefront-wide fabric spec
 * @param {() => void} [props.onNotify] — opens the page's early-access modal instead of adding to cart
 */
export default function SimpleProductCard({ image, name, sub, price, fabric = DEFAULT_FABRIC, onNotify }) {
  const [size, setSize] = useState('');
  const [sizeInvalid, setSizeInvalid] = useState(false);
  const [quantity, setQuantity] = useState(1);

  function handleSizeChange(next) {
    setSize(next);
    setSizeInvalid(false);
  }

  return (
    <div className="shop-product-card">
      <div className="shop-product-card__media">
        <Image
          src={image}
          alt={name}
          width={400}
          height={320}
          style={{ width: '100%', height: 'auto' }}
        />
      </div>

      <div className="shop-product-card__body">
        <h3 className="shop-product-card__title">{name}</h3>
        <p className="shop-product-card__desc">{sub}</p>
        <FabricTags weight={fabric.weight} fabric={fabric.fabric} />

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
          <SizeSelector value={size} onChange={handleSizeChange} invalid={sizeInvalid} />
        </div>
      </div>

      <ShopProductActions
        name={name}
        sub={sub}
        price={price}
        image={image}
        variant={size || null}
        quantity={quantity}
        className="shop-product-card__cta"
        onNotify={onNotify}
        canAdd={Boolean(size)}
        onAddBlocked={() => setSizeInvalid(true)}
      />
    </div>
  );
}
