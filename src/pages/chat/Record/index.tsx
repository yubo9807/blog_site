import { Empty } from 'antd';
import style from './module.less';

export default ({ recordList = [] }) => {
  
  return (<div className={style.record}>
    {recordList.length ? <ul>{recordList.map((val, index) => <li key={index}>
      <div>
        <span>{val.userName}</span>
      </div>
      <div>
        <span className="time">{val.time}</span>
        <span className="time">{val.text}</span>
      </div>
    </li>)}</ul> : <Empty />}
  </div>);
}