import z from 'zod';

export const redisMessageSchema = z.object({
    zapRunId : z.string().uuid(),
    stage : z.number(),
})