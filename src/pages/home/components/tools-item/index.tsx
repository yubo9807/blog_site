import style from './module.less';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { getSystemEnvironment } from '@/utils/browser';
import { Dropdown } from 'antd';
import { joinClass } from '@/utils/array';

let systemCache = null;

function ToolsItem(props) {

  const [ system, setSystem ] = useState('darwin');
  useEffect(() => {
    systemCache ||= getSystemEnvironment();
    setSystem(systemCache);
  }, [])


  return (<div className={style.toolsItem}>
    <h2 className={style.title}>{props.title}</h2>
    <p>{props.introduce}</p>
    <div className={style.btns}>
      <span className={style.btn}>
        <a href={'/download/'+system+'/'+props.filename} download>下载</a>
        <Dropdown overlay={<ul className={style.dropdownWrap}>
          <li>
            <a href={'/download/darwin/'+props.filename}>MacOS</a>
          </li>
          <li>
            <a href={'/download/linux/'+props.filename}>Linux</a>
          </li>
          <li>
            <a href={'/download/windows/'+props.filename}>Windows</a>
          </li>
        </ul>}>
          <span className={joinClass('iconfont', style.more)}>&#xe6b9;</span>
        </Dropdown>
      </span>
    </div>
  </div>)
}

ToolsItem.propTypes = {
  title: PropTypes.string,
  introduce: PropTypes.string,
  filename: PropTypes.string,
}

export default ToolsItem;
