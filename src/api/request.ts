import axios, { AxiosStatic, AxiosRequestConfig } from 'axios';
import { message, notification } from 'antd';
import Toast from '@/components/Toast';

import env from '~/config/env';
import { getCookie, isClient } from '@/utils/browser';
import axiosRetry from './axios-retry';

const client = isClient();

const config: AxiosRequestConfig = {
  baseURL: env.BASE_API,
  timeout: 2000,
  // withCredentials: true,  // 跨域
};

const instance = axios.create(config);

axiosRetry(instance, {
  retries: 3,
  retryDelay: 3000,
  retryTips: () => {
    client && Toast('网络错误，正在尝试重新连接');
  }
});

// 响应拦截器
instance.interceptors.response.use((response: any) => {

  if (response.headers && response.headers['content-type'].includes('text/html;')) {
    Toast('请求地址错误');
    return Promise.reject(response);
  }

  if (response.status === 200) {
    const { data, config } = response;

    // 与后端协商 code 码
    if (data.code >= 400 && data.code < 500) {  // 错误报给前端开发者
      client && console.error(Object.assign(data, { url: config.url }));
    } else if (data.code >= 500 && !config.noTips) {  // 报给用户的错
      client && message.error(data.msg);
    }

    return data;
  } else {  // 状态码异常
    return response;
  }
}, error => {
  // console.log('error', error)
  // 响应出现错误（连接超时/网络断开/服务器忙没响应）
  client && notification.open({
    message: '网络可能存在一些问题',
    description: error.message || '错误原因：网络断开/无法连接/网络差/连接超时/服务器忙，请尝试重新操作或刷新页面',
    duration: null,
  })
  
  // 返回统一数据格式，不会导致代码取不到 code 而报错
  return Promise.resolve({
    code: 500,
    msg: error.message || 'network error',
  });

});

// 请求拦截器
instance.interceptors.request.use(async(config) => {
  // 有 token 的话将其放在 headers 中
  const authorization = client && await getCookie('token');
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
