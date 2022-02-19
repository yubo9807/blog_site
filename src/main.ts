import '@/styles';
import { isClient } from '@/utils/browser';
import { message } from 'antd';

if (isClient()) {
  window.addEventListener('online' , () => {
    message.success('网络已连接');
  })
  window.addEventListener('offline' , () => {
    message.warning('网络中断');
  })
}
