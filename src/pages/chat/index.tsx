import { io } from 'socket.io-client';
import env from '~/config/env';
import { useEffect, useRef, useState } from "react";
import { history, IRouteProps } from 'umi';
import style from './module.less';
import { joinClass } from '@/utils/array';
import { Input, message, Modal } from 'antd';
import { getCookie, isClient } from '@/utils/browser';
import { connect } from 'react-redux';

import ref from './state';
let socket = null;


function chatPage(props: IRouteProps) {
  const { userInfo, route } = props;
  // isClient() && console.log(userInfo, route);
  
  const [ visible, setVisible ] = useState(false);  // 是否显示弹框
  function confirmGoLogin() {
    history.push('/login');
  }

  const state = ref();

  useEffect(() => {
    const userName = userInfo.name;

    socket = io(env.VISIT_ORIGIN.replace('http', 'ws'), {
      path: env.BASE_SOCKET + '/chat',
      extraHeaders: {
        Authorization: getCookie('token'),
      },
    });

    socket.on('message', res => {
      if (res.code === 405) setVisible(true);
    })

    socket.once('users', res => state.setUsers(res));
    socket.on(`rooms_${userName}`, res => state.setRooms(res));
    socket.on('chatRecord', res => {
      console.log(res)
    })
    
    socket.on('disconnect', () => {
      console.log('断开连接');
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
  }, [ userInfo.name ])

  function changeRoom(row) {
    console.log(row)
  }

  const [ word, setWord ] = useState('');
  const onChange = e => setWord(e.target.value)
  async function send(e) {
    e.preventDefault();
    console.log(word)
    setWord('');
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
      {state.rooms.map(val => <li key={val.id} onClick={() => changeRoom(val)}>{val.name}</li>)}
    </ul>
    <div className={joinClass(style.content, 'fl')}>
      <div className={style.record}></div>
      <div className={style.sendWrap}>
        <Input.TextArea value={word} onChange={onChange} style={{height: '100%'}} bordered={false} onPressEnter={send} />
      </div>
    </div>
    <Modal visible={visible} onOk={confirmGoLogin} onCancel={() => setVisible(false)} centered okText='确认' cancelText='取消'>
      <p>检测到您的信息，请前往登录</p>
    </Modal>
  </div>);
}

function mapStateToProps(state: any, ownProps: any) {
  const { userInfo } = state.user
  return {
    userInfo,
  }
}

const hoc = connect(mapStateToProps);

export default hoc(chatPage);
