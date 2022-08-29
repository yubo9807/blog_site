import { Context } from 'koa';

/**
 * 请求函数封装
 * @param promise
 * @param errorExt 错误消息
 * @returns 
 */
export function asyncto(promise: Promise<any>, errorExt = ''): Promise<any> {
  return promise
    .then(data => [ null, data ])
    .catch(err => {
      if (!errorExt) return [ err, null ];

      const parsedError = Object.assign({}, err, errorExt);
      return [ parsedError, null ];
    });
}

/**
 * 获取客户端IP
 * @param ctx 
 * @returns 
 */
export function getClientIP(ctx: Context) {
  const { request } = ctx;
  const ip = request.headers['x-real-ip'];
  return ip && ip.toString() || request.ip.replace('::ffff:', '');
}
