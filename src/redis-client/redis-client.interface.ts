import { Redis, RedisOptions } from 'ioredis';
import type { Config } from 'cache-manager';
import RedisMock from 'ioredis-mock';
import { RedisClusterConfig } from '.';
import { ModuleMetadata, Type } from '@nestjs/common';

export type RedisConnectorConfig = (RedisOptions | { clusterConfig: RedisClusterConfig }) &
Config & { url: string };

export interface RedisConnectorOptions {
  config: RedisConnectorConfig;
  _Redis?: typeof Redis | typeof RedisMock;
}

export interface RedisOptionsFactory {
  createRedisConnectorOptions(): Promise<RedisConnectorOptions> | RedisConnectorOptions;
}
export interface RedisOptionsAsync extends Pick<ModuleMetadata, 'imports'> {
  isGlobal?: boolean;
  useExisting?: Type<RedisOptionsFactory>;
  useClass?: Type<RedisOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<RedisConnectorOptions> | RedisConnectorOptions;
  inject?: any[];
}

export const REDIS_CONNECTOR_MODULE_OPTIONS='REDIS_CONNECTOR_MODULE_OPTIONS'
