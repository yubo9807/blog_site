import { joinClass } from '@/utils/array';
import { useRef, useState } from 'react';
import { IRouteProps } from 'umi';
import './index.less';

export default ({ gain = () => {}, icon, description = '请输入内容', isTrim = true, className = '', type = 'text' }: IRouteProps) => {

  const [ value, setValue ] = useState('');

  // value 值变化重新赋值
  function change(e: any) {
    const str: string = e.target.value;
    if (isTrim) setValue(str.trim());
    else setValue(str);
  }
  
  function getValue(e: any) {
    if (['blur', 'click'].includes(e.type) || e.keyCode === 13) {
      gain(value);
    }
  }

  const inputRef: any = useRef();
  function clearValue() {
    setValue('');
    const input = inputRef.current;
    input.focus();
    // setTimeout(() => input.blur(), 0);
  }

  return (<div className={joinClass('yu-input', value !== '' ? 'yu-input-focus' : '', className)}>
    <input ref={inputRef} type={type} value={value} onChange={change} onKeyDown={getValue} onBlur={getValue} />
    <span className='yu-input-prompt'>{description}</span>
    <div className='yu-input-line'></div>
    {value === '' ? <i className='iconfont yu-input-icon' onClick={getValue}>{icon}</i>
    : <i className='iconfont yu-input-icon' onClick={clearValue}>&#xeca0;</i>}
  </div>)
}