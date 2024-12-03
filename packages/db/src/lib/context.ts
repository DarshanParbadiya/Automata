import type { Env } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { Redis } from '@upstash/redis/cloudflare';
// import {
//   cloudflareRateLimiter,
// } from "@hono-rate-limiter/cloudflare";
// import { Hono } from "hono";
export interface Bindings extends Env {
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    UPSTASH_REDIS_URL: string;
    UPSTASH_AUTH_TOKEN: string;
    // RATE_LIMITER: RateLimit;
  };
}

export interface Context extends Bindings {
  Variables: {
    prisma: any;
    userId: string;
    // rateLimit: boolean;
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
