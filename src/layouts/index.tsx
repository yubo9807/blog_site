import Header from './Header';
import Footer from './Footer';
import '@/main';
import style from './module.less';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import store from '@/store';
import { actions } from '@/store/scroll';
import { throttle } from '@/utils/optimize';
import '@/utils/optimize-watch';
import NetworkError from '@/components/NetworkError';
import { history } from 'umi';
import { getUserInfo } from '@/common/user';
import { isType } from '@/utils/validate';

let unlisten = null;

const Layouts = ({ children, routes, route, location }) => {
  
  useEffect(() => {
    // 记录滚动位置
    window.addEventListener('scroll', throttle(() => {
      const scrollY = window.scrollY;
      store.dispatch(actions.setScrollYAction(scrollY));
    }, 30))
  }, [])

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

  /**
   * 路由权限守卫
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

    const { roles } = route.state;
    if (isType(roles) === 'boolean') {
      // roles 为 true，但没有登录
      roles && !store.getState().user.isLogin && history.replace('/404');
    } else if (isType(role) === 'array') {
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

      <NetworkError />
    </Provider>
  );
};

export default Layouts;
