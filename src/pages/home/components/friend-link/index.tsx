import style from './module.less';
import { joinClass } from '@/utils/array';
import TitleLevel from '../title-level';

export default ({ list = [] }) => {
  
  return (<div>
    <TitleLevel text='友情链接' />
    <ul className={joinClass('clearfix', style.friendLink)}>{list.map((val, index) => <li key={index}>
      <a href={val.link} target='_blank'>{val.name}</a>
    </li>)}</ul>
  </div>)
}