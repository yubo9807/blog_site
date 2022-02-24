
const base_api = '/api';
const VISIT_ORIGIN = typeof window === 'object' ? window.origin : '';

// 生产环境
const env: any = {

  APP_ENV: process.env.APP_ENV,

  BASE_ROUTE_URL: '/',

  BASE_API: VISIT_ORIGIN + base_api,  // 必须加 href，否则请求 SSR 会消失

  BASE_SOCKET: base_api + '/socket',

  VISIT_ORIGIN,

};


// 开发环境
if (process.env.APP_ENV === 'development') {
  
  const VISIT_ORIGIN = 'http://127.0.0.1:20010';

  Object.assign(env, {

    VISIT_ORIGIN,

    BASE_API: VISIT_ORIGIN + base_api,

  })

}

// env.BASE_API = 'http://127.0.0.1:20010/api';
// env.BASE_API = 'http://192.168.164.145:20010/api';

export default Object.freeze(env);
