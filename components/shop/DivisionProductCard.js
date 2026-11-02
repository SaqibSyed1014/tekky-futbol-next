'use client';

import { useState } from 'react';
import Image from 'next/image';
import ShopProductActions from './ShopProductActions';
import ColorSwatches, { DEFAULT_COLOR_KEY, colorLabelFor } from './ColorSwatches';
import FabricTags from './FabricTags';
import SizeSelector from './SizeSelector';
import { DEFAULT_FABRIC } from '@/data/productSpecs';
import { buildVariantLabel } from '@/lib/shopUtils';

/**
 * One division-shop product card — image, fabric tags, quantity, size and
 * color swatches. Product images live at
 * /images/divisions/<division>/<productType>/<color>.jpg — switching the
 * swatch swaps the displayed image. The chosen color and size are combined
 * into the cart variant ("Blue / M"), which is what the Stripe line item shows.
 *
 * @param {Object} props
 * @param {'north'|'south'|'finale'} props.division
 * @param {'Hoodie'|'Pant'|'Short'|'Tshirt'} props.productType
 * @param {string} props.name
 * @param {string} props.sub
 * @param {string} props.price
 * @param {{ weight: string, fabric: string }} [props.fabric] — overrides the storefront-wide fabric spec
 * @param {() => void} [props.onNotify] — opens the page's early-access modal instead of adding to cart
 */
export default function DivisionProductCard({ division, productType, name, sub, price, fabric = DEFAULT_FABRIC, onNotify }) {
  const [color, setColor] = useState(DEFAULT_COLOR_KEY);
  const [size, setSize] = useState('');
  const [sizeInvalid, setSizeInvalid] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const image = `/images/divisions/${division}/${productType}/${color}.jpg`;
  const colorLabel = colorLabelFor(color);

  function handleSizeChange(next) {
    setSize(next);
    setSizeInvalid(false);
  }

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
        variant={buildVariantLabel(colorLabel, size)}
        quantity={quantity}
        className="shop-product-card__cta"
        onNotify={onNotify}
        canAdd={Boolean(size)}
        onAddBlocked={() => setSizeInvalid(true)}
      />
    </div>
  );
}
