import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { Context } from 'hono';

export const db = (c:Context) => {
  console.log(c.env.DATABASE_URL)
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  
  return prisma;
};

const sayHello = 'Hello'
export default sayHello

// export const prisma =  new PrismaClient({
//   datasourceUrl: DATABASE_URL_pooling,
// }).$extends(withAccelerate());