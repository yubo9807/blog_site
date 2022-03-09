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

const Layouts = ({ children }) => {
  
  useEffect(() => {
    window.addEventListener('scroll', throttle(() => {
      const scrollY = window.scrollY;
      store.dispatch(actions.setScrollYAction(scrollY));
    }, 30))
  }, [])
  
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
