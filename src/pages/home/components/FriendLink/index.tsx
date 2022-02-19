import style from './module.less';
import { joinClass } from '@/utils/array';

export default ({ list = [] }) => {
  
  return <ul className={joinClass('clearfix', style.friendLink)}>{list.map((val, index) => <li key={index}>
    <a href={val.link} target='_blank'>{val.name}</a>
  </li>)}</ul>
}