import { triggerRouter } from './trigger';
import { Context } from "@repo/db/context";
import { Hono } from "hono"
import { actionRouter } from "./action";
import { zapRouter } from './zap';
import { userRouter } from './user';

export const v1Router = new Hono<Context>();

v1Router.route('/user', userRouter);
v1Router.route('/zap', zapRouter);
v1Router.route('/trigger', triggerRouter);
v1Router.route('/action', actionRouter);

