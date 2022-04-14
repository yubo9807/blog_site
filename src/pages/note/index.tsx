import { useEffect, useState } from 'react';
import { IRouteProps } from 'umi';

import style from './module.less';

// 请求
import { api_getFileContentOrChildDirectory } from '@/api/file';

// 公共函数
import { isType } from '@/utils/validate';
import { joinClass } from '@/utils/array';

// 组件
import Breadcrumb from './components/Breadcrumb';
import FileDirectory from './components/FileDirectory';
import Markdown from '@/components/Markdown/async';


const NotePage = (props: IRouteProps) => {
  const { data, route } = props;

  const [ isRender, setIsRender ] = useState(false);
  useEffect(() => {
    setIsRender(true);
  }, [])

  return (<div className={joinClass(style.container, 'leayer clearfix')}>
    {data && <>

      {/* 面包屑 */}
      <div className={style.breadCrumb}>
        <Breadcrumb filename={data.filename} route={route} />
      </div>

      {/* 文件目录 */}
      <div className={joinClass(style.side, data.fileContent ? '' : style.grid)}>
        <FileDirectory fileDirectory={data.fileDirectory} />
      </div>

      {/* 内容 */}
      <div className={style.content}>
        {isRender
          ? <Markdown html={data.fileContent} />
          : <div dangerouslySetInnerHTML={{ __html: data.fileContent }} ></div>
        }
      </div>

    </>}
  </div>)
}

NotePage.getInitialProps = async({ history, path }) => {
  const { pathname } = history.location;
  const piecewise = pathname.split('/');
  const filename = (pathname.startsWith('http') ? piecewise.slice(4) : piecewise.slice(2)).join('/');
  
  const { fileDirectory, fileContent } = await getFileChildDirectoryAndContent(filename, path);

  return {
    data: {
      fileDirectory,
      fileContent,
      filename,
    }
  }
}

export default NotePage;




/**
 * 获取文件子目录和内容
 * @param filename
 * @returns 
 */
async function getFileChildDirectoryAndContent(filename: string = '', path: string) {
  let fileDirectory = [], fileContent = '';

  const response = await api_getFileContentOrChildDirectory(`/note/${filename}`);
  if (response.code !== 200) {
    fileContent = response.msg;
    return {
      fileDirectory,
      fileContent,
    }
  }
  const { data } = response;
  // 如果是文件目录
  if (isType(data) === 'array') {
    const folderList = [], fileList = [];
    data.forEach(val => {
      val.path = val.path.replace('/note', path)
      val.isFile ? fileList.push(val) : folderList.push(val)
    });
    fileDirectory = [].concat(folderList, fileList);

    if (fileList.length === 0) {
      return { fileDirectory, fileContent };
    }

    // 获取子目录下第一个文件的内容
    const response = await api_getFileContentOrChildDirectory(`/note/${filename}/${fileList[0].name}`);
    if (response.code === 200) fileContent = response.data;
    else fileContent = response.msg;
  } else if (isType(data) === 'string') {  // 如果是文件内容
    fileContent = data;

    // 获取上一级文件目录
    const piecewise = filename.split('/');
    const foldername = piecewise.slice(0, piecewise.length - 1).join('/');
    const response = await api_getFileContentOrChildDirectory(`/note/${foldername}`);
    if (response.code === 200) {
      const { data } = response;

      const folderList = [], fileList = [];
      data.forEach(val => {
        val.path = val.path.replace('/note', path)
        val.isFile ? fileList.push(val) : folderList.push(val)
      });
      fileDirectory = [].concat(folderList, fileList);
    }
    
  }

  return {
    fileDirectory,
    fileContent,
  }

}