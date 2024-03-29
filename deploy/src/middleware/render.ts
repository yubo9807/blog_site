import { Context, Next } from 'koa';
import { extname } from 'path';
import env from '../env';
import { staticExtList } from '../utils/file';

let render = null;

export default async(ctx: Context, next: Next) => {

  const ext = extname(ctx.request.path);
  if (staticExtList.includes(ext.slice(1))) {
    await next();
    return;
  }

  if (!render) {
    render = require(env.BASE_WWW_URL + '/umi.server');
  }

  const { html, error, rootContainer } = await render({ path: ctx.url });

  ctx.status = 200;
  ctx.type = 'text/html';
  ctx.body = html;

  if (error) {
    console.log(error);
    ctx.throw(500, error);
  }

  await next();

}