'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import CrossIcon from '@/components/ui/CrossIcon';
import { useCart } from '@/contexts/CartContext';
import { buildCheckoutPayload, formatPrice } from '@/lib/shopUtils';
import { initiateShopCheckout } from '@/services/shopApi';

export default function CartDrawer() {
  const {
    items,
    itemCount,
    subtotal,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();

  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  useEffect(() => {
    if (!isOpen) return undefined;

    function onKeyDown(e) {
      if (e.key === 'Escape') closeCart();
    }

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, closeCart]);

  async function handleCheckout() {
    if (items.length === 0 || checkingOut) return;

    sessionStorage.setItem('shopReturnPath', window.location.pathname);
    setCheckingOut(true);
    setCheckoutError('');

    const cancelUrl = `${window.location.origin}${window.location.pathname}?checkout=cancelled`;
    const payload = buildCheckoutPayload(items, {
      cancelUrl,
      returnPath: window.location.pathname,
    });

    try {
      const data = await initiateShopCheckout(payload);
      window.location.href = data.checkout_url;
    } catch (err) {
      setCheckingOut(false);
      if (!err || err.status === 0) {
        setCheckoutError('Network error — please check your connection and try again.');
      } else {
        setCheckoutError(err.message || 'Something went wrong. Please try again.');
      }
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="cart-drawer-overlay open"
      onClick={(e) => e.target === e.currentTarget && closeCart()}
      role="presentation"
    >
      <aside className="cart-drawer" aria-label="Shopping cart">
        <header className="cart-drawer-header">
          <h2>
            Your Cart
            {itemCount > 0 && <span className="cart-drawer-count">({itemCount})</span>}
          </h2>
          <CrossIcon onClick={closeCart} />
        </header>

        {items.length === 0 ? (
          <div className="cart-empty">
            <i className="fa-solid fa-cart-shopping" aria-hidden="true" />
            <p>Your cart is empty.</p>
            <p className="subtext">Add items from the shop to get started.</p>
            <button type="button" className="cta close-overlay" onClick={closeCart}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <ul className="cart-line-items">
              {items.map((item) => (
                <li key={item.id} className="cart-line-item">
                  <div className="cart-line-image">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={72}
                      height={72}
                      style={{ width: '100%', height: 'auto', borderRadius: 8 }}
                    />
                  </div>

                  <div className="cart-line-details">
                    <h3>{item.name}</h3>
                    {item.variant && <span className="muted">{item.variant}</span>}
                    <p className="price">{formatPrice(item.price)}</p>

                    <div className="cart-qty-row">
                      <div className="cart-qty-controls">
                        <button
                          type="button"
                          className="cart-qty-btn"
                          aria-label="Decrease quantity"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          −
                        </button>
                        <span className="cart-qty-value">{item.quantity}</span>
                        <button
                          type="button"
                          className="cart-qty-btn"
                          aria-label="Increase quantity"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="cart-remove-btn"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="cart-drawer-footer">
              <div className="cart-subtotal-row">
                <span>Subtotal</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>

              {checkoutError && (
                <p className="cart-checkout-error">{checkoutError}</p>
              )}

              <button
                type="button"
                className="cta close-overlay cart-checkout-btn"
                onClick={handleCheckout}
                disabled={checkingOut}
              >
                {checkingOut ? (
                  <>
                    <span className="spinner" />
                    Processing…
                  </>
                ) : (
                  'Checkout'
                )}
              </button>

              <button type="button" className="cart-clear-btn" onClick={clearCart}>
                Clear cart
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
