import '@/main';
import style from './module.less';

// npm
import { history } from 'umi';
import { useEffect, useState } from 'react';

// 组件
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import { joinClass } from '@/utils/array';

// redux
import { Provider } from 'react-redux';
import store from '@/store';


// 常量
const SIGNIN = 'signIn';
const SIGNUP = 'signUp';

const LoginPage = ({ location }) => {
  
  

  // #region 根据路由 query 参数加载页面
  const [ loginType, setLoginType ] = useState(SIGNIN);

  useEffect(() => {
    const { type } = history.location.query;
    if (!type) history.replace({ query: { type: SIGNIN }})
    setLoginType(type as string);

    const unlisten = history.listen((location) => {
      const { type } = location.query;
      setLoginType(type as string);
    })
    return () => {
      unlisten();
    }
  }, [loginType]);
  // #endregion



  // #region jsx
  return (<Provider store={store}>

    <div className={style.login}>
      {loginType === SIGNIN && <SignIn />}
      {loginType === SIGNUP && <SignUp />}
      <i className={joinClass('iconfont', style.close)} onClick={() => {
        history.length > 2 ? history.goBack() : history.push('/');
      }}>&#xeca0;</i>
    </div>

  </Provider>)
  // #endregion

}

export default LoginPage;
