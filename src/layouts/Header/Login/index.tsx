import { Button } from 'antd';
import style from './module.less';
import { history, Link } from 'umi';
import { useEffect } from 'react';
import { api_getUserInfo } from '@/api/login';
import { deleteCookie, getCookie, setCookie } from '@/utils/browser';
import { connect } from 'react-redux';
import { actions } from '@/store/user';
import check from './check';

const Login = (props) => {

  useEffect(() => {
    getUserInfo();
  }, []);

  // 获取用户信息
  async function getUserInfo() {
    const token = await getCookie('token');
    if (token) {
      const response: any = await api_getUserInfo({ token });
      if (response.code === 200) {
        // 用户验证成功
        props.onSignInAction();
        check(response.data);
        props.onSetUserinfoAction(response.data);
      }
    }
  }

  function signOut() {
    deleteCookie({name: 'token', path: '/'});
    props.onSignOutAction();
  }

  return (<div className={style.wrap}>
    {props.isLogin ? <div className={style.user}>
      <span>{props.userInfo.name}&nbsp;<i className='iconfont'>&#xe6b9;</i></span>
      <ul>
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
    onSignInAction() {
      dispatch(actions.signInAction());
    },
    onSignOutAction() {
      dispatch(actions.signOutAction());
    },
    onSetUserinfoAction(data: any) {
      dispatch(actions.setUserinfoAction(data));
    },
  }
}

const hoc = connect(mapStateToProps, mapDispatchToProps);

export default hoc(Login);
