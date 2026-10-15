const Redis = require('ioredis');

const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

let redisClient = null;
let isRedisAvailable = false;

try {
  redisClient = new Redis({
    host: REDIS_HOST,
    port: REDIS_PORT,
    maxRetriesPerRequest: 2,
    retryStrategy: (times) => {
      if (times > 5) {
        console.warn('Redis retry limit exceeded. Proceeding with cache bypass.');
        return null;
      }
      return Math.min(times * 100, 2000);
    },
  });

  redisClient.on('connect', () => {
    isRedisAvailable = true;
    console.log(`Redis connected successfully at ${REDIS_HOST}:${REDIS_PORT}`);
  });

  redisClient.on('error', (err) => {
    isRedisAvailable = false;
    console.warn(`Redis connection notice: ${err.message}`);
  });
} catch (e) {
  console.warn('Could not initialize Redis client:', e.message);
}

// Cache helper functions
const getCache = async (key) => {
  if (!isRedisAvailable || !redisClient) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.warn(`Redis getCache error for key ${key}:`, err.message);
    return null;
  }
};

const setCache = async (key, value, ttlSeconds = 300) => {
  if (!isRedisAvailable || !redisClient) return false;
  try {
    const stringVal = JSON.stringify(value);
    if (ttlSeconds) {
      await redisClient.set(key, stringVal, 'EX', ttlSeconds);
    } else {
      await redisClient.set(key, stringVal);
    }
    return true;
  } catch (err) {
    console.warn(`Redis setCache error for key ${key}:`, err.message);
    return false;
  }
};

const delCache = async (key) => {
  if (!isRedisAvailable || !redisClient) return false;
  try {
    await redisClient.del(key);
    return true;
  } catch (err) {
    console.warn(`Redis delCache error for key ${key}:`, err.message);
    return false;
  }
};

const flushPattern = async (pattern) => {
  if (!isRedisAvailable || !redisClient) return false;
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(...keys);
    }
    return true;
  } catch (err) {
    console.warn(`Redis flushPattern error for ${pattern}:`, err.message);
    return false;
  }
};

const getRedisStats = async () => {
  if (!isRedisAvailable || !redisClient) {
    return { status: 'offline', host: REDIS_HOST, port: REDIS_PORT, keys: 0 };
  }
  try {
    const info = await redisClient.info();
    const dbsize = await redisClient.dbsize();
    return {
      status: 'online',
      host: REDIS_HOST,
      port: REDIS_PORT,
      totalKeys: dbsize,
      connectedClients: 1,
      infoSnippet: info.split('\n').slice(0, 8).join('\n'),
    };
  } catch (err) {
    return { status: 'error', error: err.message };
  }
};

module.exports = {
  redisClient,
  isRedisAvailable: () => isRedisAvailable,
  getCache,
  setCache,
  delCache,
  flushPattern,
  getRedisStats,
};
