import style from './module.less';

// npm
import { useEffect, useState } from 'react';
import { Link, history } from 'umi';

// utils
import { dateFormater } from '@/utils/date';
import { createColor } from '@/utils/string';



function FileDirectory({ fileDirectory }) {



  // #region 高亮显示控制
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
  // #endregion



  const [ isClient, useIsClient ] = useState(false);
  useEffect(() => {
    useIsClient(true);
  }, [])



  // #region jsx
  return (<ul className={style.wrap}>{fileDirectory.map((val, index: number) => 
    <li key={index} className={val.isFile && active === val.name ? style.active : ''} onClick={() => setActive(val.name)}>
      <Link to={val.path}>
        {val.isFile
          ? <i className='iconfont'>&#xe610;</i>
          : <i className='iconfont' style={{ color: val.color }}>&#xe67c;</i>}
        <span className={style.content}>
          {val.isFile ? val.name : val.name.match(/\s.+/)[0].slice(1)}
        </span>
        {val.isFile ? null : <p className={style.otherInfo}>
          {dateFormater(val.createTime * 1000, 'YYYY/MM/DD')}
        </p>}
      </Link>
    </li>
  )}</ul>)
  // #endregion

}

export default FileDirectory;
