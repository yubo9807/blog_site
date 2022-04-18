import { useEffect, useState } from 'react';
import { Link, history } from 'umi';
import style from './module.less';

import { dateFormater } from '@/utils/date';

function FileDirectory({ fileDirectory }) {

  const [ active, setActive ] = useState('');

  useEffect(() => {
    const { pathname } = history.location;
    const path = pathname.split('/');
    const lastPath = path[path.length - 1];
    if (/\.md$/.test(lastPath)) setActive(lastPath);
    else {
      const index = fileDirectory.findIndex(item => item.isFile);
      index >= 0 && setActive(fileDirectory[index].name);
    }
  }, [fileDirectory]);

  return (<ul className={style.wrap}>{fileDirectory.map((val, index: number) => 
    <li key={index} className={val.isFile && active === val.name ? style.active : ''} onClick={() => setActive(val.name)}>
      <Link to={val.path}>
        {val.isFile ? <i className='iconfont'>&#xe610;</i> : <i className='iconfont'>&#xe67c;</i>}
        <span className={style.content}>
          {val.isFile ? val.name : val.name.match(/\s.+/)[0].slice(1)}
        </span>
        {val.isFile ? null : <p className={style.otherInfo}>
          {dateFormater('YYYY/MM/DD', val.createTime * 1000)}
          &nbsp;{val.size}byte
        </p>}
      </Link>
    </li>
  )}</ul>)
}

export default FileDirectory;