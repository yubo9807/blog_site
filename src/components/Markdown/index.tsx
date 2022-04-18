import { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import style from './module.less';
import hljs from 'highlight.js/lib/common';
import PropTypes from 'prop-types';
import 'highlight.js/styles/base16/atlas.css';
import React from 'react';
import { scrollTo } from '@/utils/browser';
import { history } from 'umi';


const Markdown = ({ html, getLinkList = (arg) => {} }) => {

  const refMd: any = useRef();

  // 代码高亮
  useEffect(() => {
    const codeList = refMd.current.querySelectorAll('pre code');
    codeList.forEach((block: any) => {
      hljs.highlightElement(block);
    });
  }, [html]);

  // 需要跳转的标签
  useEffect(() => {
    const ele = refMd.current;
    const arr = [];
    ele.children.forEach((val: HTMLElement) => {
      if (['H2', 'H3', 'H4'].includes(val.tagName)) {

        const I = () => <i className='iconfont' onClick={() => 
          roll2scrollY(val.id)
        }>&#xe617;</i>;
        const span = document.createElement('span');
        ReactDOM.render(React.createElement(I), span);
        val.appendChild(span);
        arr.push({ tag: val.tagName, text: val.innerText, id: val.id });
      }
    })
    getLinkList(arr);
  }, [html]);

  useEffect(() => {
    const hash = decodeURI(history.location.hash.slice(1));
    roll2scrollY(hash);

    // 监控 hash 变化
    window.addEventListener('hashchange', () => {
      const hash = decodeURI(history.location.hash.slice(1));
      roll2scrollY(hash);
    });
  }, [])

  // 查找id，滚动条跳转
  function roll2scrollY(id: string) {
    history.replace({ hash: `#${id}` });
    const ele = document.getElementById(id);
    const top = ele && ele.offsetTop || 0;
    scrollTo(top - 44);
  }


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
