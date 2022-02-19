import { joinClass } from '@/utils/array';
import { IRouteProps } from '@umijs/types';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'umi';
import style from './module.less';
import SubTabs from './SubTabs';


const NoteNav = ({ navList, path, scrollY }: IRouteProps) => {

  const [ fixed, setFixed ] = useState(false);

  useEffect(() => {
    // 滚动条到一定位置后定位 header
    if (scrollY > 136) setFixed(true);
    else setFixed(false);
  }, [scrollY]);

  return (<div className={joinClass(style.nav, fixed ? style.fixed : '')}>
    <ul className={joinClass('leayer', 'clearfix', style.navList)}>{
      navList && navList.map((val: any, index: number) => <li key={index}>
        <Link to={path + val.link}>{val.folder}</Link>
        {val.files && typeof val.files[0] === 'object' && <i className={joinClass('iconfont', style.icon)}>&#xe6b9;</i>}
        {val.files.length > 0 && typeof val.files[0] === 'object' && <SubTabs list={val.files} baseUrl={path + val.link} />}
      </li>)
    }</ul>
  </div>)
}

function mapStateToProps(state: any, ownProps: any) {
  return {
    scrollY: state.scroll.scrollY
  }
}

const hoc = connect(mapStateToProps);

export default hoc(NoteNav);