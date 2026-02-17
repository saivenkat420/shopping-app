/**
 * CCBP API proxy client - PROXY CREDENTIALS ONLY (server-side)
 * Uses raja/raja@2021 to fetch product data from apis.ccbp.in
 * Token persisted in Neon to survive serverless cold starts
 */

const { neon } = require('@neondatabase/serverless');
const CCBP_LOGIN_URL = 'https://apis.ccbp.in/login';
const CCBP_BASE = 'https://apis.ccbp.in';
const CCBP_PROXY_USER = 'raja';
const CCBP_PROXY_PASSWORD = 'raja@2021';

const TOKEN_BUFFER_MS = 60 * 1000; // Refresh 1 min before expiry

async function getCcbpToken() {
  const sql = neon(process.env.DATABASE_URL);

  const rows = await sql`SELECT token, expires_at FROM ccbp_token WHERE id = 1`;
  if (rows.length > 0) {
    const { token, expires_at } = rows[0];
    if (new Date(expires_at).getTime() > Date.now() + TOKEN_BUFFER_MS) {
      return token;
    }
  }

  const response = await fetch(CCBP_LOGIN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: CCBP_PROXY_USER,
      password: CCBP_PROXY_PASSWORD,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error_msg || 'CCBP login failed');
  }

  const data = await response.json();
  const token = data.jwt_token;
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

  await sql`
    INSERT INTO ccbp_token (id, token, expires_at)
    VALUES (1, ${token}, ${expiresAt})
    ON CONFLICT (id) DO UPDATE SET token = ${token}, expires_at = ${expiresAt}
  `;

  return token;
}

async function ccbpFetch(path, query = '') {
  const token = await getCcbpToken();
  const url = query ? `${CCBP_BASE}${path}?${query}` : `${CCBP_BASE}${path}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
}

module.exports = { getCcbpToken, ccbpFetch };
