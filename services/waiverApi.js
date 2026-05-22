import api from './api';

/**
 * GET /api/v1/waivers/me/
 * Returns { waiver_signed: bool, ...signature fields if signed }
 */
export const getWaiverStatus = () =>
  api.get('/waivers/me/');

/**
 * POST /api/v1/waivers/me/
 * Submit the signed waiver.
 *
 * Required fields:
 * @param {Object} payload.clauses_initialed  — { age_18_or_older: true, … } (all 12 keys)
 * @param {string} payload.printed_name       — signer's full legal name
 * @param {string} payload.signature_image    — typed name or base64 PNG
 *
 * All other fields (date_of_birth, address, emergency_contact_*) are optional.
 */
export const signWaiver = (payload) =>
  api.post('/waivers/me/', payload);

/**
 * GET /api/v1/admin/waivers/signed/
 * Admin-only: list of users who have signed.
 */
export const getAdminWaiverSigned = (params = {}) =>
  api.get('/admin/waivers/signed/', { params });

/**
 * GET /api/v1/admin/waivers/unsigned/
 * Admin-only: list of users who have NOT signed.
 */
export const getAdminWaiverUnsigned = (params = {}) =>
  api.get('/admin/waivers/unsigned/', { params });

/**
 * GET /api/v1/admin/waivers/<userId>/
 * Admin-only: full waiver record for a single user.
 * Used by the "View Waiver" feature to pre-fill the read-only form.
 */
export const getAdminWaiverDetail = (userId) =>
  api.get(`/admin/waivers/${userId}/`);
