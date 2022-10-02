// style
import style from './module.less';

// npm
import { Empty } from 'antd';
import { useEffect, useRef } from 'react';

// store
import { connect } from 'react-redux';

// env
import env from '~/config/env';



const Record = ({ recordList = [], userInfo }) => {



  // #region 聊天记录发生变化，滚动条回到最底部
  const recordRef = useRef(null);
  useEffect(() => {
    const ele = recordRef.current;
    ele.scrollTo(0, ele.scrollHeight);
  }, [recordList]);
  // #endregion


  
  // #region jsx
  return (<div className={style.record} ref={recordRef}>
    {recordList.length ? <ul>
      {recordList.map((val, index) => <li key={index} className={val.userName === userInfo.name ? style.oneself : ''}>
        <div className={style.portrait}>
          <img src={env.VISIT_ORIGIN + val.portrait} />
        </div>
        <div className={style.chat}>
          <p className={style.userName}>{val.userName}</p>
          <span className={style.content}>{val.text}</span>
        </div>
      </li>)}
    </ul> : <Empty />}
  </div>);
  // #endregion

}



// #region store
function mapStateToProps(state: any, ownProps: any) {
  const { userInfo } = state.user
  return {
    userInfo,
  }
}

const hoc = connect(mapStateToProps);
// #endregion



export default hoc(Record);
