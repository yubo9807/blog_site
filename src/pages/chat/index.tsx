import { io } from 'socket.io-client';
import env from '~/config/env';
import { useEffect } from "react";
import { history } from 'umi';
import style from './module.less';
import { joinClass } from '@/utils/array';
import { Input, message } from 'antd';
import { getCookie } from '@/utils/browser';
import ref from './state';
let socket = null;

function chatPage() {
  const state = ref();

  useEffect(() => {
    socket = io(env.VISIT_ORIGIN.replace('http', 'ws'), {
      path: env.BASE_SOCKET + '/chat',
      extraHeaders: {
        Authorization: getCookie('token'),
      },
    });

    socket.on('errorMessage', res => {
      if (res.code === 405) history.push('/login');
    })

    socket.once('users', res => state.setUsers(res));
    socket.on('rooms', res => state.setRooms(res));
    socket.on('chatRecord', res => {
      console.log(res)
    })
    
    socket.on('disconnect', () => {
      message.warn('服务器断开');
    })

    // 离开页面断开 socket
    const unlisten = history.listen((location) => {
      if (location.pathname !== '/chat') {
        socket.close();
      }
    })
    
    return () => {
      unlisten();
    }
  }, [])

  function send() {
    socket.emit(`roomNum`, { roomId: 1 })
  }
  
  return (<div className={joinClass(style.chatWrap, 'clearfix')}>
    <div className={joinClass(style.side, 'fl')}>
      <span className='iconfont'>&#xe622;</span>
    </div>
    <ul className={joinClass(style.roomList, 'fl')}>
      <div className={style.search}>
        <Input allowClear prefix={<span className='iconfont'>&#xe64d;</span>} />
        <span className='iconfont'>&#xe622;</span>
      </div>
      {state.rooms.map(val => <li key={val.id} onClick={send}>{val.name}</li>)}
    </ul>
    <div className={joinClass(style.content, 'fl')}>
      <div className={style.record}></div>
      <div className={style.sendWrap}></div>
    </div>
  </div>);
}

export default chatPage;
