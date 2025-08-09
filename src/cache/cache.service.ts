import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { logger } from '../logger/logger.config';

@Injectable()
export class CacheService {
  private readonly redis: Redis;

  constructor(private configService: ConfigService) {
    this.redis = new Redis({
      host: this.configService.get('REDIS_HOST', 'localhost'),
      port: this.configService.get('REDIS_PORT', 6379),
      password: this.configService.get('REDIS_PASSWORD'),
      lazyConnect: true,
    });

    this.redis.on('connect', () => {
      logger.info('Redis connected');
    });

    this.redis.on('error', (error) => {
      logger.error('Redis connection error', { error: error.message });
    });
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Cache get error', { key, error: error.message });
      return null;
    }
  }

  async set(key: string, value: any, ttl: number = 300): Promise<void> {
    try {
      await this.redis.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      logger.error('Cache set error', { key, error: error.message });
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      logger.error('Cache delete error', { key, error: error.message });
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      logger.error('Cache exists error', { key, error: error.message });
      return false;
    }
  }

  // Rate limiting support
  async increment(key: string, ttl: number = 60): Promise<number> {
    try {
      const pipeline = this.redis.pipeline();
      pipeline.incr(key);
      pipeline.expire(key, ttl);
      const results = await pipeline.exec();
      return results[0][1] as number;
    } catch (error) {
      logger.error('Cache increment error', { key, error: error.message });
      return 0;
    }
  }

  // Payment status caching
  async cachePaymentStatus(
    transactionId: string,
    status: any,
    ttl: number = 180,
  ): Promise<void> {
    const key = `payment:status:${transactionId}`;
    await this.set(key, status, ttl);
  }

  async getPaymentStatus(transactionId: string): Promise<any> {
    const key = `payment:status:${transactionId}`;
    return this.get(key);
  }

  // Provider info caching
  async cacheProviderInfo(
    provider: string,
    info: any,
    ttl: number = 3600,
  ): Promise<void> {
    const key = `provider:info:${provider}`;
    await this.set(key, info, ttl);
  }

  async getProviderInfo(provider: string): Promise<any> {
    const key = `provider:info:${provider}`;
    return this.get(key);
  }
}
