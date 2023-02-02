import { joinClass } from '@/utils/array';
import style from './module.less';

type Props = {
  title:     string
  introduce: string
  codeLink:  string
  example?:  string
}

export default function(props: Props) {
  return (<div className={style.schemeItem}>
    <h2 className={style.title}>{props.title}</h2>
    <p>{props.introduce}</p>
    <div className={style.links}>
      {props.example && <a className={joinClass(style.link, style.example)} href={props.example} target='_blank'>示例</a>}
      <a className={style.link} href={props.codeLink} target='_blank'>源码</a>
    </div>
  </div>)
}
