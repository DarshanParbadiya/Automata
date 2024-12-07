import { PrismaClient } from '@prisma/client/edge';
import { Redis } from '@upstash/redis/cloudflare';
import { consumer } from './consumer';

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
    await consumer(prisma,redis,env.JWT_SECRET);
    // Add your scheduled task logic here
    // Example: Send an API request, clean up a database, etc.
  }