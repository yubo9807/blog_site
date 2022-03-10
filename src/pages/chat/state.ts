import { useState } from "react";

export default () => {

  const [ rooms, setRooms ] = useState([]);  // 房间列表
  const [ users, setUsers ] = useState([]);  // 用户列表
  const [ record, setRecord ] = useState([]);  // 聊天记录
  
  const [ roomId, setRoomId ] = useState('');  // 当前所在房间
  
  return {
    rooms, setRooms,
    users, setUsers,
    record, setRecord,
    roomId, setRoomId
  }
}