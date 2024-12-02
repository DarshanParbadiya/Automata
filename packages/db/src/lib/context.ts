import type { Env } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { Redis } from '@upstash/redis/cloudflare';

export interface Bindings extends Env {
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    UPSTASH_REDIS_URL: string;
    UPSTASH_AUTH_TOKEN: string;
  };
}

export interface Context extends Bindings {
  Variables: {
    prisma: any;
    userId: string;
  };
}

export interface RedisContext {
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    UPSTASH_REDIS_REST_URL: string;
    UPSTASH_REDIS_REST_TOKEN: string;
  };
  Variables: {
    prisma: any;
    redis: Redis;
  };
}
