import { IRouteProps } from '@umijs/types';
import { Link } from 'react-router-dom';
import style from './module.less';
import { useLocation } from 'umi';
import { pathNameSplit } from '@/utils/browser';
import { connect } from 'react-redux';
import { joinClass } from '@/utils/array';
import { useEffect, useState } from 'react';


const SildList = ({ list, scrollY, show }: IRouteProps) => {
  const { pathname } = useLocation();
  const arr = pathNameSplit(pathname);
  const len = arr.length - 1;
  let baseUrl = '';

  if (/^\d/.test(arr[len])) {
    arr.forEach((val, index) => {
      if (index !== len) baseUrl += val + '/';
    })
  } else {
    arr.forEach((val, index) => {
      baseUrl += val + '/';
    })
  }

  const [ fixed, setFixed ] = useState(false);
  useEffect(() => {
    if (scrollY > 136) setFixed(true);
    else setFixed(false);
  }, [scrollY]);
  
  return (<div className={joinClass(style.slidWrap, fixed ? style.fixed : '', show ? style.active : '')}>
    <ul className={style.slidList}>{list && list.map((val: string, index: number) => <li key={index}>
      <Link to={baseUrl + val.split(/\s/)[0]}>{val.replace('.md', '')}</Link>
    </li>)}</ul>
  </div>)
}

function mapStateToProps(state: any, ownProps: any) {
  return {
    scrollY: state.scroll.scrollY
  }
}

const hoc = connect(mapStateToProps);

export default hoc(SildList);