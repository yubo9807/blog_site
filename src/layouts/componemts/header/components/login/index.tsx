import style from './module.less';
import { Button } from 'antd';
import { history, Link } from 'umi';
import { useEffect } from 'react';

import { deleteCookie } from '@/utils/browser';
import { joinClass } from '@/utils/array';
import { isEmptyObject } from '@/utils/object';
import env from '~/config/env';

import { connect } from 'react-redux';
import { actions as userActions } from '@/store/user';

const Login = (props) => {

  // 监控登录退出状态，有设置权限的页面返回首页
  useEffect(() => {
    const { isLogin, nowRoute } = props;
    if (isLogin === 2 && !isEmptyObject(nowRoute)) {
      nowRoute.state && nowRoute.state.roles && history.push('/');
    }
  }, [props.isLogin, props.nowRoute]);

  function signOut() {
    deleteCookie({name: 'token', path: '/'});
    props.onSignOutAction();
  }

  return (<div className={style.wrap}>
    {props.isLogin === 1 ? <div className={joinClass(style.user, 'clearfix')}>
      {props.userInfo.portrait
        ? <div className={style.portrait}>
            <img src={env.BASE_IMAGE_URL + props.userInfo.portrait} alt={props.userInfo.name} />
          </div>
        : <span>{props.userInfo.name}</span>
      }
      <ul>
        <li><Link to='/user?type=setings'>设置</Link></li>
        <li onClick={signOut}>退出</li>
      </ul>
    </div>
    : <Button className={style['ant-button']} onClick={() => history.push('/login?type=signIn')}>登入</Button>}
  </div>)
}

function mapStateToProps(state: any, ownProps: any) {
  const { user, route } = state;
  return {
    isLogin: user.isLogin,
    userInfo: user.userInfo,
    nowRoute: route.nowRoute,
  }
}

// 映射事件处理函数
function mapDispatchToProps(dispatch: any) {
  return {
    onSignOutAction() {
      dispatch(userActions.signOutAction());
    },
  }
}

const hoc = connect(mapStateToProps, mapDispatchToProps);

export default hoc(Login);
