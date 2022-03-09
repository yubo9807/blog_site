import Header from './Header';
import Footer from './Footer';
import '@/main';
import style from './module.less';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import store from '@/store';
import { actions as scrollActions } from '@/store/scroll';
import { actions as userActions } from '@/store/user';
import { throttle } from '@/utils/optimize';
import '@/utils/optimize-watch';
import NetworkError from '@/components/NetworkError';
import { history } from 'umi';
import { getCookie } from '@/utils/browser';
import { api_getUserInfo } from '@/api/login';
import check from './check';

const Layouts = ({ children, routes, route, location }) => {
  
  useEffect(() => {
    window.addEventListener('scroll', throttle(() => {
      const scrollY = window.scrollY;
      store.dispatch(scrollActions.setScrollYAction(scrollY));
    }, 30))
  }, [])

  useEffect(() => {
    let unlisten = null;

    (async () => {
      await getUserInfo();
      const { role } = store.getState().user.userInfo;
      const layoutsRoutes = routes.find(val => val.path === route.path).routes;
      routeIntercept(location.pathname, layoutsRoutes, role);
  
      unlisten = history.listen((location) => {
        routeIntercept(location.pathname, layoutsRoutes, role);
      })
    })();

    return () => {
      unlisten();
    }
  }, [])

  // 获取用户信息
  async function getUserInfo() {
    const token = await getCookie('token');
    if (token) {
      const response: any = await api_getUserInfo({ token });
      if (response.code === 200) {
        // 用户验证成功
        store.dispatch(userActions.signInAction());
        check(response.data);
        store.dispatch(userActions.setUserinfoAction(response.data));
      }
    }
  }

  /**
   * 路由守卫
   * @param pathname 当前的 url
   * @param routes 路由配置数组，扁平对象
   * @param role 角色
   * @returns 
   */
  function routeIntercept(pathname: string, routes: any[], role: string) {
    const route = routes.find(val => {
      const { exact, path } = val;
      if (exact) return path === pathname;
      else return pathname.startsWith(path + '/');
    });
    if (!route || !route.state || !route.state.roles) return;
    const { state } = route;
    if (!state.roles.includes(role)) history.replace('/404');
  }
  
  return (
    <Provider store={store}>
      {/* 头部 */}
      <Header />

      {/* 主体内容 */}
      <section className={style.section}>{children}</section>

      {/* 版权 */}
      <Footer />

      <NetworkError />
    </Provider>
  );
};

export default Layouts;
