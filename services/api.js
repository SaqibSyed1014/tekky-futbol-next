/**
 * TekkyFutbol API utility layer.
 *
 * - Reads base URL from NEXT_PUBLIC_API_URL env var
 * - Attaches JWT token from localStorage automatically (client-side only)
 * - Handles errors globally: 401 clears token + redirects to /login,
 *   other non-2xx errors throw a structured ApiError
 *
 * Usage:
 *   import api from '@/services/api';
 *   const data   = await api.get('/teams');
 *   const result = await api.post('/register', { name, email });
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// ─── Structured error class ──────────────────────────────────────────────────

export class ApiError extends Error {
  /**
   * @param {number} status   HTTP status code
   * @param {string} message  Human-readable message
   * @param {*}      data     Parsed response body (if any)
   */
  constructor(status, message, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// ─── Token helpers (client-side only) ───────────────────────────────────────

const TOKEN_KEY = 'tf_token';

export const auth = {
  getToken: () => (typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null),
  setToken: (token) => { if (typeof window !== 'undefined') localStorage.setItem(TOKEN_KEY, token); },
  clearToken: () => { if (typeof window !== 'undefined') localStorage.removeItem(TOKEN_KEY); },
};

// ─── Global error handler ────────────────────────────────────────────────────

/**
 * Called for every non-2xx response.
 * Override this to plug in toast notifications, Sentry, etc.
 */
function handleGlobalError(error) {
  if (error.status === 401) {
    auth.clearToken();
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
      window.location.href = '/login';
    }
  }
  // Re-throw so callers can catch specific errors too
  throw error;
}

// ─── Core request ────────────────────────────────────────────────────────────

/**
 * @param {string} endpoint  Path relative to BASE_URL (e.g. '/teams')
 * @param {RequestInit} options  Standard fetch options
 * @returns {Promise<*>}  Parsed JSON response body
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  // Don't set Content-Type for FormData — the browser sets it automatically
  // with the correct multipart boundary.  For everything else default to JSON.
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    Accept: 'application/json',
    ...options.headers,
  };

  // Attach JWT if present
  const token = auth.getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(url, { ...options, headers });
  } catch (networkError) {
    // Network failure (offline, DNS, CORS preflight, etc.)
    throw new ApiError(0, 'Network error — please check your connection.');
  }

  // 204 No Content — return null, not JSON
  if (response.status === 204) return null;

  // Attempt to parse body for both success and error cases
  let body = null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    body = await response.json().catch(() => null);
  } else {
    body = await response.text().catch(() => null);
  }

  if (!response.ok) {
    const message =
      (body && (body.message || body.error)) ||
      `Request failed with status ${response.status}`;
    return handleGlobalError(new ApiError(response.status, message, body));
  }

  return body;
}

// ─── HTTP method helpers ─────────────────────────────────────────────────────

const api = {
  /** GET /endpoint */
  get(endpoint, options = {}) {
    return request(endpoint, { ...options, method: 'GET' });
  },

  /** POST /endpoint with JSON body */
  post(endpoint, body, options = {}) {
    return request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  /** PUT /endpoint with JSON body */
  put(endpoint, body, options = {}) {
    return request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  /** PATCH /endpoint with JSON body */
  patch(endpoint, body, options = {}) {
    return request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  /** DELETE /endpoint */
  delete(endpoint, options = {}) {
    return request(endpoint, { ...options, method: 'DELETE' });
  },

  /**
   * Multipart file upload — skips Content-Type so the browser sets the boundary.
   * @param {string} endpoint
   * @param {FormData} formData
   */
  upload(endpoint, formData, options = {}) {
    const headers = { Accept: 'application/json', ...options.headers };
    const token = auth.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return request(endpoint, { ...options, method: 'POST', headers, body: formData });
  },
};

export default api;

// ─── Domain-specific API groups ──────────────────────────────────────────────
// Uncomment and extend as the backend is built out.

// export const teamsApi = {
//   getAll:   ()     => api.get('/teams'),
//   getById:  (id)   => api.get(`/teams/${id}`),
//   create:   (data) => api.post('/teams', data),
//   update:   (id, data) => api.put(`/teams/${id}`, data),
//   remove:   (id)   => api.delete(`/teams/${id}`),
// };

// export const scheduleApi = {
//   getAll:    ()       => api.get('/schedule'),
//   getByWeek: (week)   => api.get(`/schedule?week=${week}`),
// };

// export const standingsApi = {
//   getNorth: () => api.get('/standings/north'),
//   getSouth: () => api.get('/standings/south'),
// };

// export const authApi = {
//   login:   (credentials) => api.post('/auth/login', credentials),
//   logout:  ()            => api.post('/auth/logout'),
//   refresh: ()            => api.post('/auth/refresh'),
// };
