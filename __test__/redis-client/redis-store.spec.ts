import {
  NoCacheableError,
  RedisStore,
  redisStore,
} from '../../src/redis-client';
import RedisMock from 'ioredis-mock';

const config = {
  REDIS_CONNECTION: {
    url: '',
  },
};

describe('RedisStore', () => {
  const key = 'unit-test',
    value = 'ok';
  let store: RedisStore;
  beforeAll(async () => {
    store = await redisStore(config.REDIS_CONNECTION.url, {
      ...config.REDIS_CONNECTION,
      ttl: 0,
    })(RedisMock);
  });
  it('should throw exception NoCacheableError', () => {
    expect(store.set(key, undefined, 2000)).rejects.toStrictEqual(
      new NoCacheableError(`"${undefined}" is not a cacheable value`),
    );
  });
  afterAll(() => {
    store.client.disconnect();
  });
});
