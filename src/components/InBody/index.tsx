import { useEffect, useRef } from "react";

const InBody = ({ children }) => {

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

export default InBody;