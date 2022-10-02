import '@/styles';
import { isClient } from '@/utils/browser';
import Toast from '@/components/custom-toast';

if (isClient()) {
  window.addEventListener('online' , () => {
    Toast({ content: '网络恢复', icon: '&#xe65c;' });
  })
  window.addEventListener('offline' , () => {
    Toast({ content: '网络中断', icon: '&#xec72;' });
  })
}
