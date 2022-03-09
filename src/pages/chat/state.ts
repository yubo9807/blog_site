import { useState } from "react";

export default () => {
  const [ isModal, setIsModal ] = useState(false);  // 是否显示弹框

  const [ rooms, setRooms ] = useState([]);  // 房间列表
  const [ users, setUsers ] = useState([]);  // 用户列表
  const [ record, setRecord ] = useState([]);  // 聊天记录
  
  return {
    isModal, setIsModal,
    rooms, setRooms,
    users, setUsers,
    record, setRecord,
  }
}