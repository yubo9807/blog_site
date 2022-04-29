// style
import style from './module.less';
import 'highlight.js/styles/base16/atlas.css';

// npm
import { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import hljs from 'highlight.js/lib/common';
import PropTypes from 'prop-types';
import React from 'react';
import { history } from 'umi';

// utils
import { scrollTo } from '@/utils/browser';



const Markdown = ({ html, skewing = 0, getLinkList = (arg) => {} }) => {

  const refMd: any = useRef();

  // #region 代码高亮
  useEffect(() => {
    const codeList = refMd.current.querySelectorAll('pre code');
    codeList.forEach((block: any) => {
      hljs.highlightElement(block);
    });
  }, [html]);
  // #endregion



  // #region 需要跳转的标签，添加按钮
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
  // #endregion



  // #region 监控 hash 变化，跳转到指定位置
  useEffect(() => {
    const hash = decodeURI(history.location.hash.slice(1));
    roll2scrollY(hash);

    window.addEventListener('hashchange', () => {
      const hash = decodeURI(history.location.hash.slice(1));
      roll2scrollY(hash);
    });
  }, [])
  // #endregion



  /**
   * 查找id，滚动条跳转
   */
  function roll2scrollY(id: string) {
    history.replace({ hash: `#${id}` });
    const ele = document.getElementById(id);
    const top = ele && ele.offsetTop || 0;
    scrollTo(top - skewing);
  }


  // #region jsx
  return (<div
    ref={refMd}
    className={style.markdown}
    dangerouslySetInnerHTML={{ __html: html }}
  ></div>);
  // #endregion

};

export default Markdown;

Markdown.propTypes = {
  html: PropTypes.string,
  skewing: PropTypes.number,  // 锚链接偏移
};
