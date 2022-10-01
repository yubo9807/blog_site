import { staticExtList } from '../utils/file';
import { Context, Next } from 'koa';
import { extname } from 'path';
import { getClientIP } from '../utils/network';
import request, { cache } from '../utils/request';

export default async(ctx: Context, next: Next) => {

  const ext = extname(ctx.request.path);
  if (staticExtList.includes(ext.slice(1))) {
    await next();
    return;
  }

  if (!cache.token) {
    const [ err, res ] = await signIn();
    if (err) ctx.throw(400, err.msg);
    cache.token = res.data.token;
  }

  const [ err, res ] = await getBlacklist(cache.token);
  if (err) ctx.throw(400, err.msg);

  const ip = getClientIP(ctx);

  if (res.code === 508) {
    addBlacklist(cache.token, ip);
  }

  const blacklist = res.data;
  const index = blacklist.findIndex(val => val.ip === ip);

  if (index >= 0) ctx.throw(401, `您已被禁止访问，IP: ${ip}`);

  await next();

}


/**
 * 登录获取 token
 */
export function signIn() {
  return request({
    method: 'post',
    url: 'http://127.0.0.1:20010/api/user/signIn',
    data: {
      username: 'admin',
      password: '123456',
    },
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

/**
 * 添加到黑名单
 */
function addBlacklist(token: string, ip: string) {
  return request({
    method: 'post',
    url: 'http://127.0.0.1:20010/api/blacklist',
    headers: {
      'Authorization': token,
    },
    data: {
      ip,
    }
  })
}