import { Context, Next } from 'koa';
import { extname } from 'path';
import { getClientIP } from '../utils/network';
import request from '../utils/request';

let token = '';

export default async(ctx: Context, next: Next) => {

  if (extname(ctx.url)) {
    await next();
    return;
  }

  if (!token) {
    const [ err, res ] = await signIn({
      username: 'visitor',
      password: '111111',
    });
    if (err) ctx.throw(400, err.msg);
    token = res.data.token;
  }

  const [ err, res ] = await getBlacklist(token);
  if (err) ctx.throw(400, err.msg);

  const ip = getClientIP(ctx);
  const blacklist = res.data;
  const index = blacklist.findIndex(val => val.ip === ip);

  if (index >= 0) ctx.throw(403, `您已被禁止访问，IP: ${ip}`);

  await next();

}


/**
 * 登录获取 token
 */
function signIn(data) {
  return request({
    method: 'post',
    url: 'http://127.0.0.1:20010/api/user/signIn',
    data,
  })
}

/**
 * 获取黑名单
 */
function getBlacklist(token: string) {
  return request({
    method: 'get',
    url: 'http://127.0.0.1:20010/api/blacklist',
    headers: {
      'Authorization': token,
    }
  })
}