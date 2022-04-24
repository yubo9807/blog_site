import style from './module.less';

// npm
import { history, IRouteProps } from 'umi';
import { Input, Modal, Menu } from 'antd';
import { connect } from 'react-redux';

// 组件
import CreateRoom from './CreateRoom';
import Record from './Record';
import Protective from '@/components/Protective';

// 公共函数
import { joinClass } from '@/utils/array';

// 抽离的模块功能
import setup from './setup';


function ChatPage(props: IRouteProps) {
  const state = setup(props);


  // #region jsx
  return (<div className={joinClass(style.chatWrap, 'clearfix')}>

    {/* 侧边栏 */}
    <div className={joinClass(style.side, 'fl')}>
      <span className='iconfont'>&#xe622;</span>
    </div>

    {/* 房间列表 */}
    <ul className={joinClass(style.roomList, 'fl')}>
      <div className={style.search}>
        <Input allowClear prefix={<span className='iconfont'>&#xe64d;</span>} />
        <span className='iconfont' onClick={() => state.setCreateRoomVisible(true)}>&#xe622;</span>
      </div>
      {state.rooms.map(val => <li key={val.id} onClick={() => state.onChangeRoom(val)} onContextMenu={e => state.onContextMenu(e, val)}>
        {val.name}
      </li>)}
    </ul>

    {/* 房间列表右键菜单 */}
    <Protective
      visible={state.roomMenuVisible}
      className={style.roomOperation}
      onClose={() => state.setRoomMenuVisible(false)}
      style={state.roomMenuStyle}
    >
      <Menu>
        <Menu.Item key={0}>修改群名称</Menu.Item>
        <Menu.Item key={1} onClick={state.onDeleteRoom}>删除群聊</Menu.Item>
      </Menu>
    </Protective>

    {/* 内容区 */}
    <div className={joinClass(style.content, 'fl')}>
      <div className={style.header}>
        <h2 className={joinClass('fl', style.roomName)}>{state.selectRow.name}</h2>
        <i className={joinClass('iconfont fr', style.icon)} onClick={() => state.setRoomDetailVisible(true)}>&#xe601;</i>
      </div>
      {/* 聊天记录 */}
      <Record recordList={state.record} />

      {/* 发送消息 */}
      <div className={style.sendWrap}>
        <Input.TextArea value={state.word} onChange={state.onChangeWord} style={{height: '100%'}} bordered={false} onPressEnter={state.enterSend} />
      </div>
    </div>

    <Protective className={style.roomDetailWrap} visible={state.roomDetailVisible} onClose={() => state.setRoomDetailVisible(false)}>
      <div>房间详情</div>
    </Protective>

    {/* 创建房间 */}
    <CreateRoom visible={state.createRoomVisible} users={state.users} onJoinRoom={state.onCreateRoom} onCancel={() => state.setCreateRoomVisible(false)} />

    {/* 提示登录 */}
    <Modal
      visible={state.modalVisible}
      onOk={() => history.push('/login')}
      onCancel={() => state.setModalVisible(false)}
      centered
      okText='确认'
      cancelText='取消'
      width='400px'
    >
      <p>检测到没有您的信息，请前往登录</p>
    </Modal>

  </div>);
  // #endregion

}


// #region store
function mapStateToProps(state: any, ownProps: any) {
  const { userInfo } = state.user
  return {
    userInfo,
  }
}

const hoc = connect(mapStateToProps);
// #endregion



export default hoc(ChatPage);
