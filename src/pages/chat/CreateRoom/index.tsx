import { useEffect, useState } from "react";
import { Input, Button, Modal } from 'antd';
import style from './module.less';
import { joinClass } from "@/utils/array";

export default ({ users = [], visible = false, onCancel = () => {}, onJoinRoom = (joins) => {} }) => {

  const [ list, setList ] = useState([]);  // 用户列表
  const [ joins, setJoins ] = useState([]);  // 加入房间数组

  useEffect(() => {
    if (users.length === 0) return;
    setList(users);
  }, [users]);

  // 搜索过滤
  function search(e) {
    const { value } = e.target;
    const arr = users.filter(val => val.name.includes(value));
    setList(arr);
  }

  // 添加用户
  function addUser(row) {
    const arr = joins.concat([row]);
    setJoins(arr);
  }

  // 删除加入
  function delUser(index: number) {
    const arr = Object.assign([], joins);
    arr.splice(index, 1);
    setJoins(arr);
  }

  return (<Modal visible={visible} onCancel={onCancel}>
    <div className={style.wrap}>
      <div className={style.header}>
        <ul className={joinClass(style.jions, 'clearfix')}>
          {joins.map((val, index) => <li key={index}>
            <div>{val.name}</div>
            <span onClick={() => delUser(index)}>-</span>
          </li>)}
        </ul>
        <div className="search">
          <Input onChange={search} />
        </div>
      </div>
      <ul className={style.userList}>
        {list.map((val, index) => <li key={index} onClick={() => addUser(val)}>
          <span className={style.portrait}>{val.portrait}</span>
          <span className={style.name}>{val.name}</span>
        </li>)
      }</ul>
      <Button onClick={() => onJoinRoom(joins)}>确定</Button>
    </div>
  </Modal>);
}