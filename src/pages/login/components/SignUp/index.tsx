import { Button, message } from 'antd';
import { Link, history } from 'umi';
import Input from '@/components/Input';
import style from '../../module.less';
import { api_getMailCode, api_userSignUp } from '@/api/login';
import { removeUseLessKey } from '@/utils/object';
import check from './check';
import { useState } from 'react';


export default () => {
  const signUpInfo = {
    username: '',
    password: '',
    newPassword: '',
    mail: '',
    mailCode: '',
  };
  
  const [ loading, setLoading ] = useState(false);

  // 数据验证是否通过
  function verify() {
    const errorArr = check(signUpInfo);
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

    const { newPassword, ...args } = signUpInfo;
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
    <Input className={style.inputItem} description='用户名' gain={val => signUpInfo.username = val} />
    <Input className={style.inputItem} type='password' description='密码' gain={val => signUpInfo.password = val} />
    <Input className={style.inputItem} type='password' description='确认密码' gain={val => signUpInfo.newPassword = val} />
    <Input className={style.inputItem} description='邮箱(选填)' gain={val => signUpInfo.mail = val} />
    <div className={style.mailCodeWrap}>
      <Input className={style.inputItem} description='邮箱验证码' gain={val => signUpInfo.mailCode = val} />
      <Button onClick={() => getMailCode(signUpInfo.mail)}>获取验证码</Button>
    </div>
    <Link to='/login?type=signIn' replace>登入</Link>
    <Button className={style.submit} type="primary" loading={loading} onClick={submit}>注册</Button>
  </>)
}
