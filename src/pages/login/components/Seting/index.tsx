import { connect } from 'react-redux';
import { actions } from '@/store/user';
import { IRouteProps } from 'umi';
import { useEffect, useState } from 'react';
import { Form, Input, Switch, Button } from 'antd';
import { getCookie } from '@/utils/browser';
import { api_getUserInfo } from '@/api/login';

const Seting = (props: IRouteProps) => {
  const { userInfo, isLogin } = props

  useEffect(() => {
    if (isLogin) return;
    getUserInfo();
  }, [isLogin])

  // 获取用户信息
  async function getUserInfo() {
    const token = await getCookie('token');
    if (token) {
      const response: any = await api_getUserInfo({ token });
      if (response.code === 200) {
        // 用户验证成功
        props.onSignInAction();
        props.onSetUserinfoAction(response.data);
      }
    }
  }

  const [ disabled, setDisabled ] = useState(true);
  function onFinish(values: any) {
    console.log('values :>> ', values);
  }

  return (<div>
    <Form onFinish={onFinish} initialValues={userInfo}>
      <Form.Item label='昵称：' name='name'>
        <Input value={userInfo.name} disabled={disabled} />
      </Form.Item>
      <Form.Item label='邮箱：' name='mail'>
        <Input value={userInfo.mail} disabled={disabled} />
      </Form.Item>
      <Form.Item label='邮箱接收消息'>
        <Switch checked={userInfo.is_receive} />
      </Form.Item>
      <Form.Item>
        {disabled
          ? <Button htmlType='button' onClick={() => setDisabled(false)}>编辑</Button>
          : <Button type='primary' htmlType='submit'>确认</Button>}
      </Form.Item>
    </Form>
  </div>)
}

function mapStateToProps(state: any) {
  const { isLogin, userInfo } = state.user
  return {
    isLogin,
    userInfo,
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    onSignInAction() {
      dispatch(actions.signInAction());
    },
    onSetUserinfoAction(userInfo) {
      dispatch(actions.setUserinfoAction(userInfo))
    },
    onSignOutAction() {
      dispatch(actions.signOutAction());
    },
  }
}

const hoc = connect(mapStateToProps, mapDispatchToProps);

export default hoc(Seting);