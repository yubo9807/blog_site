import { Breadcrumb } from 'antd';
import { Link } from 'umi';
import style from './module.less';

export default ({ filename, route }) => {
  const piecewise = filename.split('/');
  
  return (<Breadcrumb className={style.breadcrumb}>
    <Breadcrumb.Item>
      <Link to={route.path}>笔记</Link>
    </Breadcrumb.Item>
  {piecewise.map((val: any, index: number) =>
    <Breadcrumb.Item key={index}>
      <Link to={route.path + '/' + piecewise.slice(0, index + 1).join('/')}>
        {/\..+$/.test(val) ? val : val && val.match(/\s.+/)[0].slice(1)}
      </Link>
    </Breadcrumb.Item>
  )}
  </Breadcrumb>)
}