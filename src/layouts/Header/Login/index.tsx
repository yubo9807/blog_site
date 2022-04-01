import { Button } from 'antd';
import style from './module.less';
import { history, Link } from 'umi';
import { deleteCookie } from '@/utils/browser';
import { connect } from 'react-redux';
import { actions } from '@/store/user';

const Login = (props) => {

  function signOut() {
    deleteCookie({name: 'token', path: '/'});
    props.onSignOutAction();
  }

  return (<div className={style.wrap}>
    {props.isLogin ? <div className={style.user}>
      <span>{props.userInfo.name}&nbsp;<i className='iconfont'>&#xe6b9;</i></span>
      <ul>
        <li><Link to='/user?type=setings'>设置</Link></li>
        <li onClick={signOut}>退出</li>
      </ul>
    </div>
    : <Button className={style['ant-button']} onClick={() => history.push('/login?type=signIn')}>登入</Button>}
  </div>)
}

function mapStateToProps(state: any, ownProps: any) {
  const { isLogin, userInfo } = state.user
  return {
    isLogin,
    userInfo,
  }
}

// 映射事件处理函数
function mapDispatchToProps(dispatch: any) {
  return {
    onSignOutAction() {
      dispatch(actions.signOutAction());
    },
  }
}

const hoc = connect(mapStateToProps, mapDispatchToProps);

export default hoc(Login);
