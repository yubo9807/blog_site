import { api_getUserInfo } from '@/api/login';
import store from '@/store';
import { getCookie } from '@/utils/browser';
import { actions } from '@/store/user';

/**
 * 获取用户信息
 */
export async function getUserInfo() {
  const token = await getCookie('token');
  if (token) {
    const response: any = await api_getUserInfo({ token });
    if (response.code === 200) {
      // 用户验证成功
      store.dispatch(actions.signInAction());
      store.dispatch(actions.setUserinfoAction(response.data));
    }
  }
}