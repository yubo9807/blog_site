// style
import style from './module.less';

// npm
import { history, IRouteProps } from 'umi';
import { useState, useEffect } from "react";
import { Input, Modal, Menu, message } from 'antd';
import { io } from 'socket.io-client';

// store
import { connect } from 'react-redux';

// component
import CreateRoom from './components/create-room';
import Record from './components/record';
import Protective from '@/components/custom-protective';

// utils
import { joinClass } from '@/utils/array';
import { getCookie } from "@/utils/browser";

// env
import env from '~/config/env';



let socket = null;

function ChatPage(props: IRouteProps) {

  const { userInfo } = props;
  
  const [ rooms,     setRooms     ] = useState([]);  // 房间列表
  const [ users,     setUsers     ] = useState([]);  // 用户列表
  const [ selectRow, setSelectRow ] = useState({ id: '', admin: '', name: '' });  // 当前所选中的房间

  // 控制移动端聊天窗口 true：显示聊天记录，false：显示拥有的房间
  const [ phoneShowRecord, setPhoneShowRecord ] = useState(false);



  // #region 验证用户是否登录
  const [ modalVisible, setModalVisible ] = useState(false);  // 是否显示登录提示弹框

  useEffect(() => {
    socket = io(env.VISIT_ORIGIN.replace('http', 'ws'), {
      path: env.BASE_SOCKET + '/chat',
      extraHeaders: {
        Authorization: getCookie('token'),
      },
    });

    // 验证身份
    socket.on('message', res => {
      if (res.code === 405) setModalVisible(true);
      else message.error(res.msg);
    })
  }, [])

  // jsx 登录提示
  const JSX_LoginPrompt = <Modal
    visible={modalVisible}
    onOk={() => history.push('/login')}
    onCancel={() => setModalVisible(false)}
    centered
    okText='确认'
    cancelText='取消'
    width='400px'
  >
    <p>检测到没有您的信息，请前往登录</p>
  </Modal>
  // #endregion



  // #region 初始化 房间列表/用户列表/聊天记录


  // 初始化
  useEffect(() => {
    const userName = userInfo.name;
    if (!userName) return;

    // 获取所有用户
    socket.once('users', res => setUsers(res));

    // 获取当前账号下拥有的房间
    socket.on(`rooms_${userName}`, res => setRooms(res));

    // 上线提醒
    socket.on('online', res => message.success(res));

    // 服务器断开连接
    socket.on('disconnect', () => {
      console.log('断开连接');
    })

    // 路由发生改变，断开 socket
    const unlisten = history.listen((location) => {
      if (location.pathname !== '/chat') {
        socket.close();  // 离开页面断开 socket
      }
    })

    return () => {
      unlisten();
    }
  }, [userInfo.name]);
  // #endregion



  // #region 切换房间，获取聊天记录
  /**
   * 切换房间
   * @param row 
   */
   function onChangeRoom(row) {
    const { id: roomId } = row
    setPhoneShowRecord(true);
    setSelectRow(row);
    socket.emit('queryRecord', { roomId });
  }

  const [record, setRecord] = useState([]);  // 聊天记录

  useEffect(() => {
    if (!selectRow.id) return;
    socket.on(`record_${selectRow.id}`, res => {
      setRecord(res);
    })
  }, [selectRow.id]);
  // #endregion



  // #region 右键房间菜单 (scoped)
  const [ roomMenuVisible, setRoomMenuVisible ] = useState(false); // 房间菜单弹窗
  const [ roomMenuStyle,   setRoomMenuStyle   ] = useState({ top: '0', left: '0' });  // 房间菜单样式

  /**
   * 右键房间显示菜单
   * @param e 
   * @param row 
   */
  function onContextMenu(e, row) {
    if (e.button === 2) {
      e.preventDefault();
      const { clientX, clientY } = e;
      setRoomMenuStyle({ top: clientY + 'px', left: clientX + 'px' });
      setSelectRow(row);
      setRoomMenuVisible(true);
    }
  }

  /**
   * 删除房间
   * @param e 
   */
   function onDeleteRoom(e) {
    const { id: roomId, admin } = selectRow;
    socket.emit('delRoom', { roomId, admin });
    setRoomMenuVisible(false);
  }

  const JSX_RightClickRoomMenu = <Protective
    visible={roomMenuVisible}
    className={style.roomOperation}
    onClose={() => setRoomMenuVisible(false)}
    style={roomMenuStyle}
  >
    <Menu>
      <Menu.Item key={0} onClick={onShowFixRoomNameModal}>修改群名称</Menu.Item>
      <Menu.Item key={1} onClick={onDeleteRoom}>删除群聊</Menu.Item>
    </Menu>
  </Protective>


  const [ fixRoomNameVisible, setFixRoomNameVisible ] = useState(false);
  const [ fixRoomName,        setFixRoomName        ] = useState('');

  /**
   * 显示修改群名称弹窗
   */
  function onShowFixRoomNameModal() {
    const { name } = selectRow;
    setFixRoomName(name);
    setFixRoomNameVisible(true);
    setRoomMenuVisible(false);
  }
  /**
   * 修改房间名称
   */
  function onRenameRoomName(e) {
    const { id: roomId, admin } = selectRow;
    socket.emit('fixRoomName', { roomId, admin, name: fixRoomName });
    setFixRoomNameVisible(false);
    message.success('修改成功');
  }
  
  const JSX_FixRoomName = <Modal
    visible={fixRoomNameVisible}
    closable={false}
    okText='确认'
    cancelText='取消'
    onOk={onRenameRoomName}
    onCancel={() => setFixRoomNameVisible(false)}
  >
    <Input value={fixRoomName} onChange={e => setFixRoomName(e.target.value)} />
  </Modal>
  // #endregion



  // #region 创建房间
  const [ createRoomVisible, setCreateRoomVisible ] = useState(false); // 创建房间弹窗

  /**
   * 创建房间
   * @param nameList 
   */
  function onCreateRoom(nameList) {
    const names = nameList.map(val => val.name);
    const roomName = '群聊-' + parseInt('' + Date.now() / 1000);
    socket.emit('createRoom', { roomName, names });
    setCreateRoomVisible(false);
  }  
  // #endregion

  

  // #region 房间详情 (scoped)
  const [roomDetailVisible, setRoomDetailVisible] = useState(false);

  const JSX_RoomDetail = <Protective
    className={style.roomDetailWrap}
    visible={roomDetailVisible}
    onClose={() => setRoomDetailVisible(false)}
  >
    <div>房间详情</div>
  </Protective>
  // #endregion



  // #region 发送消息 (scoped)
  const [ word, setWord ] = useState('');

  /**
   * 文字发生改变
   * @param e 
   */
  function onChangeWord(e) {
    setWord(e.target.value);
  }

  /**
   * 发送消息
   * @param e 
   */
  async function enterSend(e) {
    e.preventDefault();
    socket.emit('addRecord', { text: word, roomId: selectRow.id });
    setWord('');
  }

  const JSX_SendWord = <div className={style.sendWrap}>
    <Input.TextArea value={word} onChange={onChangeWord} style={{ height: '100%' }} bordered={false} onPressEnter={enterSend} />
  </div>
  // #endregion



  // #region jsx
  return (<div className={style.container}>
    <div className={joinClass(style.chatWrap, 'clearfix', phoneShowRecord ? style.move : '')}>

      {/* 房间列表 */}
      <ul className={joinClass(style.roomList, 'fl')}>
        <div className={style.search}>
          <Input allowClear prefix={<span className='iconfont'>&#xe64d;</span>} />
          <span className='iconfont' onClick={() => setCreateRoomVisible(true)}>&#xe622;</span>
        </div>
        {rooms.map(val => <li key={val.id} onClick={() => onChangeRoom(val)} onContextMenu={e => onContextMenu(e, val)}>
          {val.name}
        </li>)}
      </ul>

      {JSX_RightClickRoomMenu}

      {/* 内容区 */}
      <div className={joinClass(style.content, 'fl')}>
        <div className={style.header}>
          <i className={joinClass('iconfont', 'fl', style.goBack)} onClick={() => setPhoneShowRecord(false)}>&#xe625;</i>
          <h2 className={joinClass('fl', style.roomName)}>{selectRow.name}</h2>
          <i className={joinClass('iconfont fr', style.icon)} onClick={() => setRoomDetailVisible(true)}>&#xe601;</i>
        </div>

        {/* 聊天记录 */}
        <Record recordList={record} />
        
        {JSX_SendWord}

      </div>

      <CreateRoom visible={createRoomVisible} users={users} onJoinRoom={onCreateRoom} onCancel={() => setCreateRoomVisible(false)} />

      {JSX_RoomDetail}

      {JSX_FixRoomName}

      {JSX_LoginPrompt}

    </div>
  </div>);
  // #endregion

}


// #region store
function mapStateToProps(state: any, ownProps: any) {
  const { userInfo } = state.user
  return {
    userInfo,
  }
}

const hoc = connect(mapStateToProps);
// #endregion



export default hoc(ChatPage);
