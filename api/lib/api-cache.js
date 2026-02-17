/**
 * Server-side API response cache (Neon)
 * Survives serverless cold starts - avoids repeated CCBP calls
 */

const { neon } = require('@neondatabase/serverless');

const TTL_PRODUCTS = 5 * 60; // 5 min
const TTL_DETAILS = 10 * 60; // 10 min

async function getCached(key) {
  const sql = neon(process.env.DATABASE_URL);
  const rows = await sql`
    SELECT response_data FROM api_cache
    WHERE cache_key = ${key} AND expires_at > now()
  `;
  return rows.length > 0 ? rows[0].response_data : null;
}

async function setCached(key, data, ttlSeconds = TTL_PRODUCTS) {
  const sql = neon(process.env.DATABASE_URL);
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
  await sql`
    INSERT INTO api_cache (cache_key, response_data, expires_at)
    VALUES (${key}, ${JSON.stringify(data)}, ${expiresAt})
    ON CONFLICT (cache_key) DO UPDATE SET
      response_data = ${JSON.stringify(data)},
      expires_at = ${expiresAt}
  `;
}

module.exports = { getCached, setCached, TTL_PRODUCTS, TTL_DETAILS };
