
import { useState } from 'react';
import { socket } from './init';

export default (state) => {

  const [ roomMenuVisible, setRoomMenuVisible ] = useState(false);
  const [ roomMenuStyle, setRoomMenuStyle ] = useState({ top: '0', left: '0' });

  return {
    
    // 切换房间
    onChangeRoom(row) {
      const { id: roomId } = row
      state.setSelectRow(row);
      socket.emit('queryRecord', { roomId });
    },

    // 创建房间
    onCreateRoom(nameList) {
      const names = nameList.map(val => val.name);
      const roomName = '群聊-' + parseInt('' + Date.now() / 1000);
      socket.emit('createRoom', { roomName, names });
      state.setCreateRoomVisible(false);
    },

    // 删除房间
    onDeleteRoom(e) {
      const { id: roomId, admin } = state.selectRow;
      socket.emit('delRoom', { roomId, admin });
      setRoomMenuVisible(false);
    },

    roomMenuVisible,  // 房间菜单显示状态
    setRoomMenuVisible,
    roomMenuStyle,  // 房间菜单样式
    setRoomMenuStyle,

    // 右键显示菜单
    onContextMenu(e, row) {
      if (e.button === 2) {
        e.preventDefault();
        const { clientX, clientY } = e;
        setRoomMenuStyle({ top: clientY + 'px', left: clientX + 'px' });
        state.setSelectRow(row);
        setRoomMenuVisible(true);
      }
    },
    
  }
}