import axios, { AxiosStatic, AxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';
import env from '~/config/env';
import { message, notification } from 'antd';
import { getCookie, isClient } from '@/utils/browser';

const requsetTimeout = 2000;
const config: AxiosRequestConfig = {
  baseURL: env.BASE_API,
  timeout: requsetTimeout,
  // withCredentials: true,  // 跨域
};

const instance = axios.create(config);
axiosRetry(instance, {
  retries: 2,
  retryCondition: () => true,
  retryDelay: () => 2000,
});

let retryNum = 0;  // 请求重试次数

// 响应拦截器
instance.interceptors.response.use((response: any) => {
  retryNum = 0;  // 请求成功后归零
  
  if (response.status === 200) {
    const { data, config } = response;

    // 与后端协商 code 码
    if (data.code >= 400 && data.code < 500) {  // 错误报给前端开发者
      isClient() && console.error(Object.assign(data, { url: config.url }));
    } else if (data.code >= 500 && !config.noTips) {  // 报给用户的错
      isClient() && message.error(data.msg);
    }

    return data;
  } else {  // 状态码异常
    return response;
  }
}, error => {
  // 响应出现错误（连接超时/网络断开/服务器忙没响应）
  isClient() && notification.open({
    message: '服务器连接错误',
    description: '错误原因：连接超时/网络断开/服务器忙没响应',
  })

  // 返回统一数据格式，不会导致代码取不到 code 而报错
  return Promise.resolve({
    code: 500,
    msg: error.message,
  });
});

// 请求拦截器
instance.interceptors.request.use(async(config) => {
  retryNum++;
  console.log(`第 ${retryNum} 次请求`);

  // 请求重试
  if (retryNum > 1 && isClient()) {
    config.timeout = requsetTimeout;  // axios-retry 请求重试 timeout 会变为 1, 需要重置
    message.info('网络可能在开小差，正在请求重试');
  }
  
  // 有 token 的话将其放在 headers 中
  const authorization = isClient() && await getCookie('token');
  if (authorization) {
    config.headers.Authorization = authorization;
  }
  return config;
})

interface SateConfig extends AxiosRequestConfig {
  noTips?: boolean
}
interface SateAxios extends AxiosStatic {
  (config?: SateConfig)
}

export default (instance as SateAxios);
