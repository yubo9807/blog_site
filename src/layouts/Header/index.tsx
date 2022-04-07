import { joinClass } from '@/utils/array';
import { NavLink } from 'umi';
import style from './module.less';
import Logo from './Logo';
import Login from './Login';
import { useState } from 'react';
import Item from 'antd/lib/list/Item';


const navList = [
  { name: '首页', link: '/' },
  { name: '笔记', link: '/note/JavaScript' },
  { name: '聊天', link: '/chat' },
  { name: '关于', link: '/about' },
  { name: 'GitHub', link: 'https://github.com/yubo9807', target: '_blank' },
]

export default () => {
  const [active, setActive] = useState(false);

  return (<header className={joinClass('leayer', style.header, 'clearfix')}>
    <i className={joinClass(style.menu, active ? style.active : '')} onClick={() => setActive(!active)}></i>
    <Logo />
    <ul className={joinClass(style.navWrap, 'clearfix', active ? style.active : '')}>{
      navList.map(val => <li key={val.name}>
        {val.link.startsWith('http')
          ? <a href={val.link} target={val.target || '_blank'}>{val.name}</a>
          : <NavLink to={val.link} activeClassName={val.link === '/' ? '' : style.active} onClick={() => setActive(false)}>{val.name}</NavLink>
        }
      </li>)
    }</ul>
    <Login />
  </header>)
}