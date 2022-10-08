import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import hljs from 'highlight.js/lib/common';
import 'highlight.js/styles/base16/atlas.css';
import './index.less'


function CodeHighlight({ code }) {

  const el = useRef();
  useEffect(() => {
    hljs.highlightElement(el.current);
  }, [])

  return (<div className='yu-code-highlight'>
    <pre>
      <code ref={el}>{code}</code>
    </pre>
  </div>)
}

CodeHighlight.propTypes = {
  code: PropTypes.string,
}

export default CodeHighlight;