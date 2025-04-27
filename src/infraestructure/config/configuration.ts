import dotenv from 'dotenv';

dotenv.config();

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV,
  throttler: {
    ttl: process.env.THROTTLER_TTL,
    limit: process.env.THROTTLER_LIMIT,
  },
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize:
      process.env.NODE_ENV == 'PROD'
        ? false
        : process.env.DB_SYNCHRONIZE == 'ENABLED',
    logging: process.env.DB_LOGS !== 'DISABLED',
    migrationsRun: process.env.NODE_ENV !== 'PROD',
  },
  swapi: {
    url: process.env.SWAPI_URL,
  },
  unsplash: {
    url: process.env.UNSPLASH_URL,
    clientId: process.env.URL_CLIENT_ID_UNSPLASH,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    tll: process.env.REDIS_CACHE_TTL,
    max: process.env.REDIS_MAX_ITEM_IN_CACHE,
  },
  pagination: {
    limit: process.env.PAGINATION_LIMIT,
    maxLimit: process.env.PAGINATION_MAX_LIMIT,
  },
  dynamoDB: {
    region: process.env.DYNAMO_REGION,
  },
});
