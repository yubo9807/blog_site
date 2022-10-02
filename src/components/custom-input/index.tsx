// style
import './index.less';

// npm
import { useEffect, useRef, useState } from 'react';
import { IRouteProps } from 'umi';

// utils
import { joinClass } from '@/utils/array';



export default ({
  value = null,         // 当前值
  onChange = () => {},  // value 发生改变
  onEnter = () => {},   // 按下回车触发
  onClear = () => {},   // 清空内容触发
  focus = false,        // 是否获取焦点
  icon,                 // 图标
  description = '请输入内容',  // 提示语
  className = '',       // 自定义类名
  type = 'text'         // 输入框类型
}: IRouteProps) => {

  const [ input, setInput ] = useState('');

  /**
   * 回车触发
   */
  function enter(e) {
    if (e.keyCode !== 13) return; 
    if (value === null) onEnter(input);
    else onEnter(value);
  }

  /**
   * 清空内容
   */
  function clearInput() {
    if (value === null) setInput('');
    else onClear();
  }

  const inputRef = useRef(null);
  useEffect(() => {
    if (focus) inputRef.current.focus();
    else inputRef.current.blur();
  }, [focus])


  // #region jsx
  return (<div className={joinClass('yu-input', (value || input) !== '' ? 'yu-input-focus' : '', className)}>
    {value === null
      ? <input ref={inputRef} type={type} value={input} onChange={e => setInput(e.target.value)} onKeyUp={enter} />
      : <input ref={inputRef} type={type} value={value} onChange={onChange} onKeyUp={enter} />
    }
    <span className='yu-input-prompt'>{description}</span>
    <div className='yu-input-line'></div>
    {(value || input) === '' ? <i className='iconfont yu-input-icon'>{icon}</i>
    : <i className='iconfont yu-input-icon' onClick={clearInput}>&#xeca0;</i>}
  </div>)
  // #endregion

}