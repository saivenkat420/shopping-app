/**
 * Proxy: GET /api/products
 * 1. Verifies OUR user is logged in (jwt_token cookie)
 * 2. Checks Neon cache first (avoids CCBP call when cached)
 * 3. Uses proxy credentials to fetch from CCBP on cache miss
 */

const jwt = require('jsonwebtoken');
const { ccbpFetch } = require('../lib/ccbp-client');
const { getCached, setCached, TTL_PRODUCTS } = require('../lib/api-cache');

function verifyOurUser(req) {
  const token = req.cookies?.jwt_token || req.headers?.authorization?.replace('Bearer ', '');
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
  } catch {
    return null;
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Cache-Control', 'private, max-age=120'); // 2 min browser cache

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ourUser = verifyOurUser(req);
  if (!ourUser) {
    return res.status(401).json({ error: 'Please sign in to view products' });
  }

  try {
    const { sort_by, category, title_search, rating } = req.query || {};
    const cacheKey = `products:${sort_by || ''}:${category || ''}:${title_search || ''}:${rating || ''}`;

    const cached = await getCached(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    const params = new URLSearchParams();
    if (sort_by) params.set('sort_by', sort_by);
    if (category) params.set('category', category);
    if (title_search) params.set('title_search', title_search);
    if (rating) params.set('rating', rating);

    const response = await ccbpFetch('/products', params.toString());
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    await setCached(cacheKey, data, TTL_PRODUCTS);
    return res.status(200).json(data);
  } catch (err) {
    console.error('Products proxy error:', err);
    return res.status(500).json({ error: 'Failed to fetch products' });
  }
};
