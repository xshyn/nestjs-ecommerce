import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { CACHE_VERSION, REDIS_CLIENT } from './cache.constants';
import { Redis } from 'ioredis';

@Injectable()
export class CacheService implements OnModuleDestroy {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}
  async onModuleDestroy() {
    await this.redis.quit();
  }
  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    if (!value) {
      return null;
    }
    return JSON.parse(value) as T;
  }
  async set<T>(key: string, value: T, ttl: number): Promise<void> {
    await this.redis.set(key, JSON.stringify(value), 'EX', ttl);
  }
  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }
  async exists(key: string): Promise<boolean> {
    return (await this.redis.exists(key)) === 1;
  }

  // Versioning
  async getVersion(key: string): Promise<number> {
    const version = await this.redis.get(key);
    if (!version) {
      await this.redis.set(key, '1');
      return 1;
    }

    return Number(version);
  }

  async incrementVersion(key: string): Promise<number> {
    return this.redis.incr(key);
  }

  //   Product versioning
  async invalidateProductsList(): Promise<void> {
    await this.incrementVersion(CACHE_VERSION.PRODUCTS);
  }
}
