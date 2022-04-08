import { joinClass } from '@/utils/array';
import { useRef, useState } from 'react';
import { IRouteProps } from 'umi';
import './index.less';

export default ({
  value = null,
  onChange = () => {},
  onEnter = () => {},
  onClear = () => {},
  icon,
  description = '请输入内容',
  className = '',
  type = 'text'
}: IRouteProps) => {

  const [ input, setInput ] = useState('');

  // 回车触发
  function enter(e) {
    if (e.keyCode !== 13) return; 
    if (value === null) onEnter(input);
    else onEnter(value);
  }

  function clearInput() {
    if (value === null) setInput('');
    else onClear();
  }

  return (<div className={joinClass('yu-input', (value || input) !== '' ? 'yu-input-focus' : '', className)}>
    {value === null
      ? <input type={type} value={input} onChange={e => setInput(e.target.value)} onKeyUp={enter} />
      : <input type={type} value={value} onChange={onChange} onKeyUp={enter} />
    }
    <span className='yu-input-prompt'>{description}</span>
    <div className='yu-input-line'></div>
    {(value || input) === '' ? <i className='iconfont yu-input-icon'>{icon}</i>
    : <i className='iconfont yu-input-icon' onClick={clearInput}>&#xeca0;</i>}
  </div>)
}