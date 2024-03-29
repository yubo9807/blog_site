// style
import style from './module.less';

// npm
import { useEffect, useState } from "react";
import { Input, Button, Modal, Checkbox } from 'antd';
import PropTypes from 'prop-types';

// utils
import { joinClass } from "@/utils/array";

// env
import env from "~/config/env";



const CreateRoom = ({ users, visible = false, onCancel = () => {}, onJoinRoom = (joins) => {} }) => {

  const [ list, setList ] = useState([]);  // 用户列表
  const [ selectList, setSelectList ] = useState([]);  // 选择的用户
  const [ searchValue, setSearchValue ] = useState('');  // 搜索条件
  
  useEffect(() => {
    if (users.length > 0) setList(users);
  }, [users]);

  // 搜索过滤
  useEffect(() => {
    const arr = users.filter(val => val.name.includes(searchValue.trim()));
    setList(arr);
  }, [searchValue]);

  // 删除所选择的用户
  function delSelectUser(e) {
    const { target, keyCode } = e;
    if (target.value === '' && keyCode === 8) {
      const lastIndex = selectList.length - 1;
      if (lastIndex < 0) return;
      const arr = Object.assign([], selectList);
      arr[lastIndex].checked = false;
      arr.pop();
      setSelectList(arr);
    }
  }

  // 选择用户
  function selectUser(e, row) {
    const { checked } = e.target;
    if (checked) {
      row.checked = true;
      const arr = selectList.concat([row]);
      setSelectList(arr);
      setSearchValue('');
    } else {
      const arr = Object.assign([], selectList);
      const index = arr.findIndex(val => val.name === row.name);
      arr[index].checked = false;
      arr.splice(index, 1);
      setSelectList(arr);
    }
  }


  return (<Modal className={style.modal} open={visible} width='400px' footer={null} onCancel={onCancel}>

      {/* 筛选后的用户 */}
      <div className={style.header}>
        <div className={joinClass(style.jions, 'clearfix')} style={{width: selectList.length * 30 + 'px'}}>
          <ul className='clearfix' style={{width: selectList.length * 30 + 'px'}}>
            {selectList.map((val, index) => <li key={index}>
              <div>{val.name}</div>
            </li>)}
          </ul>
        </div>
        <div className={style.search} style={{width: `calc(100% - ${selectList.length * 30}px)`}}>
          <Input value={searchValue} placeholder='搜索' bordered={false} onChange={e => setSearchValue(e.target.value)} onKeyDown={delSelectUser} />
        </div>
      </div>

      {/* 用户列表 */}
      <ul className={style.userList}>
        {list.map((val, index) => <li key={index}>
          <Checkbox checked={val.checked} onChange={(e) => selectUser(e, val)}>
            <span className={style.portrait}>
              <img src={env.VISIT_ORIGIN + val.portrait} alt="" />
            </span>
            <span className={style.name}>{val.name}</span>
          </Checkbox>
        </li>)
      }</ul>

      {/* 提交 */}
      <div className={style.btn}>
        <Button type='primary' onClick={() => onJoinRoom(selectList)}>创建房间</Button>
      </div>

  </Modal>);
}

CreateRoom.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
  })),
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
  onJoinRoom: PropTypes.func,
}

export default CreateRoom;
