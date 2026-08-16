import { CART_STORAGE_KEY, CART_EXPIRY_MS } from '@/constants/cart';

function emptyCart() {
  return { items: [], expiresAt: null };
}

/** @returns {{ items: import('@/contexts/CartContext').CartItem[], expiresAt: number | null }} */
export function loadCartFromStorage() {
  if (typeof window === 'undefined') return emptyCart();

  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return emptyCart();

    const parsed = JSON.parse(raw);
    const expiresAt = parsed?.expiresAt ?? null;

    if (!expiresAt || Date.now() > expiresAt) {
      localStorage.removeItem(CART_STORAGE_KEY);
      return emptyCart();
    }

    const items = Array.isArray(parsed.items) ? parsed.items : [];
    return { items, expiresAt };
  } catch {
    localStorage.removeItem(CART_STORAGE_KEY);
    return emptyCart();
  }
}

/** @param {import('@/contexts/CartContext').CartItem[]} items */
export function saveCartToStorage(items) {
  if (typeof window === 'undefined') return;

  const payload = {
    items,
    expiresAt: Date.now() + CART_EXPIRY_MS,
  };

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(payload));
}

export function clearCartStorage() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CART_STORAGE_KEY);
}
