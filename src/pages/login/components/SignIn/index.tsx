import style from '../../module.less';

// npm
import { history, Link } from 'umi';
import { Button, message } from 'antd';
import { useState } from 'react';

// 组件
import Input from '@/components/custom-input';

// 请求
import { api_userSginIn } from '@/api/login';

// 数据校验
import check from './check';
import { setToken } from '@/store/user';



export default () => {



  // #region 登入
  const [ loading, setLoading ] = useState(false);  // 按钮加载动画
  const [ signIn, setSignIn ] = useState({  // 用户信息
    username: '',
    password: '',
  })

  async function submit() {
    const errorArr = check(signIn);

    const error = [...errorArr][0];
    if (error) message.warning(error);
    else {
      setLoading(true);
      const [ err, res ] = await api_userSginIn(signIn);
      if (err) {
        setLoading(false);
        return;
      }

      setToken(res.data.token);
      message.success('登录成功');
      history.length > 2 ? history.goBack() : history.push('/');
      setLoading(false);
    }
  }
  // #endregion



  // #region 公共函数，input 框发生改变
  /**
   * 状态更新
   * @param key 字段名
   * @param e
   */
  function onChange(key: string, e) {
    setSignIn(Object.assign({}, signIn, { [key]: e.target.value }));
  }
  /**
   * 清空内容
   * @param key 字段名
   */
  function onClear(key: string) {
    setSignIn(Object.assign({}, signIn, { [key]: '' }));
  }
  // #endregion



  // #region jsx
  return (<>
    <h1>登入</h1>
    <Input
      value={signIn.username}
      onChange={e => onChange('username', e)}
      onClear={() => onClear('username')}
      className={style.inputItem}
      description='账号'
      focus={true}
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
  // #endregion

}
