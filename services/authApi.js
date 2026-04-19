/**
 * Auth-specific API calls.
 * Uses the shared api utility so JWT attachment and error handling are automatic.
 */

import api, { auth } from '@/services/api';

/**
 * POST /auth/login
 * Stores the returned token, returns the user object.
 *
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ user: object, token: string }>}
 */
export async function login({ email, password }) {
  const data = await api.post('/auth/login', { email, password });
  auth.setToken(data.token);
  return data;
}

/**
 * POST /auth/register
 * Stores the returned token if the server issues one on registration.
 *
 * @param {object} payload  Registration fields
 * @returns {Promise<{ user: object, token?: string }>}
 */
export async function register(payload) {
  const data = await api.post('/auth/register', payload);
  if (data.token) auth.setToken(data.token);
  return data;
}

/**
 * GET /auth/me
 * Returns the currently authenticated user, or null if unauthenticated.
 *
 * @returns {Promise<object|null>}
 */
export async function fetchMe() {
  if (!auth.getToken()) return null;
  return api.get('/auth/me');
}

/**
 * POST /auth/logout  (best-effort — always clears local token)
 */
export async function logout() {
  try {
    await api.post('/auth/logout');
  } catch {
    // Ignore server errors on logout
  } finally {
    auth.clearToken();
  }
}
