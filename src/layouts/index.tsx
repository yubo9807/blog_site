import '@/main';
import style from './module.less';

// npm
import { useEffect } from 'react';
import { history } from 'umi';

// store
import { Provider } from 'react-redux';
import store from '@/store';
import { actions as viewportActions } from '@/store/viewport';
import { actions as routeActions } from '@/store/route';

// utils
import { throttle } from '@/utils/optimize';
import { isType } from '@/utils/validate';
import { getUserInfo } from '@/common/user';

// component
import Header from './componemts/header';
import Footer from './componemts/footer';
import FixedBtn from '@/layouts/componemts/fixed-btns';


let unlisten = null;

const Layouts = ({ children, routes, route, location }) => {



  // #region 记录滚动位置
  useEffect(() => {
    window.addEventListener('scroll', throttle(() => {
      const scrollY = window.scrollY;
      store.dispatch(viewportActions.setScrollYAction(scrollY));
    }, 30))
  }, [])
  // #endregion



  // #region 记录窗口宽度
  useEffect(() => {
    store.dispatch(viewportActions.setClientWidthAction(document.body.clientWidth));
    window.addEventListener('resize', throttle(() => {
      store.dispatch(viewportActions.setClientWidthAction(document.body.clientWidth));
    }, 60))
  })
  // #endregion


  
  // #region 路由守卫
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
      if (!exact) {
        return path === pathname ? true : pathname.startsWith(path + '/');
      } else return path === pathname;
    });
    store.dispatch(routeActions.setNowRouteAction(Object.assign({}, nowRoute, { pathname })));  // 将当前路由信息存入 store

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
  // #endregion
  



  return (
    <Provider store={store}>
      {/* 头部 */}
      <Header />

      {/* 主体内容 */}
      <main className={style.main}>{children}</main>

      {/* 版权 */}
      <Footer />

      <FixedBtn />

    </Provider>
  );
};

export default Layouts;
