import { Button, message } from 'antd';
import { Link } from 'umi';
import Input from '@/components/Input';
import style from '../../module.less';
import { history } from 'umi';
import { api_userSginIn, SignIn } from '@/api/login';
import { setCookie } from '@/utils/browser';
import check from './check';
import { useState } from 'react';

export default () => {
  const [ loading, setLoading ] = useState(false);

  const [ signIn, setSignIn ] = useState({
    username: '',
    password: '',
  })

  // 登入提交
  async function submit() {
    const errorArr = check(signIn);

    const error = [...errorArr][0];
    if (error) message.warning(error);
    else {
      setLoading(true);
      const response: any = await api_userSginIn(signIn);
      if (response.code === 200) {
        setCookie({ name: 'token', value: response.data.token, path: '/' });
        message.success('登录成功');
        history.goBack();
      }
      setLoading(false);
    }
  }

  // 状态更新
  function onChange(key: string, e) {
    setSignIn(Object.assign({}, signIn, { [key]: e.target.value }));
  }
  // 清空内容
  function onClear(key: string) {
    setSignIn(Object.assign({}, signIn, { [key]: '' }));
  }

  return (<>
    <h1>登入</h1>
    <Input
      value={signIn.username}
      onChange={e => onChange('username', e)}
      onClear={() => onClear('username')}
      className={style.inputItem}
      description='账号'
    />
    <Input
      value={signIn.password}
      onChange={e => onChange('password', e)}
      onClear={() => onClear('password')}
      onEnter={submit}
      className={style.inputItem}
      type='password' description='密码'
    />
    <Link to={{ query: { type: 'signUp' }}} replace>注册</Link>
    <Button className={style.submit} type="primary" loading={loading} onClick={submit}>登入</Button>
    <p>
      <Link to={{ query: { type: 'setings' }}} replace>忘记密码/邮箱</Link>
    </p>
  </>)
}
