import { useRef, useState } from "react";
import { history, IRouteProps } from 'umi';
import style from './module.less';
import { joinClass } from '@/utils/array';
import { Input, Modal, Menu, Empty, message } from 'antd';
import { connect } from 'react-redux';
import CreateRoom from './CreateRoom';
import Record from './Record';
import Protective from '@/components/Protective';

import init, { socket } from './init';

function chatPage(props: IRouteProps) {
  const state = init(props);

  // 切换房间
  function changeRoom(row) {
    const { id: roomId } = row
    state.setSelectRow(row);
    socket.emit('queryRecord', { roomId });
  }

  const [ word, setWord ] = useState('');  // 要发送的消息
  const onChange = e => setWord(e.target.value)
  // 发送聊天记录
  async function send(e) {
    e.preventDefault();
    socket.emit('addRecord', { text: word, roomId: state.selectRow.id });
    setWord('');
  }

  // 创建房间
  function onCreateRoom(nameList) {
    const names = nameList.map(val => val.name);
    const roomName = '群聊-' + parseInt('' + Date.now() / 1000);
    socket.emit('createRoom', { roomName, names });
    state.setCreateRoomVisible(false);
  }

  // 控制房间右键菜单
  const [ roomMenuVisible, setRoomMenuVisible ] = useState(false);
  const [ roomMenuStyle, setRoomMenuStyle ] = useState({ top: '0', left: '0' });
  function onContextMenu(e, row) {
    if (e.button === 2) {
      e.preventDefault();
      const { clientX, clientY } = e;
      setRoomMenuStyle({ top: clientY + 'px', left: clientX + 'px' });
      state.setSelectRow(row);
      setRoomMenuVisible(true);
    }
  }
  // 删除房间
  function deleteRoom(e) {
    const { id: roomId, admin, name } = state.selectRow;
    socket.emit('delRoom', { roomId, admin });
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
    <Protective
      visible={roomMenuVisible}
      className={style.roomOperation}
      onClose={() => setRoomMenuVisible(false)}
      style={roomMenuStyle}
    >
      <Menu>
        <Menu.Item key={0}>修改群名称</Menu.Item>
        <Menu.Item key={1} onClick={deleteRoom}>删除群聊</Menu.Item>
      </Menu>
    </Protective>

    {/* 内容区 */}
    <div className={joinClass(style.content, 'fl')}>
      <div className={style.header}>
        <h2 className={joinClass('fl', style.roomName)}>{state.selectRow.name}</h2>
        <i className={joinClass('iconfont fr', style.icon)}>&#xe601;</i>
      </div>
      {/* 聊天记录 */}
      <Record recordList={state.record} />

      {/* 发送消息 */}
      <div className={style.sendWrap}>
        <Input.TextArea value={word} onChange={onChange} style={{height: '100%'}} bordered={false} onPressEnter={send} />
      </div>
    </div>

    <Protective visible={roomMenuVisible} onClose={() => setRoomMenuVisible(false)}>
      <div>hhhhh</div>
    </Protective>

    {/* 创建房间 */}
    <CreateRoom visible={state.createRoomVisible} users={state.users} onJoinRoom={onCreateRoom} onCancel={() => state.setCreateRoomVisible(false)} />

    {/* 提示登录 */}
    <Modal
      visible={state.modalVisible}
      onOk={() => history.push('/login')}
      onCancel={() => state.setModalVisible(false)}
      centered
      okText='确认'
      cancelText='取消'
    >
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
