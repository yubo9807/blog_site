import { Button, message } from 'antd';
import { Link } from 'umi';
import Input from '@/components/Input';
import style from '../../module.less';
import { history } from 'umi';
import { api_userSginIn, SignIn } from '@/api/login';
import { setCookie } from '@/utils/browser';
import check from './check';
import { useEffect, useState } from 'react';

const signIn: SignIn = {
  username: '',
  password: '',
};

export default () => {
  const [ loading, setLoading ] = useState(false);

  useEffect(() => {
    for (const prop in signIn) signIn[prop] = '';
  }, [])

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

  return (<>
    <h1>登入</h1>
    <Input className={style.inputItem} description='账号' gain={val => signIn.username = val} />
    <Input className={style.inputItem} type='password' description='密码' gain={val => signIn.password = val} />
    <Link to='/login?type=signUp' replace>注册</Link>
    <Button className={style.submit} type="primary" loading={loading} onClick={submit}>登入</Button>
    <p>
      <Link to='/login?type=reset'>忘记密码/邮箱</Link>
    </p>
  </>)
}
