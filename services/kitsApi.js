import api from '@/services/api';

// ─── Team member endpoints ───────────────────────────────────────────────────

/**
 * GET /kits/my/
 * Returns { kit, my_order, is_captain, team_name, max_players }
 * kit is null if captain hasn't selected one yet.
 * my_order is null if the user hasn't submitted their order yet.
 */
export const getMyKit = () => api.get('/kits/my/');

/**
 * PATCH /kits/my/
 * Captain selects or changes the kit (only while not locked).
 * @param {string} kit_slug  e.g. "north-3"
 */
export const selectKit = (kit_slug) => api.patch('/kits/my/', { kit_slug });

/**
 * POST /kits/my/lock/
 * Captain locks the kit selection. Triggers admin email notification.
 */
export const lockKit = () => api.post('/kits/my/lock/');

/**
 * GET /kits/my/order/
 */
export const getMyKitOrder = () => api.get('/kits/my/order/');

/**
 * POST /kits/my/order/
 * @param {{ jersey_size, shorts_size, socks_size, name_on_kit?, number_on_kit? }} payload
 */
export const submitKitOrder = (payload) => api.post('/kits/my/order/', payload);

/**
 * PATCH /kits/my/order/
 * @param {{ jersey_size, shorts_size, socks_size, name_on_kit?, number_on_kit? }} payload
 */
export const updateKitOrder = (payload) => api.patch('/kits/my/order/', payload);

// ─── Admin endpoints ─────────────────────────────────────────────────────────

/**
 * GET /admin/kits/
 * Returns all team kit selections with nested player orders.
 */
export const getAdminKits = () => api.get('/admin/kits/');

/**
 * GET /admin/kits/export/
 * Returns CSV download URL — open in new tab.
 */
export const getKitExportUrl = () => `${process.env.NEXT_PUBLIC_API_URL || ''}/admin/kits/export/`;
