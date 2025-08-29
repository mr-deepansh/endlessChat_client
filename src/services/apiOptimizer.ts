import { apiCache } from './apiCache';

interface RequestConfig {
  url: string;
  method: string;
  params?: any;
  cache?: boolean;
  cacheTTL?: number;
}

class APIOptimizer {
  private pendingRequests = new Map<string, Promise<any>>();

  // Deduplicate identical requests
  async optimizedRequest<T>(config: RequestConfig, requestFn: () => Promise<T>): Promise<T> {
    const cacheKey = this.generateCacheKey(config);

    // Check cache first
    if (config.cache !== false) {
      const cached = apiCache.get(cacheKey);
      if (cached) return cached;
    }

    // Check for pending identical request
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    // Make new request
    const requestPromise = requestFn()
      .then(result => {
        // Cache successful result
        if (config.cache !== false) {
          apiCache.set(cacheKey, result, config.cacheTTL);
        }

        // Remove from pending
        this.pendingRequests.delete(cacheKey);

        return result;
      })
      .catch(error => {
        // Remove from pending on error
        this.pendingRequests.delete(cacheKey);
        throw error;
      });

    this.pendingRequests.set(cacheKey, requestPromise);
    return requestPromise;
  }

  private generateCacheKey(config: RequestConfig): string {
    return `${config.method}:${config.url}:${JSON.stringify(config.params || {})}`;
  }

  // Batch multiple requests
  async batchRequests<T>(requests: Array<() => Promise<T>>): Promise<T[]> {
    return Promise.all(requests.map(req => req()));
  }

  // Clear cache for specific patterns
  invalidateCache(pattern?: string): void {
    apiCache.invalidate(pattern);
  }
}

export const apiOptimizer = new APIOptimizer();
