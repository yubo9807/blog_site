
const base_api = '/api';
const VISIT_ORIGIN = 'http://hicky.hpyyb.cn';

export const DEVELOPMENT = 'development';
export const PRODUCTION = 'production';

// 生产环境
const env = {

  APP_ENV: process.env.APP_ENV,

  BASE_ROUTE_URL: '/',

  BASE_API: VISIT_ORIGIN + base_api,  // 必须加 href，否则请求 SSR 会消失

  BASE_SOCKET: base_api  + '/socket',
  
  BASE_RESOURCE_URL: 'http://assets.hpyyb.cn',

  VISIT_ORIGIN,

};


// 开发环境
if (process.env.APP_ENV === 'development') {
  
  const VISIT_ORIGIN = 'http://127.0.0.1:20010';

  Object.assign(env, {

    VISIT_ORIGIN,

    BASE_API: VISIT_ORIGIN + base_api,

    BASE_RESOURCE_URL: VISIT_ORIGIN,

  })

}

// env.BASE_API = 'http://127.0.0.1:20010/api';
// env.BASE_API = 'http://hpyyb.cn/api';

export default Object.freeze(env);
