import style from './module.less';

// npm
import { useEffect, useState } from "react";
import { history } from 'umi';

// component
import Setings from "./components/setings";



const SETINGS = 'setings';

export default () => {



  // #region 根据路由 query 参数加载页面
  const [ userType, setUserType ] = useState(SETINGS);
  useEffect(() => {
    const { type } = history.location.query;
    if (!type) history.replace({ query: { type: SETINGS }})
    setUserType(type as string);

    const unlisten = history.listen((location) => {
      const { type } = location.query;
      setUserType(type as string);
    })
    return () => {
      unlisten();
    }
  }, [userType]);
  // #endregion


  
  // #region jsx
  return (<div className={style.userWrap}>
    { userType === SETINGS && <Setings /> }
  </div>)
  // #endregion

}