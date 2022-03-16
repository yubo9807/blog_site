import { useState } from 'react';
import { socket } from './init';

export default (state) => {
  const [ word, setWord ] = useState('');

  return {

    // 要发送的消息
    word,

    // 改变文字重新赋值
    onChangeWord: e => setWord(e.target.value),

    // 发送消息
    async enterSend(e) {
      e.preventDefault();
      socket.emit('addRecord', { text: word, roomId: state.selectRow.id });
      setWord('');
    },
    
  }
}