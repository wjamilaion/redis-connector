import { DynamicModule, Module } from '@nestjs/common';
import { RedisClientService } from './redis-client.service';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClusterConfig, redisStore } from '.';
import { Redis, RedisOptions } from 'ioredis';
import type { Config } from 'cache-manager';
import RedisMock from 'ioredis-mock';

@Module({})
export class RedisConnectorModule {
  static register(
    config: (RedisOptions | { clusterConfig: RedisClusterConfig }) &
      Config & { url: string },
    _Redis?: typeof Redis | typeof RedisMock,
  ): DynamicModule {
    return {
      imports: [
        CacheModule.registerAsync({
          isGlobal: true,
          imports: [],
          useFactory: async () => {
            return {
              store: await redisStore(config.url, {
                ...config,
                ttl: 0,
              })(_Redis),
            };
          },
        }),
      ],
      module: RedisConnectorModule,
      providers: [RedisClientService],
      exports: [RedisClientService],
    };
  }
}
