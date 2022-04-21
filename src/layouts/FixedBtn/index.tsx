import style from './module.less';
import { scrollTo } from '@/utils/browser';
import { connect } from 'react-redux';
import { actions } from '@/store/fixed-btns';
import { useEffect, useState } from 'react';



const FixedBtn = (props) => {

  useEffect(() => {
    const key = 'toTop';
    
    if (props.scrollY > 140) {
      !props.btns[key] && props.onAddFixedBtn(key, <i className='iconfont' onClick={() => scrollTo()}>&#xe600;</i>, 1);
    } else {
      props.onDelFixedBtn(key);
    }
  }, [props.scrollY]);


  // 对数据进行排序
  const [ btnList, setBtnList ] = useState([]);
  useEffect(() => {
    const arr = Object.assign([], Object.values(props.btns));
    arr.sort((a: any, b: any) => b.count - a.count);
    setBtnList(arr);
  }, [props.btns]);

  return (<ul className={style.fixed}>
    {btnList.map((val: any, index) => <li key={index}>
      {val.element}
    </li>)}
  </ul>)
}

function mapStateToProps(state: any, ownProps: any) {
  return {
    scrollY: state.scroll.scrollY,
    btns: state.fixedBtns,
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    onAddFixedBtn(key, element, count) {
      dispatch(actions.addFixedBtn(key, element, count));
    },
    onDelFixedBtn(key) {
      dispatch(actions.delFixedBtn(key));
    }
  }
}

const hoc = connect(mapStateToProps, mapDispatchToProps);

export default hoc(FixedBtn);
