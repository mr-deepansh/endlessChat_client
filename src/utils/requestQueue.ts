class RequestQueue {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private readonly baseDelay = 200; // 200ms base delay between requests
  private readonly maxDelay = 10000; // 10 seconds max delay
  private retryCount = 0;
  private readonly maxRetries = 3;
  private readonly pendingRequests = new Map<string, Promise<any>>();
  private readonly requestCache = new Map<string, { data: any; timestamp: number }>();
  private readonly cacheTimeout = 30000; // 30 seconds cache timeout

  async add<T>(request: () => Promise<T>, requestKey?: string): Promise<T> {
    // Generate a request key if not provided
    const key = requestKey || this.generateRequestKey(request);

    // Check if request is already pending
    if (this.pendingRequests.has(key)) {
      console.log(`🔄 Deduplicating request: ${key}`);
      return this.pendingRequests.get(key)!;
    }

    // Check cache first
    const cached = this.requestCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      console.log(`💾 Using cached result for: ${key}`);
      return cached.data;
    }

    return new Promise((resolve, reject) => {
      const promise = this.executeWithRetry(request);
      this.pendingRequests.set(key, promise);

      this.queue.push(async () => {
        try {
          const result = await promise;

          // Cache successful results
          this.requestCache.set(key, {
            data: result,
            timestamp: Date.now(),
          });

          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.pendingRequests.delete(key);
        }
      });

      if (!this.processing) {
        this.process();
      }
    });
  }

  private generateRequestKey(request: () => Promise<any>): string {
    // Generate a simple key based on the request function
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 11);
    return `req_${timestamp}_${randomId}`;
  }

  private async executeWithRetry<T>(request: () => Promise<T>): Promise<T> {
    let lastError: any;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const result = await request();
        this.retryCount = 0; // Reset retry count on success
        return result;
      } catch (error: any) {
        lastError = error;

        // Check if it's a rate limit error
        if (error.code === 'RATE_LIMIT_ERROR' && attempt < this.maxRetries) {
          const delay = this.calculateBackoffDelay(attempt);
          console.log(
            `⏳ Rate limited, retrying in ${delay}ms (attempt ${attempt + 1}/${this.maxRetries + 1})`
          );
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // If it's not a rate limit error or we've exhausted retries, throw the error
        throw error;
      }
    }

    throw lastError;
  }

  private calculateBackoffDelay(attempt: number): number {
    // Exponential backoff with jitter
    const exponentialDelay = this.baseDelay * Math.pow(2, attempt);
    const jitter = Math.random() * 1000; // Add up to 1 second of jitter
    return Math.min(exponentialDelay + jitter, this.maxDelay);
  }

  private async process() {
    this.processing = true;

    while (this.queue.length > 0) {
      const request = this.queue.shift();
      if (request) {
        await request();
        // Add delay between requests to prevent overwhelming the server
        await new Promise(resolve => setTimeout(resolve, this.baseDelay));
      }
    }

    this.processing = false;
  }

  // Clear cache for specific key or all cache
  public clearCache(key?: string) {
    if (key) {
      this.requestCache.delete(key);
    } else {
      this.requestCache.clear();
    }
  }

  // Clear expired cache entries
  public clearExpiredCache() {
    const now = Date.now();
    for (const [key, value] of this.requestCache.entries()) {
      if (now - value.timestamp > this.cacheTimeout) {
        this.requestCache.delete(key);
      }
    }
  }
}

export const requestQueue = new RequestQueue();
