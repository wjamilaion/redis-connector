import { Test, TestingModule } from '@nestjs/testing';
import {
  RedisClientService,
  RedisConnectorModule,
} from '../../src/redis-client';
import RedisMock from 'ioredis-mock';

const config = {
  REDIS_CONNECTION: {
    url: '',
  },
};

describe('RedisClientService', () => {
  let redisClientService: RedisClientService;
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
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
    redisClientService = module.get<RedisClientService>(RedisClientService);
  });

  describe('check object', () => {
    it('should be defined', () => {
      expect(redisClientService).toBeDefined();
    });
  });
  describe('set/get value value', () => {
    const key = 'unit-test',
      value = 'ok',
      ttl = 120;

    it('should able to set key in redis', async () => {
      expect(await redisClientService.setValue(key, value, ttl)).toBe(true);
    });

    it('should be able to fetch value from redis', async () => {
      expect(await redisClientService.getValue(key)).toBe(value);
    });

    it('should be able to fetch keys from redis', async () => {
      expect(await redisClientService.keys()).toStrictEqual([key]);
    });

    it('should be able to fetch keys with pattern from redis', async () => {
      expect(await redisClientService.getKeysWithPattern(`${key}*`)).toStrictEqual([key]);
    });

    it('should be able to fetch ttl from redis', async () => {
      expect(await redisClientService.getTTL(key)).toBe(ttl);
    });

    it('should be able to del key from redis', async () => {
      expect(await redisClientService.delValue(key)).toBeUndefined();
      expect(await redisClientService.getValue(key)).toBeUndefined();
    });

    it('should able to set multiple keys in redis', async () => {
      expect(await redisClientService.setMValue([[key, value]], 120)).toBe(
        true,
      );
    });

    it('should be able to delete multiple keys from redis', async () => {
      expect(await redisClientService.delMValue(key)).toBeUndefined();
      expect(await redisClientService.getMValue(key)).toStrictEqual([
        undefined,
      ]);
    });

    it('reset redis', async () => {
      expect(await redisClientService.setValue(key, value, 120)).toBe(true);
      expect(await redisClientService.getValue(key)).toBe(value);
      expect(await redisClientService.reset()).toBeUndefined();
      expect(await redisClientService.getValue(key)).toBeUndefined();
    });
  });

  afterAll(async () => {
    await module.close(); // <-- this line
  });
});
