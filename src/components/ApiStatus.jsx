import React, { useState, useEffect } from 'react';

// The backend base URL comes from the .env file (VITE_API_URL).
// Vite exposes env variables prefixed with VITE_ via import.meta.env.
const API_URL = import.meta.env.VITE_API_URL;

/**
 * ApiStatus
 * ─────────
 * Fetches GET /api/test from the Express backend and
 * displays the response. Useful as a connectivity health-check
 * and as a reference example for other API calls in the project.
 */
const ApiStatus = () => {
  // Store the message returned by the backend
  const [message, setMessage] = useState('');

  // Store any error that occurs during the fetch
  const [error, setError] = useState('');

  // Track whether the request is in-flight
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Guard: if the env variable is not set, show a helpful warning
    if (!API_URL || API_URL.includes('YOUR-BACKEND')) {
      setError('⚠️  VITE_API_URL is not configured. Open frontend/.env and replace the placeholder with your Render URL.');
      setLoading(false);
      return;
    }

    // Fetch the /api/test endpoint from the backend
    fetch(`${API_URL}/api/test`)
      .then((res) => {
        // Throw if the HTTP status is not 2xx
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        return res.json(); // Parse the JSON body
      })
      .then((data) => {
        // Success – store the message from the backend
        setMessage(data.message);
        setLoading(false);
      })
      .catch((err) => {
        // Network error or non-2xx response
        setError(`Failed to reach backend: ${err.message}`);
        setLoading(false);
      });
  }, []); // Run only once when the component mounts

  // ─── Render ───────────────────────────────────────────────────
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>🔗 Backend Connection Status</h3>

      {loading && (
        <p style={styles.loading}>Connecting to backend…</p>
      )}

      {!loading && message && (
        <p style={styles.success}>✅ {message}</p>
      )}

      {!loading && error && (
        <p style={styles.error}>{error}</p>
      )}

      <p style={styles.url}>
        API URL: <code>{API_URL || 'Not set'}</code>
      </p>
    </div>
  );
};

// ─── Inline styles (keeps this component self-contained) ──────
const styles = {
  card: {
    background: '#1a1a2e',
    border: '1px solid rgba(201,168,76,0.3)',
    borderRadius: '12px',
    padding: '20px 24px',
    maxWidth: '480px',
    margin: '16px auto',
    fontFamily: 'Inter, sans-serif',
    color: '#e2e2e2',
  },
  title: {
    margin: '0 0 12px',
    fontSize: '14px',
    fontWeight: '700',
    letterSpacing: '0.05em',
    color: '#C9A84C',
    textTransform: 'uppercase',
  },
  loading: {
    color: '#94a3b8',
    fontSize: '13px',
  },
  success: {
    color: '#4ade80',
    fontSize: '14px',
    fontWeight: '600',
  },
  error: {
    color: '#f87171',
    fontSize: '13px',
    lineHeight: '1.5',
  },
  url: {
    marginTop: '10px',
    fontSize: '11px',
    color: '#64748b',
  },
};

export default ApiStatus;
