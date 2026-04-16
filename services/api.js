/**
 * TekkyFutbol API service layer.
 *
 * Centralises all HTTP calls so future backend/REST API integration
 * only requires changes here, not scattered across pages.
 *
 * Usage:
 *   import { get, post } from '@/services/api';
 *   const data = await get('/teams');
 *   const result = await post('/register', { name, email });
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Core fetch wrapper with consistent error handling.
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response.text().catch(() => 'Unknown error');
    throw new Error(`API ${response.status}: ${error}`);
  }

  return response.json();
}

/** GET request */
export function get(endpoint, options = {}) {
  return request(endpoint, { ...options, method: 'GET' });
}

/** POST request */
export function post(endpoint, body, options = {}) {
  return request(endpoint, {
    ...options,
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/** PUT request */
export function put(endpoint, body, options = {}) {
  return request(endpoint, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

/** DELETE request */
export function del(endpoint, options = {}) {
  return request(endpoint, { ...options, method: 'DELETE' });
}

/* ─── Future domain-specific helpers go here ─── */

// export const teamsApi = {
//   getAll: () => get('/teams'),
//   getById: (id) => get(`/teams/${id}`),
// };

// export const scheduleApi = {
//   getAll: () => get('/schedule'),
//   getByWeek: (week) => get(`/schedule?week=${week}`),
// };
