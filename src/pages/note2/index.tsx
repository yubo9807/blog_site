import { api_getNoteFile, api_getNoteLabel } from '@/api/note';
import { useEffect, useState } from 'react';
import MarkdownIt from 'markdown-it';
import Header from './components/Header';
import NavTabs from './components/NavTabs';
import SideList from './components/SideList';
import Markdown from '@/components/Markdown/async';
import AnchorLink from './components/AnchorLink/async';
import style from './module.less';
import { deepCloneObj } from '@/utils/object';
import { createNum } from '@/utils/number';
import { pathNameSplit } from '@/utils/browser';
import Helmet from './components/Helmet';

const md = MarkdownIt();

const NotePage = ({ data, route }) => {
  const basePath = route.path;

  const html = data && md.render(data.text) || '';

  const iter = createNum();
  const titleReg = /^\<h\d/g; // 标题匹配
  let newHTML = '';
  html.split(/\n/).forEach((val: string) => {
    // h 标签添加 id
    if (titleReg.test(val)) {
      const strStart = val.slice(0, 3);
      val = val.replace(titleReg, `${strStart} id='${iter.next().value}'`);
    }
    /\>$/.test(val) ? (newHTML += val) : (newHTML += val + '\n');
  });

  // 有些元素不想在服务端渲染
  const [ isRender, setIsRender ] = useState(false);
  useEffect(() => {
    setIsRender(true);
  }, [isRender])

  const [ showSide, setShowSide ] = useState(false);

  return (<div>
    {data && <>
      <Helmet html={html} data={data} />
      {isRender && <Header crumb={data.crumb} path={basePath} />}
      <NavTabs navList={data.label} path={basePath + '/'} />
      <div className='leayer clearfix'>
        <div className={style.slid}>
          <SideList list={data.fileList} show={showSide} />
        </div>
        <div className={style.content}>
          {isRender ? <Markdown html={newHTML} /> : <div dangerouslySetInnerHTML={{ __html: html }}></div>}
        </div>
        <div className={style.anchor}>
          {isRender && <AnchorLink html={newHTML}/>}
        </div>
      </div>
    </>}
    <div className={style.mobileBtn}>
      <i className='iconfont' onClick={() => void setShowSide(!showSide)}>111</i>
      <i className='iconfont'>222</i>
    </div>
  </div>)
}

let label = [];
NotePage.getInitialProps = async({ history, path }) => {
  const pathArr = pathNameSplit(history.location.pathname.split(path + '/')[1]);
  let text = '', fileList = [], crumb = [];

  if (label.length === 0) {
    const response: any = await api_getNoteLabel();
    if (response.code == 200) label = response.data;
  }

  const arr = getAssignData(label, pathArr);  // 递归数组过滤
  crumb = getBreadcrumb(arr[0]);  // 面包屑
  fileList = getLastFileList(arr);  // 数组最后的文件列表
  const url = getFilenameUrl(arr, pathArr);  // 指定文件路径
  const file: any = await api_getNoteFile(escape(url));
  if (file.code === 200) text = file.data;
  
  return Promise.resolve({
    data: {
      label,
      text,
      fileList,
      crumb,
    }
  })
  
};

export default NotePage;

/**
 * 根据路由获取文件的路径
 * @param arr
 * @returns
 */
function getFilenameUrl(arr: any[], pathArr: string[], url: string = ''): string {
  if (!arr || !pathArr) return 'undefined';
  const value = arr[0];
  const str = pathArr[pathArr.length - 1] + ' ';
  if (typeof value === 'object') {
    url += `${value.id} ${value.folder === value.link ? '' : value.folder + '_'}${value.link}/`;
    return getFilenameUrl(value.files, pathArr, url); // 递归
  } else if (typeof value === 'string') {
    if (!Number(str)) return (url += arr[0]);
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].startsWith(str)) {
        url += arr[i];
        break;
      }
    }
  }
  return url;
}

/**
 * 获取最后的文件列表
 * @param arr 递归数组
 * @returns
 */
function getLastFileList(arr: any[], fileList: string[] = []): any {
  if (arr.length === 0) return;
  if (typeof arr[0] === 'string') return (fileList = arr);
  return getLastFileList(arr[0].files, fileList);
}

/**
 * 数组深度过滤（具有一定规则，可递归）
 * @param data
 * @param words
 * @returns
 */
function getAssignData(data: any[], words: string[], count = 0, arr: any[] = []) {
  // const len = words.length - 1;
  if (!data || !words) return arr;
  for (let i = 0; i < data.length; i++) {
    if (typeof data[i] === 'object' && data[i].link === words[count]) {
      arr[0] = deepCloneObj(data[i]);
      arr.length = 1;
      count++;
      arr[0].files && getAssignData(arr[0].files, words, count, arr[0].files);
      break;
    }
  }
  return arr;
}

/**
 * 递归获取面包屑
 * @param obj 
 * @param crumb 
 * @returns 
 */
function getBreadcrumb(obj: any, crumb: any[] = []) {
  if (typeof obj === 'object') {
    const { files, link, ...args } = obj;
    let fromLink = '';
    if (crumb.length > 0) {
      const lastCrumb = crumb[crumb.length - 1];
      fromLink = lastCrumb.link;
    }

    crumb.push({...args, link: fromLink + '/' + link});
    getBreadcrumb(files[0], crumb);
  }
  return crumb;
}