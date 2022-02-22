import { isClient } from '@/utils/browser';
import { AxiosInstance } from 'axios';

interface Option {
  retries: number,
  retryDelay: number
}
const defaultOption = {
  retries: 2,
  retryDelay: 500,
}

/**
 * 请求重试
 * @param axios
 * @param option 配置项
 */
export default (axios: AxiosInstance, option: Option = defaultOption) => {

  axios.interceptors.request.use((config) => {
    return config;
  });
  
  // 请求出现错误
  axios.interceptors.response.use(null, async(error) => {
    const { config } = error;
    if (!config) return Promise.reject(error);

    config.retryCount ||= 0;
    config.retryCount++;

    return new Promise((resolve, reject) => {
      setTimeout(async() => {
        if (config.retryCount >= option.retries) return reject(config);
        else return resolve(await axios(config));  // 再次请求
      }, option.retryDelay)
    })
  });

}
