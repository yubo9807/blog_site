import style from './module.less';

// npm
import { Breadcrumb } from 'antd';
import { Link } from 'umi';
import { connect } from 'react-redux';

import store from '@/store';
import { useEffect, useState } from 'react';


function MyBreadcrumb({ filename }) {
  const piecewise = filename.split('/');

  const [ path, setPath ] = useState('/');
  useEffect(() => {
    store.getState().route.nowRoute.path && setPath(store.getState().route.nowRoute.path);
  }, [store.getState().route.nowRoute])
  
  // #region jsx
  return (<Breadcrumb className={style.breadcrumb}>
    <Breadcrumb.Item>
      <Link to={path}>笔记</Link>
    </Breadcrumb.Item>
    {piecewise.map((val: any, index: number) =>
      <Breadcrumb.Item key={index}>
        <Link to={path + '/' + piecewise.slice(0, index + 1).join('/')}>
          {/\..+$/.test(val) ? val : val && val.match(/\s.+/)[0].slice(1)}
        </Link>
      </Breadcrumb.Item>
    )}
  </Breadcrumb>)
  // #endregion

}

const hoc = connect(() => store.getState());
export default hoc(MyBreadcrumb);