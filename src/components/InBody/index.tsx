// npm
import { useEffect, useRef } from "react";



const InBody = ({ children }) => {

  // #region 将元素添加到 body 中
  const inBodyRef = useRef();
  useEffect(() => {
    const ele: HTMLElement = inBodyRef.current;
    document.body.appendChild(ele);

    return () => {
      return ele.remove();
    }
  }, [])
  // #endregion



  // #region jsx
  return (<div ref={inBodyRef} className='yu-in-body'>
    { children }
  </div>)
  // #endregion

}

export default InBody;
