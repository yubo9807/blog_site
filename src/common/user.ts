import { api_getUserInfo } from '@/api/login';
import store from '@/store';
import { actions, getToken } from '@/store/user';

/**
 * 获取用户信息
 */
export async function getUserInfo() {
  const token = getToken();
  if (token) {
    const [ err, res ] = await api_getUserInfo();
    if (err) return;

    // 用户验证成功
    store.dispatch(actions.signInAction());
    store.dispatch(actions.setUserinfoAction(res.data));
  }
}