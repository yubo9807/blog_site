import { staticExtList } from '../utils/file';
import axios from 'axios';
import { Context, Next } from 'koa';
import { extname } from 'path';

export default async(ctx: Context, next: Next) => {

  const ext = extname(ctx.request.path);
  if (staticExtList.includes(ext.slice(1))) {
    await next();
    return;
  }

  const { url, headers } = ctx;
  const { host, 'x-forwarded-for': ip, 'user-agent': userAgent } = headers;

  const params = {
    host,
    url,
    ip,
    userAgent,
  };

  for (const key in params) {
    const value = params[key];
    if (typeof value === 'string') params[key] = value ? value.replace(/\"/g, '') : '';
  }

  axios({
    method: 'post',
    url: 'http://127.0.0.1:20010/api/access',
    data: params,
  })

  await next();
}
