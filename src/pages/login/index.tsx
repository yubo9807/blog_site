import '@/main';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import { history } from 'umi';
import { useEffect, useState } from 'react';
import style from './module.less';
import { joinClass } from '@/utils/array';
import { Provider } from 'react-redux';
import store from '@/store';
import NetworkError from '@/components/NetworkError';

const SIGNIN = 'signIn';
const SIGNUP = 'signUp';

const LoginPage = ({ location }) => {
  
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

  return (<Provider store={store}>

    <div className={style.login}>
      {loginType === SIGNIN && <SignIn />}
      {loginType === SIGNUP && <SignUp />}
      <i className={joinClass('iconfont', style.close)} onClick={() => {
        history.goBack();
      }}>&#xeca0;</i>
    </div>

    <NetworkError />

  </Provider>)
}

export default LoginPage;
