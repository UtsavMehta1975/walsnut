// Simple in-memory cache for development
// In production, you'd want to use Redis or similar

interface CacheItem {
  value: any
  timestamp: number
  ttl: number
}

class MemoryCache {
  private cache = new Map<string, CacheItem>()

  set(key: string, value: any, ttlSeconds = 300) {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000
    })
  }

  get(key: string) {
    const item = this.cache.get(key)
    if (!item) return null

    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.value
  }

  delete(key: string) {
    this.cache.delete(key)
  }

  clear() {
    this.cache.clear()
  }

  // Clean expired items
  cleanup() {
    const now = Date.now()
    this.cache.forEach((item, key) => {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
      }
    })
  }

  // Get all keys for cache invalidation
  getKeys(): string[] {
    return Array.from(this.cache.keys())
  }
}

export const cache = new MemoryCache()

// Cache key generators
export const cacheKeys = {
  products: (limit: number, offset: number) => `products:${limit}:${offset}`,
  featuredProducts: () => 'products:featured',
  product: (id: string) => `product:${id}`,
  user: (email: string) => `user:${email}`,
  categories: () => 'categories:all',
}

// Cache with automatic cleanup
setInterval(() => {
  cache.cleanup()
}, 60000) // Clean every minute

// Utility functions for cached database queries
export const cachedQueries = {
  async getProducts(limit = 20, offset = 0, dbQuery: () => Promise<any>) {
    const key = cacheKeys.products(limit, offset)
    let result = cache.get(key)
    
    if (!result) {
      result = await dbQuery()
      cache.set(key, result, 300) // 5 minutes
    }
    
    return result
  },

  async getFeaturedProducts(dbQuery: () => Promise<any>) {
    const key = cacheKeys.featuredProducts()
    let result = cache.get(key)
    
    if (!result) {
      result = await dbQuery()
      cache.set(key, result, 600) // 10 minutes
    }
    
    return result
  },

  async getProduct(id: string, dbQuery: () => Promise<any>) {
    const key = cacheKeys.product(id)
    let result = cache.get(key)
    
    if (!result) {
      result = await dbQuery()
      cache.set(key, result, 900) // 15 minutes
    }
    
    return result
  },

  async getUser(email: string, dbQuery: () => Promise<any>) {
    const key = cacheKeys.user(email)
    let result = cache.get(key)
    
    if (!result) {
      result = await dbQuery()
      cache.set(key, result, 1800) // 30 minutes
    }
    
    return result
  }
}

// Invalidate cache functions
export const invalidateCache = {
  products: () => {
    cache.delete(cacheKeys.featuredProducts())
    // Clear all product list caches
    cache.getKeys().forEach(key => {
      if (key.startsWith('products:')) {
        cache.delete(key)
      }
    })
  },
  
  product: (id: string) => {
    cache.delete(cacheKeys.product(id))
    cache.delete(cacheKeys.featuredProducts()) // Featured products might include this
  },
  
  user: (email: string) => {
    cache.delete(cacheKeys.user(email))
  },
  
  all: () => {
    cache.clear()
  }
}
