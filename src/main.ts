import '@/styles';
import { isClient } from '@/utils/browser';
import Toast from '@/components/custom-toast';
import env, { PRODUCTION } from '~/config/env';

if (isClient()) {
  const ORIGIN = 'http://hpyyb.cn'
  if (env.APP_ENV === PRODUCTION && location.origin !== ORIGIN) {
    alert('网站被套壳，请注意安全。真实地址为：' + ORIGIN);
  }

  window.addEventListener('online' , () => {
    Toast({ content: '网络恢复', icon: '&#xe65c;' });
  })
  window.addEventListener('offline' , () => {
    Toast({ content: '网络中断', icon: '&#xec72;' });
  })
}
