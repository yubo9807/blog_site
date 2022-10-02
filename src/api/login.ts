import request from './request';

// 注册
export function api_userSignUp(data: any) {
  return request({
    url: '/user/signUp',
    method: 'post',
    data,
  });
}

// 获取邮箱验证码
export function api_getMailCode(params: any) {
  return request({
    url: '/user/mailCode',
    method: 'get',
    params,
  });
}

export interface SignIn {
  username: string
  password: string
}
// 登入
export function api_userSginIn(data: SignIn) {
  return request({
    url: '/user/signIn',
    method: 'post',
    data,
    // noTips: true,
  });
}

// 获取用户信息
export function api_getUserInfo() {
  return request({
    url: '/user/current',
    method: 'get',
  });
}
