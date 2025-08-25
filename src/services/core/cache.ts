/**
 * Frontend Cache Service using localStorage with Redis-like functionality
 * Provides caching with TTL, tags, and invalidation
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
  tags?: string[];
}

interface CacheConfig {
  ttl?: number; // Time to live in milliseconds
  tags?: string[];
}

class CacheService {
  private prefix = 'endlesschat_cache_';
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Set cache item with TTL and tags
   */
  set<T>(key: string, data: T, config?: CacheConfig): void {
    const ttl = config?.ttl || this.defaultTTL;
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      tags: config?.tags,
    };

    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(cacheItem));
    } catch (error) {
      console.warn('Cache set failed:', error);
    }
  }

  /**
   * Get cache item if not expired
   */
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.prefix + key);
      if (!item) return null;

      const cacheItem: CacheItem<T> = JSON.parse(item);
      const now = Date.now();

      // Check if expired
      if (now - cacheItem.timestamp > cacheItem.ttl) {
        this.delete(key);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.warn('Cache get failed:', error);
      return null;
    }
  }

  /**
   * Delete specific cache item
   */
  delete(key: string): void {
    try {
      localStorage.removeItem(this.prefix + key);
    } catch (error) {
      console.warn('Cache delete failed:', error);
    }
  }

  /**
   * Check if cache item exists and is valid
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Clear all cache items with specific tag
   */
  invalidateByTag(tag: string): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          const item = localStorage.getItem(key);
          if (item) {
            const cacheItem: CacheItem<any> = JSON.parse(item);
            if (cacheItem.tags?.includes(tag)) {
              localStorage.removeItem(key);
            }
          }
        }
      });
    } catch (error) {
      console.warn('Cache invalidation failed:', error);
    }
  }

  /**
   * Clear all cache
   */
  clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Cache clear failed:', error);
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    totalItems: number;
    totalSize: number;
    expiredItems: number;
  } {
    let totalItems = 0;
    let totalSize = 0;
    let expiredItems = 0;
    const now = Date.now();

    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          const item = localStorage.getItem(key);
          if (item) {
            totalItems++;
            totalSize += item.length;

            const cacheItem: CacheItem<any> = JSON.parse(item);
            if (now - cacheItem.timestamp > cacheItem.ttl) {
              expiredItems++;
            }
          }
        }
      });
    } catch (error) {
      console.warn('Cache stats failed:', error);
    }

    return { totalItems, totalSize, expiredItems };
  }

  /**
   * Clean expired items
   */
  cleanup(): void {
    try {
      const keys = Object.keys(localStorage);
      const now = Date.now();

      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          const item = localStorage.getItem(key);
          if (item) {
            const cacheItem: CacheItem<any> = JSON.parse(item);
            if (now - cacheItem.timestamp > cacheItem.ttl) {
              localStorage.removeItem(key);
            }
          }
        }
      });
    } catch (error) {
      console.warn('Cache cleanup failed:', error);
    }
  }

  /**
   * Memoize function with caching
   */
  memoize<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    keyGenerator: (...args: Parameters<T>) => string,
    config?: CacheConfig
  ): T {
    return (async (...args: Parameters<T>) => {
      const key = keyGenerator(...args);
      const cached = this.get(key);

      if (cached !== null) {
        return cached;
      }

      const result = await fn(...args);
      this.set(key, result, config);
      return result;
    }) as T;
  }
}

// Create singleton instance
export const cacheService = new CacheService();

// Auto cleanup every 5 minutes
setInterval(
  () => {
    cacheService.cleanup();
  },
  5 * 60 * 1000
);

export default cacheService;
