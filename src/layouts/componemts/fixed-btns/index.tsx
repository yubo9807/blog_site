// style
import style from './module.less';

// npm
import { useEffect, useState } from 'react';

// utils
import { scrollTo } from '@/utils/browser';

// store
import { connect } from 'react-redux';
import { actions } from '@/store/fixed-btns';



const FixedBtn = (props) => {



  // #region 添加回到顶部按钮
  useEffect(() => {
    const key = 'toTop';
    
    if (props.scrollY > 140) {
      !props.btns[key] && props.onAddFixedBtn(key, <i className='iconfont' onClick={() => scrollTo()}>&#xe600;</i>, 1);
    } else {
      props.onDelFixedBtn(key);
    }
  }, [props.scrollY]);
  // #endregion



  // #region  store 存放数据发生改变，对数据重新进行排序
  const [ btnList, setBtnList ] = useState([]);
  useEffect(() => {
    const arr = Object.assign([], Object.values(props.btns));
    arr.sort((a: any, b: any) => b.count - a.count);
    setBtnList(arr);
  }, [props.btns]);
  // #endregion



  // #region jsx
  return (<ul className={style.fixed}>
    {btnList.map((val: any, index) => <li key={index}>
      {val.element}
    </li>)}
  </ul>)
  // #endregion

}



// #region store
function mapStateToProps(state: any, ownProps: any) {
  return {
    scrollY: state.viewport.scrollY,
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
// #endregion



export default hoc(FixedBtn);
