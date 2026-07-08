/**
 * useBackendCheck.js
 * ──────────────────
 * Invisible hook that tests the backend connection once on app startup.
 * Renders nothing. Logs results to the browser Console only.
 *
 * Success output:
 *   ✅ Backend Connected Successfully
 *   Backend Response: { message: '...', ... }
 *
 * Failure output:
 *   ❌ Backend Connection Failed
 *   [Cause] + suggested fix
 */

import { useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

/** Analyse the error and suggest a specific fix in the console */
const diagnose = (error, url) => {
  const msg = error?.message || String(error);

  // ── 1. Env variable not configured ─────────────────────────────
  if (!url || url.includes('YOUR-BACKEND')) {
    console.error(
      '%c[Fix] VITE_API_URL is not set correctly.',
      'color:#f87171;font-weight:bold'
    );
    console.info(
      '👉 Open frontend/.env and replace the placeholder:\n' +
      '   VITE_API_URL=https://your-actual-service.onrender.com\n' +
      '   Then restart the Vite dev server (npm run dev).'
    );
    return;
  }

  // ── 2. CORS error ───────────────────────────────────────────────
  if (msg.toLowerCase().includes('cors') || msg.toLowerCase().includes('blocked')) {
    console.error('%c[Fix] CORS error detected.', 'color:#f87171;font-weight:bold');
    console.info(
      '👉 In backend/server.js, make sure your frontend origin is in allowedOrigins:\n' +
      `   '${window.location.origin}'\n` +
      '   Then redeploy the backend on Render.'
    );
    return;
  }

  // ── 3. Failed to fetch / network error ─────────────────────────
  if (msg.toLowerCase().includes('failed to fetch') || msg.toLowerCase().includes('networkerror')) {
    console.error('%c[Fix] Network / fetch error.', 'color:#f87171;font-weight:bold');
    console.info(
      '👉 Possible causes:\n' +
      '   • Backend is not deployed yet on Render.\n' +
      '   • Render free tier is spinning up (can take ~30 s on first request — try again).\n' +
      '   • VITE_API_URL is pointing to the wrong URL.\n' +
      `   • Current VITE_API_URL: ${url}`
    );
    return;
  }

  // ── 4. HTTP 404 ─────────────────────────────────────────────────
  if (msg.includes('404')) {
    console.error('%c[Fix] 404 Not Found.', 'color:#f87171;font-weight:bold');
    console.info(
      '👉 The /api/test route does not exist on the backend.\n' +
      '   Check backend/server.js for:\n' +
      "   app.get('/api/test', (req, res) => { res.json({ message: '...' }); });"
    );
    return;
  }

  // ── 5. HTTP 401 / 403 ───────────────────────────────────────────
  if (msg.includes('401') || msg.includes('403')) {
    console.error('%c[Fix] Authentication / Authorisation error.', 'color:#f87171;font-weight:bold');
    console.info(
      '👉 The backend is rejecting the request.\n' +
      '   Make sure the route does not require authentication.'
    );
    return;
  }

  // ── 6. Generic fallback ─────────────────────────────────────────
  console.error('%c[Fix] Unknown error. Details above.', 'color:#f87171;font-weight:bold');
  console.info(
    '👉 Check:\n' +
    '   1. VITE_API_URL in frontend/.env\n' +
    '   2. Backend is deployed and running on Render\n' +
    '   3. CORS allowedOrigins in backend/server.js includes your frontend URL\n' +
    `   4. Full error: ${msg}`
  );
};

/**
 * useBackendCheck
 * ───────────────
 * Call this hook once at the top of the app (e.g. in App.jsx).
 * It fires a single GET /api/test on mount, then logs the result.
 */
const useBackendCheck = () => {
  useEffect(() => {
    const check = async () => {
      // ── Guard: env var not configured ────────────────────────────
      if (!API_URL || API_URL.includes('YOUR-BACKEND')) {
        console.warn(
          '⚠️  Backend check skipped — VITE_API_URL is not configured.'
        );
        diagnose(new Error('env-not-set'), API_URL);
        return;
      }

      const endpoint = `${API_URL}/api/test`;

      try {
        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // ── ✅ Success ────────────────────────────────────────────
        console.log(
          '%c✅ Backend Connected Successfully',
          'color:#4ade80;font-weight:bold;font-size:13px'
        );
        console.log('Backend Response:', data);
      } catch (error) {
        // ── ❌ Failure ────────────────────────────────────────────
        console.error(
          '%c❌ Backend Connection Failed',
          'color:#f87171;font-weight:bold;font-size:13px'
        );
        console.error('Error:', error.message);
        diagnose(error, API_URL);
      }
    };

    check();
  }, []); // Run only once on mount
};

export default useBackendCheck;
