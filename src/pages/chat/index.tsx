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
import init from './init';
import operationWord from './operation-word';
import operationRoom from './operation-room';
import operationPopup from './operation-popup';



function ChatPage(props: IRouteProps) {
  const state = init(props);
  
  // 发送消息
  const { word, onChangeWord, enterSend } = operationWord(state);

  // 菜单控制
  const {
    roomMenuVisible,
    setRoomMenuVisible,
    roomMenuStyle,
    onContextMenu,
    createRoomVisible,
    setCreateRoomVisible,
    roomDetailVisible,
    setRoomDetailVisible,
  } = operationPopup(state);

  // 创建/加入/删除... 房间
  (state as any).setRoomMenuVisible = setRoomMenuVisible;
  const { onChangeRoom, onCreateRoom, onDeleteRoom } = operationRoom(state);



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
        <span className='iconfont' onClick={() => setCreateRoomVisible(true)}>&#xe622;</span>
      </div>
      {state.rooms.map(val => <li key={val.id} onClick={() => onChangeRoom(val)} onContextMenu={e => onContextMenu(e, val)}>
        {val.name}
      </li>)}
    </ul>

    {/* 房间列表右键菜单 */}
    <Protective
      visible={roomMenuVisible}
      className={style.roomOperation}
      onClose={() => setRoomMenuVisible(false)}
      style={roomMenuStyle}
    >
      <Menu>
        <Menu.Item key={0}>修改群名称</Menu.Item>
        <Menu.Item key={1} onClick={onDeleteRoom}>删除群聊</Menu.Item>
      </Menu>
    </Protective>

    {/* 内容区 */}
    <div className={joinClass(style.content, 'fl')}>
      <div className={style.header}>
        <h2 className={joinClass('fl', style.roomName)}>{state.selectRow.name}</h2>
        <i className={joinClass('iconfont fr', style.icon)} onClick={() => setRoomDetailVisible(true)}>&#xe601;</i>
      </div>
      {/* 聊天记录 */}
      <Record recordList={state.record} />

      {/* 发送消息 */}
      <div className={style.sendWrap}>
        <Input.TextArea value={word} onChange={onChangeWord} style={{height: '100%'}} bordered={false} onPressEnter={enterSend} />
      </div>
    </div>

    <Protective className={style.roomDetailWrap} visible={roomDetailVisible} onClose={() => setRoomDetailVisible(false)}>
      <div>房间详情</div>
    </Protective>

    {/* 创建房间 */}
    <CreateRoom visible={createRoomVisible} users={state.users} onJoinRoom={onCreateRoom} onCancel={() => setCreateRoomVisible(false)} />

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
