import { Context, Next } from 'koa';
import { extname } from 'path';
import { getClientIP } from '../utils/network';
import { staticExtList } from '../utils/file';
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

  const ip = getClientIP(ctx);

  const [ err, res ] = await getBlacklist(cache.token);
  if (err) ctx.throw(400, err.msg);

  const blacklist = res.data;
  const index = blacklist.findIndex(val => val.ip === ip);

  if (index >= 0) ctx.throw(401, `您已被禁止访问，IP: ${ip}`);

  const count = requestCount(ip);
  if (count > 60) {
    addBlacklist(cache.token, ip);
  }

  await next();
}

const countMap = new Map();

/**
 * 请求计数
 * @param key  存入数据键
 * @param time 过期时间
 * @returns 
 */
function requestCount(key: string, time = 5000) {
  const cache = countMap.get(key);
  const initial = { value: 0, overTime: Date.now() + time }

  if (!cache) {
    countMap.set(key, initial);
  } else {
    if (cache.overTime - Date.now() <= 0) {  // 过期
      countMap.set(key, Object.assign({}, initial));
    } else {
      countMap.set(key, Object.assign({}, cache, { value: cache.value + 1 }));
    }
  }

  return countMap.get(key).value;
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