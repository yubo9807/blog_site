
import { useState } from 'react';

export default (state) => {

  const [ roomMenuVisible, setRoomMenuVisible ] = useState(false);
  const [ roomMenuStyle, setRoomMenuStyle ] = useState({ top: '0', left: '0' });

  return {
    
    roomMenuVisible,  // 房间菜单显示状态
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