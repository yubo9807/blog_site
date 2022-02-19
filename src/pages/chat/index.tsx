import { io } from 'socket.io-client';
import env from '~/config/env';
import { useEffect } from "react";
import { history } from 'umi';


function chatPage({ match }) {
  
  useEffect(() => {
    console.log(match)

    const socket = io(env.ORIGIN, {
      path: env.BASE_SOCKET + '/chat'
    });

    socket.on('disconnect', () => {
      console.log('server disconnect');
    })

    // 离开页面断开 socket
    const unlisten = history.listen((location) => {
      if (location.pathname !== '/chat') {
        socket.close();
      }
    })
    
    return () => {
      unlisten();
    }

  }, [])
  
  return (
    <div className='leayer'>
      功能开发中...
    </div>
  );
}

export default chatPage;