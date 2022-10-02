// style
import './index.less';

// npm
import React, { useState } from 'react';
import ReactDOM from 'react-dom';

// utils
import { isClient } from '@/utils/browser';



let setState: any;

const Toast = () => {

  // #region state
  const [ visible, setVisible ] = useState(false);
  const [ content, setContent ] = useState('提示：');
  const [ icon,    setIcon ] = useState('');

  // 保存到外部变量，方便调用
  setState = {
    setVisible,
    setContent,
    setImgSrc: setIcon,
    reset() {
      setContent('');
      setIcon('');
    }
  }
  // #endregion



  // #region jsx
  return (<div className='yu-toast'>
    {visible ? <div className='yu-toast-wrap'>
    {icon && <i className='iconfont' dangerouslySetInnerHTML={{ __html: icon }}></i>}
      <p>{content}</p>
    </div> : null}
  </div>);
  // #endregion

}



// #region 挂载到 body 上
let reactapp = null;
if (isClient()) {  // 为兼容 SSR，服务端不进行挂载
  reactapp = document.createElement('div');
  document.body.appendChild(reactapp);
  ReactDOM.render(React.createElement(Toast), reactapp);
}
// #endregion



// #region 调用方法，进行挂载
function notice(content: string, imgSrc?: string, duration: number = 3000) {
  const { setVisible, setContent, setImgSrc, reset } = setState;
  setVisible(true);
  setContent(content);
  setImgSrc(imgSrc);

  setTimeout(() => {
    setVisible(false);
    reset();
  }, duration);
}

type Option = {
  content: string
  icon?: string
  duration?: number
}

export default function (option: string | Option) {
  if (typeof option === 'string') {
    return notice(option);
  } else if (typeof option === 'object') {
    return notice(option.content, option.icon, option.duration);
  }
}
// #endregion
