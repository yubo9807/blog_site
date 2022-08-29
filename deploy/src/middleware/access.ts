import axios from 'axios';
import { Context, Next } from 'koa';
import { extname } from 'path';

export default async(ctx: Context, next: Next) => {

  if (extname(ctx.url)) {
    await next();
    return;
  }

  const { url, headers } = ctx;
  const { host, 'x-forwarded-for': ip, 'user-agent': userAgent } = headers;

  const info = {
    host,
    url,
    ip,
    userAgent,
  };

  for (const key in info) {
    const value = info[key];
    if (typeof value === 'string') info[key] = value ? value.replace(/\"/g, '') : '';
  }

  axios({
    method: 'post',
    url: 'http://127.0.0.1:20010/api/access',
    data: info,
  })

  await next();
}
