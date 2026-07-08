/**
 * api.js
 * ──────
 * Central API helper for the Grooming Store frontend.
 *
 * Usage:
 *   import { apiGet, apiPost } from '../utils/api';
 *
 *   const data = await apiGet('/api/test');
 *   const result = await apiPost('/api/orders', { items: [...] });
 */

// Read the backend URL from the Vite environment variable.
// Falls back to the deployed Render URL if the env var is missing.
const BASE_URL = import.meta.env.VITE_API_URL || 'https://backend-grooming-1.onrender.com';

/**
 * Core fetch wrapper.
 * Automatically sets Content-Type: application/json on POST/PUT/PATCH.
 * Throws an Error with the HTTP status if the response is not OK.
 *
 * @param {string} endpoint  - Path such as '/api/test'
 * @param {RequestInit} opts - Standard fetch options (method, body, headers…)
 * @returns {Promise<any>}   - Parsed JSON body
 */
const apiFetch = async (endpoint, opts = {}) => {
  const url = `${BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...opts.headers, // Allow callers to override / add headers
    },
    ...opts,
  });

  // Throw a descriptive error for non-2xx responses
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API Error ${response.status}: ${errorBody || response.statusText}`);
  }

  // Return parsed JSON
  return response.json();
};

// ─── Convenience Methods ───────────────────────────────────────

/** GET request */
export const apiGet = (endpoint, headers = {}) =>
  apiFetch(endpoint, { method: 'GET', headers });

/** POST request – body is auto-stringified */
export const apiPost = (endpoint, body = {}, headers = {}) =>
  apiFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    headers,
  });

/** PUT request – body is auto-stringified */
export const apiPut = (endpoint, body = {}, headers = {}) =>
  apiFetch(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers,
  });

/** DELETE request */
export const apiDelete = (endpoint, headers = {}) =>
  apiFetch(endpoint, { method: 'DELETE', headers });

export default apiFetch;
