import { asyncto } from './network';
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { signIn } from '../middleware/intercept';

const config: AxiosRequestConfig = {
  baseURL: '',
  timeout: 5000,
  headers: {}
}

export const cache = {
  token: ''
}

/**
 * 请求拦截
 * @param option 请求配置参数
 * @param noTips 取消拦截报错
 */
const request = (option: AxiosRequestConfig, noTips = false) => {

  const promise = new Promise((resolve, reject) => {

    // 请求拦截
    option = Object.assign({}, config, option);

    // 响应拦截
    axios(option).then(response => {
      interceptError(response);
    }).catch(error => {
      const { message } = error;
      reject({ code: 500, msg: message });
    })

    // 统一报错
    async function interceptError(res: AxiosResponse<any>) {
      const { data, headers } = res;

      if (headers && headers['content-type'].includes('text/html;')) {
        return reject({ code: 500, msg: '请求地址错误' });
      }

      // token 过期重新登录重新请求接口
      if (data.code === 403) {
        const [ signInErr, signInRes ] = await signIn();
        if (signInErr) return reject(signInErr);

        cache.token = signInRes.data.token;
        const [ err, res ] = await request(option);
        return err ? reject(err) : resolve(res);
      }

      if (data.code === 200) {
        return resolve(data);
      }

      return reject(data);
    }

  })

  return asyncto(promise);
};

export default request;
