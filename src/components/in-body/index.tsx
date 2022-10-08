// npm
import { useEffect, useRef } from "react";


/**
 * 将元素放在 body 中
 * @returns 
 */
export default function({ children }) {

  const inBodyRef = useRef();
  useEffect(() => {
    const ele: HTMLElement = inBodyRef.current;
    document.body.appendChild(ele);

    return () => {
      return ele.remove();
    }
  }, [])


  return (<div ref={inBodyRef} className='yu-in-body'>
    { children }
  </div>)

}
