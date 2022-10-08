import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import conversion from './conversion';
import './index.less';

function CustomCodeHighlight({ code, keywords = null }) {

  const [ html, setHtml ] = useState('');

  useEffect(() => {
    keywords ? setHtml(conversion(code, { keywords })) : setHtml(conversion(code));
  }, [code])

  return (<div className="yu-custom-code-highlight">
    <pre dangerouslySetInnerHTML={{ __html: html || conversion(code) }}></pre>
  </div>)
}

CustomCodeHighlight.propTypes = {
  code: PropTypes.string,
}

export default CustomCodeHighlight;