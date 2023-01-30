import './index.less';
import { history } from 'umi';
import { scrollTo } from '@/utils/browser';
import { useEffect } from 'react';

function roll2scrollY(id: string) {
  history.replace({ hash: `#${id}` });
  const ele = document.getElementById(id);
  const top = ele && ele.offsetTop || 0;
  scrollTo(top - 50);
}

export default ({ text }) => {

  useEffect(() => {
    roll2scrollY(decodeURI(history.location.hash.slice(1)));
  }, [])

  return <div className='yu-title-level'>
    <h2 id={text}>
      {text}
      <a onClick={() => roll2scrollY(text)}>#</a>
    </h2>
  </div>
}