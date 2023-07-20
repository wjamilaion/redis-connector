import { Test } from '@nestjs/testing';
import {
  RedisConnectorModule,
  RedisClientService,
} from '../../src/redis-client';
import RedisMock from 'ioredis-mock';

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
            ...config.REDIS_CONNECTION,
            ttl: 0,
          },
          RedisMock,
        ),
      ],
    }).compile();

    expect(module).toBeDefined();
    expect(module.get(RedisClientService)).toBeInstanceOf(RedisClientService);
    module.close();
  });
});
