import { Button, message } from 'antd';
import { Link, history } from 'umi';
import Input from '@/components/Input';
import style from '../../module.less';
import { api_getMailCode, api_userSignUp } from '@/api/login';
import { removeUseLessKey } from '@/utils/object';
import check from './check';
import { useEffect, useState } from 'react';

const signUp = {
  username: '',
  password: '',
  newPassword: '',
  mail: '',
  mailCode: '',
};

export default () => {
  useEffect(() => {
    for (const prop in signUp) signUp[prop] = '';
  }, [])
  
  const [ loading, setLoading ] = useState(false);

  // 数据验证是否通过
  function verify() {
    const errorArr = check(signUp);
    const error = errorArr[0];
    if (!error) return true;
    message.warning(error);
    return false;
  }

  // 获取邮箱验证码
  async function getMailCode(mail: string) {
    if (!verify()) return;
    const response: any = await api_getMailCode({ mail });
    if (response.code === 200) message.success('验证码已发送，请注意查收');
  }
  
  // 注册提交
  async function submit() {
    if (!verify()) return;
    setLoading(true);

    const { newPassword, ...args } = signUp;
    const params = removeUseLessKey(args);
    
    const response: any = await api_userSignUp(params);
    if (response.code === 200) {
      message.success('注册成功, 请登录');
      history.replace('/login?type=signIn');
    }
    setLoading(false);
  }


  return (<>
    <h1>注册</h1>
    <Input className={style.inputItem} description='用户名' gain={val => signUp.username = val} />
    <Input className={style.inputItem} type='password' description='密码' gain={val => signUp.password = val} />
    <Input className={style.inputItem} type='password' description='确认密码' gain={val => signUp.newPassword = val} />
    <Input className={style.inputItem} description='邮箱(选填)' gain={val => signUp.mail = val} />
    <div className={style.mailCodeWrap}>
      <Input className={style.inputItem} description='邮箱验证码' gain={val => signUp.mailCode = val} />
      <Button onClick={() => getMailCode(signUp.mail)}>获取验证码</Button>
    </div>
    <Link to='/login?type=signIn' replace>登入</Link>
    <Button className={style.submit} type="primary" loading={loading} onClick={submit}>注册</Button>
  </>)
}
