import '../bootstrap';

import BruteRedis from 'express-brute-redis';

export default new BruteRedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});
