import { useRef, useEffect } from 'react';
import style from './module.less';
import hljs from 'highlight.js/lib/common';
import PropTypes from 'prop-types';
import 'highlight.js/styles/base16/atlas.css';

const Markdown = ({ html }) => {
  const refMd: any = useRef();

  useEffect(() => {
    // 代码高亮
    const codeList = refMd.current.querySelectorAll('pre code');
    codeList.forEach((block: any) => {
      hljs.highlightElement(block);
    });
  }, [html]);

  return (
    <div
      ref={refMd}
      className={style.markdown}
      dangerouslySetInnerHTML={{ __html: html }}
    ></div>
  );
};

export default Markdown;

Markdown.propTypes = {
  html: PropTypes.string,
};
