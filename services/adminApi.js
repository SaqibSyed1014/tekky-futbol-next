/**
 * Admin API — applications management.
 * All calls go through the shared api utility (JWT auto-attached).
 */

import api from '@/services/api';
import { ITEMS_PER_PAGE } from '@/constants/admin';

/**
 * GET /applications
 * Returns a paginated list of applications.
 *
 * @param {{ status?: string, page?: number, limit?: number }} params
 * @returns {Promise<{ data: object[], total: number, page: number, limit: number }>}
 */
export function getApplications({ status = '', page = 1, limit = ITEMS_PER_PAGE } = {}) {
  const query = new URLSearchParams({ page, limit });
  if (status) query.set('status', status);
  return api.get(`/applications/?${query}`);
}

/**
 * PATCH /applications/:id/approve
 *
 * @param {string} id
 * @returns {Promise<object>}  Updated application record
 */
export function approveApplication(id) {
  return api.patch(`/applications/${id}/approve/`);
}

/**
 * PATCH /applications/:id/reject
 *
 * @param {string} id
 * @param {string} [reason]  Optional rejection note
 * @returns {Promise<object>}  Updated application record
 */
export function rejectApplication(id, reason = '') {
  return api.patch(`/applications/${id}/reject/`, { reason });
}

/**
 * PATCH /admin/applications/:id
 * Generic status update — used for waitlist and interview transitions
 * which require an optional admin note.
 *
 * @param {string} id
 * @param {string} status    Target status: 'waitlist' | 'interview'
 * @param {string} [adminNotes]  Optional note stored on the application
 * @returns {Promise<object>}  Updated application record
 */
export function updateApplicationStatus(id, status, adminNotes = '') {
  const body = { status };
  if (adminNotes.trim()) body.admin_notes = adminNotes.trim();
  return api.patch(`/admin/applications/${id}/`, body);
}
