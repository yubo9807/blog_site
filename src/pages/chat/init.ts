import env from '~/config/env';
import { getCookie } from "@/utils/browser";
import { useState, useEffect } from "react";
import { history, IRouteProps } from 'umi';
import { io } from 'socket.io-client';
import { message } from "antd";

export let socket = null;

export default (props: IRouteProps) => {
  const { userInfo } = props;

  const [ rooms,     setRooms     ] = useState([]);  // 房间列表
  const [ users,     setUsers     ] = useState([]);  // 用户列表
  const [ record,    setRecord    ] = useState([]);  // 聊天记录
  const [ selectRow, setSelectRow ] = useState({ id: '', admin: '', name: '' });  // 所选中的房间

  // 弹框显示
  const [ modalVisible,      setModalVisible      ] = useState(false);  // 是否显示登录提示弹框
  const [ createRoomVisible, setCreateRoomVisible ] = useState(false);  // 是否显示创建房间弹框

  // 初始化
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

  useEffect(() => {
    if (!selectRow.id) return;
    socket.on(`record_${selectRow.id}`, res => {
      setRecord(res);
    })
  }, [ selectRow.id ]);
  
  return {
    rooms, setRooms,
    users, setUsers,
    record, setRecord,
    selectRow, setSelectRow,
    modalVisible, setModalVisible,
    createRoomVisible, setCreateRoomVisible,
  }
}