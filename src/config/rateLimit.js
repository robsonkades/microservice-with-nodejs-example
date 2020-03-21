import '../bootstrap';
import RateLimit from 'express-rate-limit';
import RateLimitRedis from 'rate-limit-redis';
import redis from 'redis';

export default new RateLimit({
  store: new RateLimitRedis({
    client: redis.createClient({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    }),
  }),
  windowMs: 1000 * 60 * 15, // 15 minutes
  max: 100,
});
