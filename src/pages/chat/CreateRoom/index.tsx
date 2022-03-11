import { useEffect, useState } from "react";
import { Input, Button, Modal, Checkbox } from 'antd';
import style from './module.less';
import { joinClass } from "@/utils/array";

export default ({ users = [], visible = false, onCancel = () => {}, onJoinRoom = (joins) => {} }) => {

  const [ list, setList ] = useState([]);  // 用户列表
  const [ selectList, setSelectList ] = useState([]);  // 选择的用户

  useEffect(() => {
    if (users.length > 0) setList(users);
  }, [users]);

  const [ searchValue, setSearchValue ] = useState('');

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

  return (<Modal className={style.modal} visible={visible} width='400px' footer={null} onCancel={onCancel}>
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
      <ul className={style.userList}>
        {list.map((val, index) => <li key={index}>
          <Checkbox checked={val.checked} onChange={(e) => selectUser(e, val)}>
            <span className={style.portrait}>{val.portrait}</span>
            <span className={style.name}>{val.name}</span>
          </Checkbox>
        </li>)
      }</ul>
      <div className={style.btn}>
        <Button type='primary' onClick={() => onJoinRoom(selectList)}>确定</Button>
      </div>
  </Modal>);
}
