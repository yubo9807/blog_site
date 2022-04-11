import style from './subTabs.less';
import { Link } from 'umi';
import { joinClass } from '@/utils/array';


const SubTabs = ({ list, baseUrl = '' }) => {

  return (<ul className={style.subTabs}>{
    list && list.map((val: any, index: number) => <li key={index}>
      <Link to={baseUrl + '/' + val.link}>{val.folder}</Link>
      {val.files && typeof val.files[0] === 'object' && <>
        <i className={joinClass('iconfont', style.icon)}>&#xe64b;</i>
        <SubTabs list={val.files} baseUrl={baseUrl + '/' + val.link} />
      </>}
    </li>)
  }</ul>)
}

export default SubTabs;
