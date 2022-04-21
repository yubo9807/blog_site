import style from './module.less';
import { scrollTo } from '@/utils/browser';
import { connect } from 'react-redux';
import { actions } from '@/store/fixed-btns';
import { useEffect } from 'react';



const FixedBtn = (props) => {

  useEffect(() => {
    const key = 'toTop';
    
    if (props.scrollY > 140) {
      !props.btns[key] && props.onAddFixedBtn(key, <i className='iconfont' onClick={() => scrollTo()}>&#xe600;</i>);
    } else {
      props.onDelFixedBtn(key);
    }
  }, [props.scrollY]);

  return (<ul className={style.fixed}>
    {Object.values(props.btns).map((val: any, index) => <li key={index}>
      {val}
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
    onAddFixedBtn(key, val) {
      dispatch(actions.addFixedBtn(key, val));
    },
    onDelFixedBtn(key) {
      dispatch(actions.delFixedBtn(key));
    }
  }
}

const hoc = connect(mapStateToProps, mapDispatchToProps);

export default hoc(FixedBtn);
