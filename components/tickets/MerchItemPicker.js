'use client';

import { useState } from 'react';
import Image from 'next/image';
import ColorSwatches, { DEFAULT_COLOR_KEY } from '@/components/shop/ColorSwatches';
import { getProductImage } from '@/data/divisionProducts';

/**
 * Single-select grid of shop products for the Supporter Bundle merch picker.
 * Deliberately simpler than DivisionProductCard — no quantity stepper, no
 * cart integration — this is "pick one item (+ color)", not "shop".
 *
 * @param {'north'|'south'} division
 * @param {Array} products  - from getDivisionProducts(division)
 * @param {string} selectedId
 * @param {(id: string, color: string) => void} onSelect  - fires on initial
 *   selection AND whenever the already-selected card's color changes
 */
export default function MerchItemPicker({ division, products, selectedId, onSelect }) {
  return (
    <div className="grid merch-picker-grid">
      {products.map((p) => (
        <MerchItemCard
          key={p.id}
          division={division}
          product={p}
          isSelected={selectedId === p.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

function MerchItemCard({ division, product, isSelected, onSelect }) {
  const [color, setColor] = useState(DEFAULT_COLOR_KEY);
  const image = getProductImage(division, product.productType, color);

  function handleColorChange(nextColor) {
    setColor(nextColor);
    if (isSelected) onSelect(product.id, nextColor);
  }

  return (
    <div className={`shop-product-card merch-picker-card${isSelected ? ' is-selected' : ''}`}>
      <button
        type="button"
        className="merch-picker-card__select"
        onClick={() => onSelect(product.id, color)}
        aria-pressed={isSelected}
      >
        <div className="shop-product-card__media">
          <Image
            src={image}
            alt={product.name}
            width={400}
            height={320}
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
        <div className="shop-product-card__body">
          <h3 className="shop-product-card__title">{product.name}</h3>
          <p className="shop-product-card__desc">{product.sub}</p>
          <div className="shop-product-card__price-row">
            <span className="shop-product-card__price">{product.price}</span>
            {isSelected && <span className="merch-picker-card__badge">Selected</span>}
          </div>
        </div>
      </button>

      <div className="shop-product-card__field merch-picker-card__colors">
        <span className="shop-product-card__label">Colors</span>
        <ColorSwatches value={color} onChange={handleColorChange} division={division} />
      </div>
    </div>
  );
}
