import { Link } from 'umi';
import style from './module.less';

export default ({ list = [] }) => {
  return <ul className={style.skillShare}>{list.map((val, index) => <li key={index}>
    <div className={style.wrap}>
      <img src={val.imgSrc} alt="" />
      <Link className={style.text} to={val.link}>
        <h3>{val.name}</h3>
        <p>{val.introduce}</p>
      </Link>
    </div>
  </li>)}</ul>
}