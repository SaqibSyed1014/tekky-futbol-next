'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { buildCheckoutPayload } from '@/lib/shopUtils';
import { initiateShopCheckout } from '@/services/shopApi';

/**
 * Add to Cart + Buy Now actions for shop product cards.
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
  const [buying, setBuying] = useState(false);
  const [buyError, setBuyError] = useState('');
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

  async function handleBuyNow() {
    sessionStorage.setItem('shopReturnPath', window.location.pathname);
    setBuying(true);
    setBuyError('');

    const cancelUrl = `${window.location.origin}${window.location.pathname}?checkout=cancelled`;
    const payload = buildCheckoutPayload(
      [
        {
          name,
          description: sub,
          price: parseFloat(price.replace(/[^0-9.]/g, '')) || 0,
          image,
          quantity: 1,
          variant,
        },
      ],
      { cancelUrl, returnPath: window.location.pathname }
    );

    try {
      const data = await initiateShopCheckout(payload);
      window.location.href = data.checkout_url;
    } catch (err) {
      setBuying(false);
      if (!err || err.status === 0) {
        setBuyError('Network error — please check your connection and try again.');
      } else {
        setBuyError(err.message || 'Something went wrong. Please try again.');
      }
    }
  }

  return (
    <div className="shop-product-actions">
      <button
        type="button"
        className="cta"
        onClick={handleAddToCart}
        disabled={buying}
      >
        {added ? 'Added!' : 'Add to Cart'}
      </button>
      <button
        type="button"
        className="cta un-focused"
        onClick={handleBuyNow}
        disabled={buying}
      >
        {buying ? 'Processing…' : 'Buy Now'}
      </button>
      {buyError && <p className="shop-buy-error">{buyError}</p>}
    </div>
  );
}
