import { Test } from '@nestjs/testing';
import {
  RedisConnectorModule,
  RedisClientService,
} from '../../src/redis-client';
import RedisMock from 'ioredis-mock';
import { Module } from '@nestjs/common';

const config = {
  REDIS_CONNECTION: {
    url: '',
  },
};

describe('RedisClientModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [
        RedisConnectorModule.register(
          {
            config: {
              ...config.REDIS_CONNECTION,
              ttl: 0,
            },
            _Redis: RedisMock
          },
        ),
      ],
    }).compile();

    expect(module).toBeDefined();
    expect(module.get(RedisClientService)).toBeInstanceOf(RedisClientService);
    module.close();
  });
  it('should compile the module using async', async () => {
    const module = await Test.createTestingModule({
      imports: [
        RedisConnectorModule.registerAsync({
          imports:[ConfigModule],
          useFactory: (configService: ConfigService) => {
            return {
              config: {
                ...configService.createRedisOptions(),
              },
              _Redis: RedisMock
            }
          },
          inject: [ConfigService]
        }),
      ],
    }).compile();

    expect(module).toBeDefined();
    expect(module.get(RedisClientService)).toBeInstanceOf(RedisClientService);
    module.close();
  });
});

// to test async options params
class ConfigService{
  createRedisOptions(){
    return {
      url: ''
    }
  }
}

@Module({
  providers: [ConfigService],
  exports: [ConfigService]
})
class ConfigModule {}