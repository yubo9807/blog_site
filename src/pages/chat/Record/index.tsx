import { Empty } from 'antd';
import style from './module.less';

export default ({ recordList = [] }) => {
  
  return (<div className={style.record}>
    {recordList.length ? <ul>
      {recordList.map((val, index) => <li key={index} className={val.userName === 'test' ? style.oneself : ''}>
        <div className={style.portrait}>{val.portrait}</div>
        <div className={style.chat}>
          <p className={style.userName}>{val.userName}</p>
          <span className={style.content}>{val.text}</span>
        </div>
      </li>)}
    </ul> : <Empty />}
  </div>);
}