import { useRef, useState } from "react";
import { history, IRouteProps } from 'umi';
import style from './module.less';
import { joinClass } from '@/utils/array';
import { Input, message, Modal, Dropdown, Menu } from 'antd';
import { connect } from 'react-redux';
import CreateRoom from './CreateRoom';

import init, { socket } from './init';

function chatPage(props: IRouteProps) {
  const state = init(props);

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
    state.setCreateRoomVisible(false);
  }

  const [ roomMenuVisible, setRoomMenuVisible ] = useState(false);
  const roomMenuRef = useRef();
  function onContextMenu(e, row) {
    if (e.button === 2) {
      e.preventDefault();
      const { clientX, clientY } = e;
      const ele: HTMLElement = roomMenuRef.current;
      ele.style.left = clientX + 'px';
      ele.style.top = clientY + 'px';
      state.setRoomId(row.roomId);
      setRoomMenuVisible(true);
    }
  }
  function hiddenRoomMenu(e) {
    e.stopPropagation();
    if (!e.target.className.includes(style.roomMenuBg)) return;
    setRoomMenuVisible(false);
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
        <span className='iconfont' onClick={() => state.setCreateRoomVisible(true)}>&#xe622;</span>
      </div>
      {state.rooms.map(val => <li key={val.id} onClick={() => changeRoom(val)} onContextMenu={e => onContextMenu(e, val)}>
        {val.name}
      </li>)}
    </ul>

    {/* 房间列表右键菜单 */}
    <div className={joinClass(style.roomMenuBg, roomMenuVisible ? style.active : '')} onClick={hiddenRoomMenu}>
      <div ref={roomMenuRef} className={style.roomOperation}>
        <Menu>
          <Menu.Item key={0}>修改群名称</Menu.Item>
          <Menu.Item key={1}>删除群聊</Menu.Item>
        </Menu>
      </div>
    </div>

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
    <CreateRoom visible={state.createRoomVisible} users={state.users} onJoinRoom={onCreateRoom} onCancel={() => state.setCreateRoomVisible(false)} />

    {/* 提示登录 */}
    <Modal visible={state.modalVisible} onOk={() => history.push('/login')} onCancel={() => state.setModalVisible(false)} centered okText='确认' cancelText='取消'>
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
