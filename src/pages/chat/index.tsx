import { io } from 'socket.io-client';
import env from '~/config/env';
import { useEffect, useState } from "react";
import { history, IRouteProps } from 'umi';
import style from './module.less';
import { joinClass } from '@/utils/array';
import { Input, message, Modal } from 'antd';
import { getCookie } from '@/utils/browser';
import { connect } from 'react-redux';
import CreateRoom from './CreateRoom';

import ref from './state';
let socket = null;

function chatPage(props: IRouteProps) {
  const { userInfo } = props;
  
  const [ modalVisible, setModalVisible ] = useState(false);  // 是否显示弹框
  const [ createRoomVisible, setCreateRoomVisible ] = useState(false);  // 是否显示弹框

  const state = ref();

  // 初始化
  useEffect(() => {
    const userName = userInfo.name;

    socket = io(env.VISIT_ORIGIN.replace('http', 'ws'), {
      path: env.BASE_SOCKET + '/chat',
      extraHeaders: {
        Authorization: getCookie('token'),
      },
    });

    socket.on('message', res => {
      if (res.code === 405) setModalVisible(true);
    })

    if (!userName) return;
    socket.once('users', res => state.setUsers(res));
    socket.on(`rooms_${userName}`, res => state.setRooms(res));
    socket.on('online', res => message.success(res))

    socket.on('disconnect', () => {
      console.log('断开连接');
    })

    const unlisten = history.listen((location) => {
      if (location.pathname !== '/chat') {
        socket.close();  // 离开页面断开 socket
      }
    })
    
    return () => {
      unlisten();
    }
  }, [ userInfo.name ]);

  useEffect(() => {
    if (!state.roomId) return;
    socket.on(`record_${state.roomId}`, res => {
      state.setRecord(res);
    })
  }, [ state.roomId ]);

  // 切换房间
  function changeRoom(row) {
    const { id: roomId } = row
    state.setRoomId(roomId);
    socket.emit('queryRecord', { roomId });
  }

  const [ word, setWord ] = useState('');  // 要发送的消息
  const onChange = e => setWord(e.target.value)
  // 发送
  async function send(e) {
    e.preventDefault();
    socket.emit('addRecord', { text: word, roomId: state.roomId });
    socket.on(`record_${state.roomId}`, res => {
      state.setRecord(res);
    })
    setWord('');
  }

  // 创建房间
  function onCreateRoom(nameList) {
    const names = nameList.map(val => val.name);
    const roomName = '群聊-' + parseInt('' + Date.now() / 1000);
    socket.emit('createRoom', { roomId: state.roomId, roomName, names });
    setCreateRoomVisible(false);
  }

  function onContextMenu(e) {
    if (e.button === 2) {
      e.preventDefault();
      console.log('11111 :>> ', 11111);
    }
  }
  
  return (<div className={joinClass(style.chatWrap, 'clearfix')}>

    {/* 侧边栏 */}
    <div className={joinClass(style.side, 'fl')}>
      <span className='iconfont'>&#xe622;</span>
    </div>

    {/* 房间列表 */}
    <ul className={joinClass(style.roomList, 'fl')}>
      <div className={style.search}>
        <Input allowClear prefix={<span className='iconfont'>&#xe64d;</span>} />
        <span className='iconfont' onClick={() => setCreateRoomVisible(true)}>&#xe622;</span>
      </div>
      {state.rooms.map(val => <li key={val.id} onClick={() => changeRoom(val)} onContextMenu={onContextMenu}>{val.name}</li>)}
    </ul>

    {/* 内容区 */}
    <div className={joinClass(style.content, 'fl')}>
      {/* 聊天记录 */}
      <div className={style.record}>
        <ul>{state.record.map((val, index) => <li key={index}>
          <div>
            <span>{val.userName}</span>
          </div>
          <div>
            <span className="time">{val.time}</span>
            <span className="time">{val.text}</span>
          </div>
        </li>)}</ul>
      </div>

      {/* 发送消息 */}
      <div className={style.sendWrap}>
        <Input.TextArea value={word} onChange={onChange} style={{height: '100%'}} bordered={false} onPressEnter={send} />
      </div>
    </div>

    {/* 创建房间 */}
    <CreateRoom visible={createRoomVisible} users={state.users} onJoinRoom={onCreateRoom} onCancel={() => setCreateRoomVisible(false)} />

    {/* 提示登录 */}
    <Modal visible={modalVisible} onOk={() => history.push('/login')} onCancel={() => setModalVisible(false)} centered okText='确认' cancelText='取消'>
      <p>检测到没有您的信息，请前往登录</p>
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
