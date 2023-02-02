import style from './module.less';

type Props = {
  title:     string
  introduce: string
  link:      string
}

export default function(props: Props) {
  return (<div className={style.skillItem}>
    <h2 className={style.title}>
      <a href={props.link} target='_blank'>{props.title}</a>
    </h2>
    <p>{props.introduce}</p>
  </div>)
}
