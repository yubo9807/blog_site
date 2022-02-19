import '@/main';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import { history } from 'umi';
import { useEffect, useState } from 'react';
import style from './module.less';
import { joinClass } from '@/utils/array';

const LoginPage = () => {
  
  const [ loginType, setLoginType ] = useState('signIn');
  useEffect(() => {
    const { type } = history.location.query;
    setLoginType(type as string);

    const unlisten = history.listen((location) => {
      const { type } = location.query;
      setLoginType(type as string);
    })
    return () => {
      unlisten();
    }
  }, [loginType]);

  return (<div className={style.login}>
    {loginType === 'signIn' && <SignIn />}
    {loginType === 'signUp' && <SignUp />}
    <i className={joinClass('iconfont', style.close)} onClick={() => {
      history.goBack();
    }}>&#xeca0;</i>
  </div>)
}

export default LoginPage;
