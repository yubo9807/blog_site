import { joinClass } from '@/utils/array';
import style from './module.less';
import Input from '@/components/Input';
import { Breadcrumb } from 'antd';
import { IRouteProps, Link } from 'umi';

export default ({ crumb, path }: IRouteProps) => {
  
  // 内容搜索
  function search(value: string) {
    console.log(value)
  }

  return (<div className={joinClass('leayer', 'clearfix', style.header)}>
    <Breadcrumb className={style.antBreadcrumb}>{crumb && crumb.map((val: any, index: number) => 
      <Breadcrumb.Item key={index}>
        <Link to={path + val.link}>{val.folder}</Link>
      </Breadcrumb.Item>
    )}</Breadcrumb>

    <div className={style.search}>
      <Input icon='&#xe64d;' gain={search} />
    </div>
  </div>)
}
