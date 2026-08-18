'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';

/**
 * Add to Cart action for shop product cards.
 *
 * @param {Object} props
 * @param {string} props.name
 * @param {string} props.sub — product description / subtitle
 * @param {string} props.price — display price e.g. "$80"
 * @param {string} props.image — image path
 * @param {string | null} [props.variant]
 */
export default function ShopProductActions({ name, sub, price, image, variant = null }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    addItem({
      name,
      description: sub,
      price,
      image,
      variant,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="shop-product-actions">
      <button
        type="button"
        className="cta"
        onClick={handleAddToCart}
      >
        {added ? 'Added!' : 'Add to Cart'}
      </button>
    </div>
  );
}
