'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';

/**
 * "Notify Me At Drop" action for shop product cards. When the page supplies
 * `onNotify` (i.e. the product isn't live for purchase yet), the button opens
 * that page's early-access modal instead of adding the item to the cart.
 *
 * @param {Object} props
 * @param {string} props.name
 * @param {string} props.sub — product description / subtitle
 * @param {string} props.price — display price e.g. "$80"
 * @param {string} props.image — image path
 * @param {string | null} [props.variant]
 * @param {number} [props.quantity]
 * @param {string} [props.className] — override the wrapper class (default 'shop-product-actions')
 * @param {() => void} [props.onNotify] — opens the page's early-access modal; when omitted, falls back to adding the item to the cart
 */
export default function ShopProductActions({ name, sub, price, image, variant = null, quantity = 1, className = 'shop-product-actions', onNotify }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    if (onNotify) {
      onNotify();
      return;
    }
    addItem({
      name,
      description: sub,
      price,
      image,
      variant,
      quantity,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className={className}>
      <button
        type="button"
        className="cta"
        onClick={handleClick}
      >
        {added ? 'Added!' : 'Notify Me At Drop'}
      </button>
    </div>
  );
}
