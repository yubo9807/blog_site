import { connect } from 'react-redux';
import { actions } from '@/store/user';
import { IRouteProps } from 'umi';
import { useEffect, useState } from 'react';
import { Form, Input, Switch, Button, Upload, message } from 'antd';
import style from './module.less';
import { api_uploadPortrait } from '@/api/file';
import env from '~/config/env';
import { getUserInfo } from '@/common/user';

const Setings = (props: IRouteProps) => {
  const [ userInfo, setUserInfo ] = useState({
    name: '',
    mail: '',
    is_receive: false,
    new_password: '******',
    portrait: '',
  })

  useEffect(() => {
    setUserInfo(Object.assign({}, userInfo, props.userInfo));
  }, [props.userInfo])

  const [ disabled, setDisabled ] = useState(true);

  function onChange(key: string, value: any) {
    const obj = Object.assign({}, userInfo, { [key]: value });
    setUserInfo(obj);
  }

  /**
   * 上传头像
   * @param file 文件
   */
  async function uploadPortrait(file: File) {

    const errorArr = [];  // 收集错误
    !file.type.startsWith('image/') && errorArr.push('请上传图片类型文件');
    file.size / 1024 ** 2 > 1 && errorArr.push('图片大小不得超过 1 MB');

    if (errorArr.length > 0) message.warn(errorArr[0]);
    else {
      const response = await api_uploadPortrait(file);
      if (response.code === 200) {
        getUserInfo();
        message.success('上传成功');
      }
    }
  }

  // 编辑
  function editor() {
    if (props.isLogin !== 1) {
      message.warning('未监测到您的信息，请先登录');
      return;
    }
    setDisabled(false);
  }

  return (<div>
    <Form className={style.form} initialValues={userInfo}>
      <Form.Item label='头像'>
        <Upload listType='picture-card' showUploadList={false} beforeUpload={uploadPortrait} disabled={disabled}>
          {userInfo.portrait ? <img src={env.VISIT_ORIGIN + userInfo.portrait} alt={userInfo.name} /> : <i className='iconfont'>&#xe622;</i>}
        </Upload>
      </Form.Item>
      <Form.Item label='昵称：'>
        <Input value={userInfo.name} disabled={disabled} onChange={e => onChange('name', e.target.value)} />
      </Form.Item>
      <Form.Item label='邮箱：'>
        <Input value={userInfo.mail} disabled={disabled} onChange={e => onChange('mail', e.target.value)} />
      </Form.Item>
      <Form.Item label='邮箱是否接收消息'>
        <Switch checked={userInfo.is_receive} disabled={disabled} onChange={checked => onChange('is_receive', checked)} />
      </Form.Item>
      <Form.Item label='重置密码：'>
        <Input value={userInfo.new_password} disabled={disabled} onChange={e => onChange('new_password', e.target.value)} />
      </Form.Item>
    </Form>
    {disabled
      ? <Button onClick={editor}>编辑</Button>
      : <Button type='primary' onClick={() => setDisabled(true)}>锁定</Button>}
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

export default hoc(Setings);