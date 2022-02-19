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

  const signInInfo: SignIn = {
    username: '',
    password: '',
  };
  
  // 登入提交
  async function submit() {
    const errorArr = check(signInInfo);

    const error = [...errorArr][0];
    if (error) message.warning(error);
    else {
      setLoading(true);
      const response: any = await api_userSginIn(signInInfo);
      if (response.code === 200) {
        setCookie({ name: 'token', value: response.data.token, path: '/' });
        message.success('登录成功');
        history.goBack();
      }
      setLoading(false);
    }
  }

  return (<>
    <h1>登入</h1>
    <Input className={style.inputItem} description='账号' gain={val => signInInfo.username = val} />
    <Input className={style.inputItem} type='password' description='密码' gain={val => signInInfo.password = val} />
    <Link to='/login?type=signUp' replace>注册</Link>
    <Button className={style.submit} type="primary" loading={loading} onClick={submit}>登入</Button>
    <p>
      <Link to='/login?type=reset'>忘记密码/邮箱</Link>
    </p>
  </>)
}
