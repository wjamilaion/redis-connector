
# nestjs-redis-connector

## introduction

NestJS Redis Connector is a library that simplifies using Redis as a caching mechanism in your NestJS-based projects. This library provides an easy-to-use interface for connecting to a Redis server and interacting with it.


## Installation


YYou can install the NestJS Redis Connector package using npm or yarn:

```bash
npm install nestjs-redis-connector
```
    
## Usage/Examples

1. Import the `RedisConnectorModule`
In your NestJS application, you need to import the `RedisConnectorModule` and register it with a connection configuration. This should be done in the application module, typically `app.module.ts`.

```ts
import { Module } from '@nestjs/common';
import { RedisConnectorModule } from 'nestjs-redis-connector';

@Module({
  imports: [
    RedisConnectorModule.register({
      url: 'redis://localhost:6379', // Replace with your Redis server URL
      ttl: 0, // Set your default TTL (time-to-live) for cached data
    }),
  ],
})
export class AppModule {}
```

2. Use `RedisClientService`
Now that you have registered the `RedisConnectorModule`, you can use the `RedisClientService` in your `services` or `controllers` to interact with Redis.

```ts
import { Controller, Get } from '@nestjs/common';
import { RedisClientService } from 'nestjs-redis-connector';

@Controller('cache')
export class CacheController {
  constructor(private readonly redisClient: RedisClientService) {}

  @Get(':key')
  async getCacheValue(@Param('key') key: string): Promise<string> {
    const cachedValue = await this.redisClient.getValue(key);
    return cachedValue;
  }
}

```

In the example above, we've created a `controller` that retrieves a cached value using the `getValue` method of the `RedisClientService`. You can customize your usage as per your application's requirements.
## License

This package is released under the [MIT License](https://choosealicense.com/licenses/mit/) 

