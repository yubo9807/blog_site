import '@/styles';
import { isClient } from '@/utils/browser';
import store from '@/store';
import { actions } from '@/store/comp/networkerror';

if (isClient()) {
  window.addEventListener('online' , () => {
    store.dispatch(actions.showMessageAction('网络恢复', '&#xe65c;'));
  })
  window.addEventListener('offline' , () => {
    store.dispatch(actions.showMessageAction('网络中断'));
  })
}
