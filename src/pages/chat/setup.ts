import env from '~/config/env';
import { getCookie } from "@/utils/browser";
import { useState, useEffect } from "react";
import { history, IRouteProps } from 'umi';
import { io } from 'socket.io-client';
import { message } from "antd";

export let socket = null;

export default (props: IRouteProps) => {
  const { userInfo } = props;


  // #region 用户验证
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
    })
  }, [])
  // #endregion



  // #region 初始化 房间列表/用户列表/聊天记录
  const [ rooms,     setRooms     ] = useState([]);  // 房间列表
  const [ users,     setUsers     ] = useState([]);  // 用户列表
  const [ selectRow, setSelectRow ] = useState({ id: '', admin: '', name: '' });  // 所选中的房间
  

  // 初始化
  useEffect(() => {
    const userName = userInfo.name;
    if (!userName) return;

    socket.once('users', res => setUsers(res));
    socket.on(`rooms_${userName}`, res => setRooms(res));
    socket.on('online', res => message.success(res));

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
  // #endregion



  // #region 选中房间，获取聊天记录
  const [ record, setRecord ] = useState([]);  // 聊天记录

  useEffect(() => {
    if (!selectRow.id) return;
    socket.on(`record_${selectRow.id}`, res => {
      setRecord(res);
    })
  }, [ selectRow.id ]);
  // #endregion



  // #region 控制移动端聊天窗口
  const [ phoneShowRecord, setPhoneShowRecord ] = useState(false);
  // #endregion



  // #region 房间操作控制
  const [ createRoomVisible, setCreateRoomVisible ] = useState(false); // 创建房间弹窗


  const [ roomMenuVisible,   setRoomMenuVisible   ] = useState(false); // 房间菜单弹窗
  const [ roomMenuStyle,     setRoomMenuStyle     ] = useState({ top: '0', left: '0' });  // 房间菜单样式

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
   * 切换房间
   * @param row 
   */
  function onChangeRoom(row) {
    const { id: roomId } = row
    setPhoneShowRecord(true);
    setSelectRow(row);
    socket.emit('queryRecord', { roomId });
  }

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

  /**
   * 删除房间
   * @param e 
   */
  function onDeleteRoom(e) {
    const { id: roomId, admin } = selectRow;
    socket.emit('delRoom', { roomId, admin });
    setRoomMenuVisible(false);
  }


  const [ roomDetailVisible, setRoomDetailVisible ] = useState(false);
  // #endregion



  // #region 消息操作控制
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
  // #endregion



  return {
    // 登录提示框控制
    modalVisible, setModalVisible,

    // 基本数据
    rooms,
    users,
    record,
    
    // 当前房间
    selectRow,
    
    // 房间
    createRoomVisible, setCreateRoomVisible,
    roomMenuVisible, setRoomMenuVisible,
    roomMenuStyle,
    onContextMenu,
    onChangeRoom,
    onCreateRoom,
    onDeleteRoom,

    roomDetailVisible, setRoomDetailVisible,

    // 消息
    word,
    onChangeWord,
    enterSend,

    phoneShowRecord, setPhoneShowRecord,

  }
}