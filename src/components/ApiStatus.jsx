/**
 * ApiStatus.jsx
 * ─────────────
 * Invisible component — renders nothing in the UI.
 * On app startup it silently tests the backend connection and
 * logs the result in the browser Console only.
 *
 * Console messages:
 *   ✅ Backend Connected Successfully  →  on success
 *   ❌ Backend Connection Failed       →  on failure + auto-diagnosis
 *
 * Drop this anywhere in the component tree (e.g. App.jsx) — it has
 * zero visual footprint.
 */

import useBackendCheck from '../hooks/useBackendCheck';

const ApiStatus = () => {
  // Run the connection test; result goes to the browser Console only
  useBackendCheck();

  // Render nothing — no banner, no badge, no DOM elements
  return null;
};

export default ApiStatus;
