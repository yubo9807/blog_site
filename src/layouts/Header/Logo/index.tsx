import style from './module.less';
import img_logo from '@/assets/images/logo.png';

export default () => {
  return (<a href="/" className={style.logo}>
    <img src={img_logo} alt="yubo" />
    <h1>yubo 个人技术博客</h1>
  </a>)
}