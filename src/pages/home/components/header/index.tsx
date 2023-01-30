// styles
import style from './module.less';

// utils
import { joinClass } from '@/utils/array';



export default () => {
  return (<div className={style.header}>
    <div className={joinClass('leayer', style.boundary)}>
      <div className={style.content}>
        <strong className={style.title}>Personal Technology Blog</strong>
        <p>纵使绿灯再长，也等不来一个不想过马路的人</p>
      </div>
    </div>
  </div>)
}
