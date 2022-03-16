
import { useState } from 'react';

export default (state) => {

  const [ modalVisible,      setModalVisible      ] = useState(false);
  const [ createRoomVisible, setCreateRoomVisible ] = useState(false);
  const [ roomMenuVisible,   setRoomMenuVisible   ] = useState(false);
  const [ roomMenuStyle,     setRoomMenuStyle     ] = useState({ top: '0', left: '0' });

  return {
    
    // 登录提示弹窗
    modalVisible,
    setModalVisible,

    // 创建房间弹窗
    createRoomVisible,
    setCreateRoomVisible,

    // 房间菜单弹窗
    roomMenuVisible,
    setRoomMenuVisible,

    roomMenuStyle,  // 房间菜单样式

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