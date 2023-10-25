import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { RedisStore, Seconds } from './redis-store';

@Injectable()
export class RedisClientService implements OnModuleDestroy {
  private readonly logger: Logger = new Logger(RedisClientService.name);

  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}
  
  redisClient() {
    (this.cache.store as RedisStore).client;
  }

  onModuleDestroy() {
    this.disconnect();
  }

  async getValue(key: string): Promise<any> {
    this.logger.debug(`Fetching value from redis [key=${key}]`);
    return await this.cache.get(key);
  }

  async setValue(
    key: string,
    value: string | number,
    ttl: Seconds,
  ): Promise<boolean> {
    this.logger.debug(`Added key into cache [key=${key}]`);
    //convert ttl to Milliseconds
    await this.cache.set(key, value, ttl * 1000);
    return true;
  }

  async getMValue(...keys: string[]): Promise<any[]> {
    return await this.cache.store.mget(...keys);
  }

  async setMValue(
    args: [string, string | number][],
    ttl: Seconds,
  ): Promise<boolean> {
    //convert ttl to Milliseconds
    await this.cache.store.mset(args, ttl * 1000);
    return true;
  }

  async sadd(listName: string, member: string) {
    (this.cache.store as RedisStore).client.sadd(listName, member);
  }

  async srem(listName: string, member: string) {
    (this.cache.store as RedisStore).client.srem(listName, member);
  }

  async reset(): Promise<void> {
    await this.cache.reset();
  }

  async keys(): Promise<string[]> {
    return this.cache.store.keys();
  }

  async delValue(key: string): Promise<void> {
    this.logger.debug(`Deleting key from redis [key=${key}]`);
    await this.cache.del(key);
  }
  async delMValue(...key: string[]): Promise<void> {
    await this.cache.store.mdel(...key);
  }
  disconnect(): void {
    (this.cache.store as RedisStore).client.disconnect?.();
  }
}
