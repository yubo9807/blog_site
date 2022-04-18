import { useEffect, useState } from 'react';
import { history } from 'umi';
import style from './module.less';
import { scrollTo } from '@/utils/browser';



export default ({ list }) => {

  const [ hash, setHash ] = useState('0');  // 通过监控 hash 滚动到指定位置

  // 查找id，滚动条跳转
  function roll2scrollY(id: string) {
    const ele = document.getElementById(id);
    const top = ele && ele.offsetTop || 0;
    scrollTo(top);
  }

  function jump(id: string) {
    history.replace(`#${id}`);
    setHash(id);
  }

  useEffect(() => {
    setHash(history.location.hash.slice(1) || '0');
    roll2scrollY(hash);

    // 监控 hash 变化
    window.addEventListener('hashchange', () => {
      roll2scrollY(history.location.hash.slice(1) || '0');
    });
  }, [hash]);


  return (<ul className={style.linkList}>
    {list.map((val: any, index: number) => (
      <li
        key={index}
        className={val.tag === 'H1' ? style.title : ''}
        style={{ textIndent: val.tag.slice(1) - 1 + 'em' }}
        onClick={() => jump(val.id)}
      >{val.text}</li>
    ))}
  </ul>);
}

