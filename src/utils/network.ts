import { AxiosInstance } from 'axios';

interface Option {
  retries?: number,
  retryDelay?: number,
  retryTips?: Function
}
const defaultOption = {
  retries: 2,
  retryDelay: 500,
  retryTips: () => {}
}

/**
 * 请求重试
 * @param axios
 * @param option 配置项
 */
export function axiosRetry(axios: AxiosInstance, option: Option) {

  option = Object.assign(defaultOption, option);

  axios.interceptors.request.use((config) => {
    return config;
  });
  
  // 请求出现错误
  axios.interceptors.response.use(null, async(error) => {

    const { config, response } = error;
    if (!config) return Promise.reject(error);
    if (response) return Promise.resolve(response);  // 针对后端那些把业务错误报在 error 中的人

    config.retryCount ||= 0;
    config.retryCount ++;

    return new Promise((resolve, reject) => {
      setTimeout(async() => {
        if (config.retryCount >= option.retries) return reject(error);
        else {
          option.retryTips && option.retryTips();  // 再次请求时你可以给用户些提示
          return resolve(await axios(config));  // 再次请求
        }
      }, option.retryDelay)
    })
  });

}


/**
 * 请求函数封装
 * @param promise 请求函数
 * @param errorExt 
 * @returns 
 */
export function asyncto(promise: Promise<any>, errorExt: string = '') {
  return promise
    .then(data => [ null, data ])
    .catch(err => {
      if (errorExt) {
        const parsedError = Object.assign({}, err, errorExt);
        return [ parsedError, null ];
      }
      return [ err, null ];
    })
}
