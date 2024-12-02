import { PrismaClient } from '@prisma/client/edge';
import { Redis } from '@upstash/redis/cloudflare';
import { producer } from './producer';

export async function performScheduledTask(env: any): Promise<void> {
    console.log('Performing scheduled task at:', new Date().toISOString());
    // Initialize Prisma and Redis
    const prisma = new PrismaClient({
      datasourceUrl: env.DATABASE_URL,
    });
    const redis = Redis.fromEnv(env);
  
    // console.log('running single time...');
  
    // Start the producer in a scheduled manner
    // Execute the producer function
    await producer(prisma, redis);
    // Add your scheduled task logic here
    // Example: Send an API request, clean up a database, etc.
  }