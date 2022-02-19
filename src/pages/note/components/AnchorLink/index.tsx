import { load } from 'cheerio';
import { IRouteProps, history } from 'umi';
import PropTypes from 'prop-types';
import style from './module.less';
import { scrollTo } from '@/utils/browser';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
const { ['log']: c } = console;

const LinksList = ({ html, scrollY }: IRouteProps) => {
  const arr = searchTitleList(html);

  const [ hash, setHash ] = useState('0');  // 通过监控 hash 滚动到指定位置
  const [ fixed, setFixed ] = useState(false);

  useEffect(() => {
    setHash(history.location.hash.slice(1) || '0');
    roll2scrollY(hash);

    // 监控 hash 变化
    window.addEventListener('hashchange', () => {
      roll2scrollY(history.location.hash.slice(1) || '0');
    });
  }, [hash]);
  
  function jump(id: string) {
    history.replace(`#${id}`);
    setHash(id);
  }
  
  useEffect(() => {
    if (scrollY > 136) setFixed(true);
    else setFixed(false);
  }, [scrollY]);

  return (<div className={fixed ? style.fixed : ''}>
    <ul className={style.linkList}>
      {arr.map((val: any, index: number) => (
        <li
          key={index}
          className={val.level === 'h1' ? style.title : ''}
          style={{ textIndent: val.level.slice(1) - 1 + 'em' }}
          onClick={() => jump(val.id)}
        >{val.text}</li>
      ))}
    </ul>
  </div>);
};

function mapStateToProps(state: any, ownProps: any) {
  return {
    scrollY: state.scroll.scrollY
  }
}

const hoc = connect(mapStateToProps);

export default hoc(LinksList);


// 查找id，滚动条跳转
function roll2scrollY(id: string) {
  const top = document.getElementById(id)?.offsetTop || 0;
  scrollTo(top - 90);
}

function searchTitleList(html: string) {
  const $ = load(html);
  const arr = Array.from($('h1,h2,h3,h4'));
  const newArr: any[] = [];
  arr.forEach((val: any) => {
    const id = val.attribs.id;
    const text = val.children[0].data;
    const level = val.name;
    // const offsetTop = document.getElementById(id)?.offsetTop;
    newArr.push({ id, text, level });
  });
  return newArr;
}

LinksList.propTypes = {
  html: PropTypes.string,
};
