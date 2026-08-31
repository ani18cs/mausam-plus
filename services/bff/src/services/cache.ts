import Redis from 'ioredis';

export interface CacheStats {
  engine: 'redis' | 'in-memory';
  hits: number;
  misses: number;
  keysCount: number;
}

class CacheService {
  private redisClient: Redis | null = null;
  private memoryCache = new Map<string, { value: any; expiresAt: number }>();
  private hits = 0;
  private misses = 0;
  private isRedisConnected = false;

  constructor() {
    const redisUrl = process.env.REDIS_URL || process.env.UPSTASH_REDIS_URL;
    if (redisUrl) {
      try {
        this.redisClient = new Redis(redisUrl, {
          maxRetriesPerRequest: 1,
          connectTimeout: 2000,
          retryStrategy: (times) => (times > 3 ? null : Math.min(times * 500, 2000)),
        });

        this.redisClient.on('connect', () => {
          this.isRedisConnected = true;
          console.log('⚡ [Cache] Connected to Redis cluster successfully.');
        });

        this.redisClient.on('error', (err) => {
          this.isRedisConnected = false;
          // Fall back gracefully to in-memory cache
        });
      } catch (err) {
        console.warn('⚡ [Cache] Redis init error, defaulting to high-performance in-memory cache.', err);
      }
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (this.isRedisConnected && this.redisClient) {
      try {
        const raw = await this.redisClient.get(key);
        if (raw) {
          this.hits++;
          return JSON.parse(raw) as T;
        }
      } catch (err) {
        // Fallback to memory
      }
    }

    const entry = this.memoryCache.get(key);
    if (entry) {
      if (entry.expiresAt > Date.now()) {
        this.hits++;
        return entry.value as T;
      }
      this.memoryCache.delete(key);
    }

    this.misses++;
    return null;
  }

  async set(key: string, value: any, ttlSeconds = 600): Promise<void> {
    if (this.isRedisConnected && this.redisClient) {
      try {
        await this.redisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds);
      } catch (err) {
        // Ignore and save to memory
      }
    }

    this.memoryCache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  async del(key: string): Promise<void> {
    if (this.isRedisConnected && this.redisClient) {
      try {
        await this.redisClient.del(key);
      } catch (e) {}
    }
    this.memoryCache.delete(key);
  }

  getStats(): CacheStats {
    return {
      engine: this.isRedisConnected ? 'redis' : 'in-memory',
      hits: this.hits,
      misses: this.misses,
      keysCount: this.memoryCache.size,
    };
  }
}

export const cacheService = new CacheService();
