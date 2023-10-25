import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import { RedisClientService } from './redis-client.service';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from '.';
import { REDIS_CONNECTOR_MODULE_OPTIONS, RedisConnectorOptions, RedisOptionsAsync, RedisOptionsFactory } from './redis-client.interface';

@Module({})
export class RedisConnectorModule {
  static register(
    options: RedisConnectorOptions
  ): DynamicModule {
    const {
      config,
      _Redis
    } = options;
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
  static registerAsync(options: RedisOptionsAsync): DynamicModule {
    return {
      global: options.isGlobal,
      module: RedisConnectorModule,
      imports:[...options.imports??[],
      CacheModule.registerAsync({
        isGlobal: options.isGlobal,
        imports: [...options.imports??[]],
        useFactory: async (options: RedisConnectorOptions) => {
          const {
            config,
            _Redis
          } = options;
          return {
            store: await redisStore(config.url, {
              ...config,
              ttl: 0,
            })(_Redis),
          };
        },
        inject: [REDIS_CONNECTOR_MODULE_OPTIONS],
        extraProviders: [...this.createAsyncProviders(options)]
      }),
    ],
      providers: [...this.createAsyncProviders(options), RedisClientService],
      exports: [RedisClientService],
    };
  }

  private static createAsyncProviders(
    options: RedisOptionsAsync,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<RedisOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: RedisOptionsAsync,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: REDIS_CONNECTOR_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    // `as Type<TypeOrmOptionsFactory>` is a workaround for microsoft/TypeScript#31603
    const inject = [
      (options.useClass ||
        options.useExisting) as Type<RedisOptionsFactory>,
    ];
    return {
      provide: REDIS_CONNECTOR_MODULE_OPTIONS,
      useFactory: async (optionsFactory: RedisOptionsFactory) =>
        await optionsFactory.createRedisConnectorOptions(),
      inject,
    };
  }
}
