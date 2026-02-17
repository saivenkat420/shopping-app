/**
 * In-memory cache for products - avoids refetch on back/forward navigation
 * TTL: 5 minutes for products list, 10 minutes for product details
 */

const CACHE_TTL_PRODUCTS = 5 * 60 * 1000 // 5 min
const CACHE_TTL_DETAILS = 10 * 60 * 1000 // 10 min

const productsCache = new Map()
const productDetailsCache = new Map()

function getCacheKey(params) {
  return JSON.stringify(params || {})
}

export function getCachedProducts(params) {
  const key = getCacheKey(params)
  const entry = productsCache.get(key)
  if (!entry || Date.now() > entry.expiry) return null
  return entry.data
}

export function setCachedProducts(params, data) {
  const key = getCacheKey(params)
  productsCache.set(key, {
    data,
    expiry: Date.now() + CACHE_TTL_PRODUCTS,
  })
}

export function getCachedProductDetails(id) {
  const entry = productDetailsCache.get(id)
  if (!entry || Date.now() > entry.expiry) return null
  return entry.data
}

export function setCachedProductDetails(id, data) {
  productDetailsCache.set(id, {
    data,
    expiry: Date.now() + CACHE_TTL_DETAILS,
  })
}
