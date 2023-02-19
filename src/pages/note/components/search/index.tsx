import style from './module.less';

// npm
import { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { Link } from 'umi';

// component
import Input from '@/components/custom-input';

// api
import { api_fileContentSearch } from '@/api/file';

// utils
import { joinClass } from '@/utils/array';



export default ({ visible, onCancel = () => {} }) => {

  const [ list, setList ] = useState([]);
  const [ searchValue, setSearchValue ] = useState('');
  const [ focus, setFocus ] = useState(false);

  const [ emptyPrompt, setEmptyPrompt ] = useState(false);

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
  async function search() {
    if (searchValue === '') return;
    const [ err, res ] = await api_fileContentSearch('/note', searchValue);
    if (err) return;

    setEmptyPrompt(false);
    const { data } = res;
    data.length === 0 && setEmptyPrompt(true);
    setList(res.data);
  }

  /**
   * 清空搜索框
   */
  function clear() {
    setSearchValue('');
    setEmptyPrompt(false);
    setList([]);
  }

  /**
   * 格式化路径
   */
  function formatPath(path: string) {
    let str = '';
    path.replace('/note', '').split('/').forEach((val) => {
      str += /\..+$/.test(val) ? val : val && val.match(/\s.+/)[0].slice(1) + ' / ';
    });
    return str;
  }

  return (<Modal className={style.searchModal} visible={visible} closable={false} footer={null} onCancel={onCancel}>
    <Input focus={focus} value={searchValue}
      onChange={e => setSearchValue(e.target.value)}
      onEnter={search}
      onClear={clear}
    />
    <ul className={style.list} onClick={onCancel}>
      {list.map((val, index) => <li key={index}>
        <Link to={val.path+`?search=${searchValue}`}>
          <strong className={style.title}>{formatPath(val.path)}</strong>
          <p className={style.content}>{val.content}</p>
          <p className={style.mark}>
            <span>byte {val.size}</span>
            <span>{val.createTime}</span>
          </p>
        </Link>
      </li>)}
    </ul>
    <p className={joinClass(style.empty, emptyPrompt ? '' : style.hidden)}>未找到任何内容</p>
  </Modal>);
}