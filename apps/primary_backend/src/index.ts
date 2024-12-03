
import { Hono } from 'hono';
import { db } from '@repo/db/db';

import { Context } from '@repo/db/context';
import { cors } from 'hono/cors';
import { userRouter } from './routes/user';
import { zapRouter } from './routes/zap';
import { triggerRouter } from './routes/trigger';
import { actionRouter } from './routes/action';
import { v1Router } from './routes/v1Router';

const app = new Hono<Context>();
app.use(cors());

app.use('*', async (c, next) => {
  c.set('prisma', db(c));
  await next();
});

app.get('/', async (c) => {
  return c.text('primary backend!');
});

app.get('/health', async (c) => {
  return c.json({ status: 'ok', service: 'Primary backend' });
});

app.route('/api/v1',v1Router)

export default app;
