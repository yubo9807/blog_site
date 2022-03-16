
import { useState } from 'react';
import { socket } from './init';

export default (state) => {

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
      state.setRoomMenuVisible(false);
    },

  }
}