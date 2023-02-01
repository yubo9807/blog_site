// styles
import style from './module.less';

// npm
import { history } from 'umi';
import { Dropdown } from 'antd';
import { useEffect } from 'react';

// utils
import { joinClass } from '@/utils/array';
import { scrollTo } from '@/utils/browser';



type Props = {
  text:     string
  overlay?: JSX.Element
}

export default (props: Props) => {

  useEffect(() => {
    const id = history.location.hash.slice(1);
    id && roll2scrollY(decodeURI(id));
  }, [])

  return <div className={style.titleLevel}>
    <h2 id={props.text}>
      {props.text}
    </h2>
    {props.overlay && <Dropdown overlay={props.overlay}>
      <i className={joinClass('iconfont', style.icon)}>&#xe626;</i>
    </Dropdown>}
    <i className={joinClass('iconfont', style.icon, style.link)} onClick={() => roll2scrollY(props.text)}>&#xe617;</i>
  </div>
}

function roll2scrollY(id: string) {
  history.replace({ hash: `#${id}` });
  const ele = document.getElementById(id);
  const top = ele && ele.offsetTop || 0;
  scrollTo(top - 50);
}