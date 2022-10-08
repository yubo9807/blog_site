import store from "@/store";
import { useEffect, useRef, useState } from "react"
import { connect } from "react-redux";
import PropTypes from 'prop-types';


function IntoViewport({
  children,
  scroll = (scrollX: number, scrollY: number) => {},

  onIn = () => {},  // 进入视口
  onInAbout = () => {},  // 从上面进入
  onInBelow = () => {},  // 从下面进入

  onOut = () => {},  // 退出
  onOutAbout = () => {},  // 从上面退出
  onOutBelow = () => {},  // 从下面退出

}) {

  const ref = useRef();
  let el: Element = null;

  const [ outRecord, setOutRecord ] = useState(0);
  const [ inLock, setInLock ] = useState(false);
  
  const [ inRecord, setInRecord ] = useState(0);
  const [ outLock, setOutLock ] = useState(false);

  useEffect(() => {
    !el && (el = ref.current);
    const { clientTop, clientHeight } = document.documentElement;
    const { top, height } = el.getBoundingClientRect();
    const bottom = top + height;

    if ((top > clientTop && top < clientHeight) || (bottom < clientHeight && bottom > clientTop)) {
      // scroll(0, store.getState().viewport.scrollY);
      setInRecord(top);
      setOutLock(false);
      
      if (inLock) return;
      if (outRecord === 0) {
        onIn();
      } else if (outRecord > 0) {
        onIn();
        onInAbout();
      } else {
        onIn();
        onInBelow();
      }
      setInLock(true);
    } else {
      setOutRecord(top);
      setInLock(false);

      if (outLock || inRecord === 0) return;
      if (inRecord > 0) {
        onOut();
        onOutBelow();
      } else {
        onOut();
        onOutAbout();
      }
      setOutLock(true);
    }
  }, [store.getState().viewport.scrollY])


  return (<div ref={ref}>
    {children}
  </div>)
}

IntoViewport.propTypes = {
  scroll: PropTypes.func
}

const hoc = connect(() => store.getState());
export default hoc(IntoViewport);