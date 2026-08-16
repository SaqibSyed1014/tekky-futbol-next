'use client';

/**
 * CartContext — client-side shopping cart with localStorage persistence.
 *
 * Values exposed:
 *   items          — cart line items
 *   itemCount      — total quantity across all items
 *   subtotal       — sum of price * quantity
 *   isOpen         — cart drawer visibility
 *   hydrated       — true after localStorage has been read
 *   addItem()      — add or increment a product
 *   removeItem()   — remove by line id
 *   updateQuantity — set quantity (removes if <= 0)
 *   clearCart()
 *   openCart() / closeCart() / toggleCart()
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  clearCartStorage,
  loadCartFromStorage,
  saveCartToStorage,
} from '@/lib/cartStorage';
import { getProductId, parsePrice } from '@/lib/shopUtils';

/** @typedef {Object} CartItem
 * @property {string} id         — line id (product id + variant)
 * @property {string} productId
 * @property {string} name
 * @property {number} price
 * @property {string} priceDisplay
 * @property {string} image
 * @property {string} description
 * @property {string | null} variant
 * @property {number} quantity
 * @property {number} updatedAt
 */

/** @typedef {Object} AddItemInput
 * @property {string} name
 * @property {string} price       — display price e.g. "$80"
 * @property {string} image
 * @property {string} description
 * @property {string | null} [variant]
 * @property {number} [quantity]
 */

const CartContext = createContext(null);

function makeLineId(productId, variant) {
  return variant ? `${productId}::${variant}` : productId;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadCartFromStorage();
    setItems(stored.items);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (items.length === 0) {
      clearCartStorage();
      return;
    }
    saveCartToStorage(items);
  }, [items, hydrated]);

  const addItem = useCallback((input) => {
    const {
      name,
      price: priceDisplay,
      image,
      description,
      variant = null,
      quantity = 1,
    } = input;

    const productId = getProductId(name, variant);
    const lineId = makeLineId(productId, variant);
    const price = parsePrice(priceDisplay);
    const now = Date.now();

    setItems((prev) => {
      const existing = prev.find((item) => item.id === lineId);
      if (existing) {
        return prev.map((item) =>
          item.id === lineId
            ? {
                ...item,
                quantity: item.quantity + quantity,
                updatedAt: now,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          id: lineId,
          productId,
          name,
          price,
          priceDisplay,
          image,
          description,
          variant,
          quantity,
          updatedAt: now,
        },
      ];
    });

    setIsOpen(true);
  }, []);

  const removeItem = useCallback((lineId) => {
    setItems((prev) => prev.filter((item) => item.id !== lineId));
  }, []);

  const updateQuantity = useCallback((lineId, quantity) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== lineId));
      return;
    }

    const now = Date.now();
    setItems((prev) =>
      prev.map((item) =>
        item.id === lineId ? { ...item, quantity, updatedAt: now } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    clearCartStorage();
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      isOpen,
      hydrated,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
      toggleCart,
    }),
    [
      items,
      itemCount,
      subtotal,
      isOpen,
      hydrated,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
      toggleCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/** Hook — must be used inside <CartProvider> */
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
