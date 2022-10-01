import style from './module.less';

// umi
import { IRouteProps, NavLink } from 'umi';
import { useState } from 'react';

// 组件
import Logo from './components/logo';
import Login from './components/login';
import ControlledBtns from './components/controlled-btns';

// stroe
import { connect } from 'react-redux';

// utils
import { joinClass } from '@/utils/array';


const navList = [
  { name: '首页', link: '/' },
  { name: '笔记', link: '/note' },
  { name: '聊天', link: '/chat' },
  { name: '关于', link: '/about' },
  { name: 'GitHub', link: 'https://github.com/yubo9807', target: '_blank' },
]

const Header = (props: IRouteProps) => {

  const [ open, setOpen ] = useState(false);

  return (<header className={style.header}>
    <div className='leayer clearfix'>
      <span className={joinClass('fl', style.menuBtnWrap, open ? style.active : '')} onClick={() => setOpen(!open)}>
        <span></span>
      </span>
      <Logo />
      <ul className={joinClass(style.navWrap, 'clearfix', open ? style.active : '')}>{
        navList.map(val => <li key={val.name}>
          {val.link.startsWith('http')
            ? <a href={val.link} target={val.target || '_blank'}>{val.name}</a>
            : <NavLink to={val.link} activeClassName={val.link === props.nowRoute.path ? style.active : ''} onClick={() => setOpen(false)}>{val.name}</NavLink>
          }
        </li>)
      }</ul>
      <Login />
      <ControlledBtns />
    </div>
  </header>)
}

function mapStateToProps(state: any, ownProps: any) {
  return {
    nowRoute: state.route.nowRoute,
  }
}

const hoc = connect(mapStateToProps);

export default hoc(Header);