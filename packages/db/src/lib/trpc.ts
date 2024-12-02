import { initTRPC } from '@trpc/server'
import { Context } from './context'

type HonoContext = {
    env: Context,
  };
  
const t = initTRPC.context<HonoContext>().create()

const publicProcedure = t.procedure
const router = t.router


export {router,publicProcedure}