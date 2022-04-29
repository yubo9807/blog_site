// npm
import style from './module.less';

// static
import img_404 from '@/assets/imgs/404.png';



const Notfound = () => {

  // #region jsx
  return (<div className={style.notFound}>
    <img src={img_404} alt="找不到页面" />
  </div>)
  // #endregion

}

export default Notfound;
