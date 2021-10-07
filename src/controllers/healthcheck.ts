import { Context, Next } from 'koa';

export default async function (ctx: Context, next: Next) {
  ctx.status = 200;
  ctx.body = 'online';
  await next();
  return ctx;
}
