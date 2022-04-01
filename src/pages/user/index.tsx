import { useEffect, useState } from "react";
import { history } from 'umi';
import Setings from "./components/Setings";
import style from './module.less';

const SETINGS = 'setings';

export default () => {

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

  return (<div className={style.userWrap}>
    { userType === SETINGS && <Setings /> }
  </div>)
}