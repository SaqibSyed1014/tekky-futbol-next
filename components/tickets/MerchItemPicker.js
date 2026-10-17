'use client';

import Image from 'next/image';
import { getProductImage } from '@/data/divisionProducts';

/**
 * Single-select grid of shop products for the Supporter Bundle merch picker.
 * Deliberately simpler than DivisionProductCard — no quantity stepper, no
 * color swatches, no cart integration — this is "pick one item", not "shop".
 *
 * @param {'north'|'south'} division
 * @param {Array} products  - from getDivisionProducts(division)
 * @param {string} selectedId
 * @param {(id: string) => void} onSelect
 */
export default function MerchItemPicker({ division, products, selectedId, onSelect }) {
  return (
    <div className="grid merch-picker-grid">
      {products.map((p) => {
        const isSelected = selectedId === p.id;
        const image = getProductImage(division, p.productType);
        return (
          <button
            key={p.id}
            type="button"
            className={`shop-product-card merch-picker-card${isSelected ? ' is-selected' : ''}`}
            onClick={() => onSelect(p.id)}
            aria-pressed={isSelected}
          >
            <div className="shop-product-card__media">
              <Image
                src={image}
                alt={p.name}
                width={400}
                height={320}
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
            <div className="shop-product-card__body">
              <h3 className="shop-product-card__title">{p.name}</h3>
              <p className="shop-product-card__desc">{p.sub}</p>
              <div className="shop-product-card__price-row" style={{ marginBottom: 0 }}>
                <span className="shop-product-card__price">{p.price}</span>
                {isSelected && <span className="merch-picker-card__badge">Selected</span>}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
