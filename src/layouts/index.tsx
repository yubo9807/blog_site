import '@/main';
import style from './module.less';
import { useEffect } from 'react';
import { history } from 'umi';

import { Provider } from 'react-redux';
import store from '@/store';
import { actions as scrollActions } from '@/store/scroll';
import { actions as routeActions } from '@/store/route';

import { throttle } from '@/utils/optimize';
import '@/utils/optimize-watch';
import { isType } from '@/utils/validate';
import { getUserInfo } from '@/common/user';

import Header from './Header';
import Footer from './Footer';

let unlisten = null;

const Layouts = ({ children, routes, route, location }) => {
  
  // 记录滚动位置
  useEffect(() => {
    window.addEventListener('scroll', throttle(() => {
      const scrollY = window.scrollY;
      store.dispatch(scrollActions.setScrollYAction(scrollY));
    }, 30))
  }, [])

  // 进入页面/切换页面 路由守卫
  useEffect(() => {
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

  // 退出登录再次权限守卫
  function exitJumpPage() {
    const exit = store.getState().user.isLogin === 2;
    if (exit) {
      const layoutsRoutes = routes.find(val => val.path === route.path).routes;
      const nowRoute = layoutsRoutes.find(val => val.path === location.pathname);
      nowRoute.state && nowRoute.state.roles && history.push('/');
    }
  }

  /**
   * 路由权限守卫
   * @param pathname 当前的 url
   * @param routes 路由配置数组，扁平对象
   * @param role 角色
   * @returns 
   */
  function routeIntercept(pathname: string, routes: any[], role: string) {
    const nowRoute = routes.find(val => {
      const { exact, path } = val;
      if (exact) return path === pathname;
      else return pathname.startsWith(path + '/');
    });
    store.dispatch(routeActions.setNowRouteAction(nowRoute));  // 将当前路由信息存入 store

    if (!nowRoute || !nowRoute.state || !nowRoute.state.roles) return;

    const { roles } = nowRoute.state;
    if (isType(roles) === 'boolean') {
      // roles 为 true，但没有登录
      roles && store.getState().user.isLogin !== 1 && history.replace('/404');
    } else if (isType(roles) === 'array') {
      // 登录角色不符
      if (!roles.includes(role)) history.replace('/404');
    } else {
      console.warn('角色设置无效，roles 必须为 boolean 或 array 类型');
    }

  }
  
  return (
    <Provider store={store}>
      {/* 头部 */}
      <Header />

      {/* 主体内容 */}
      <section className={style.section}>{children}</section>

      {/* 版权 */}
      <Footer />

    </Provider>
  );
};

export default Layouts;
