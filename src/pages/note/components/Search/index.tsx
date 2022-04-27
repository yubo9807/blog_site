import style from './module.less';

// npm
import { useEffect, useState } from 'react';
import { Modal } from 'antd';

// 组件
import Input from '@/components/Input';



export default ({ visible, onCancel = () => {} }) => {

  const [ list, setList ] = useState([]);
  const [ searchValue, setSearchValue ] = useState('');
  const [ focus, setFocus ] = useState(false);

  useEffect(() => {
    if (visible) {
      setFocus(true);
    } else {
      setSearchValue('');
      setList([]);
      setFocus(false);
    }
  }, [visible])

  /**
   * 搜索
   */
  function search() {
    console.log(searchValue);
  }

  return (<Modal className={style.searchModal} visible={visible} closable={false} footer={null} onCancel={onCancel}>
    <Input focus={focus} value={searchValue}
      onChange={e => setSearchValue(e.target.value)}
      onEnter={search}
      onClear={() => setSearchValue('')}
    />
    <ul>
      {list.map(val => <li></li>)}
    </ul>
  </Modal>);
}