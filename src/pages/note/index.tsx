import { useEffect, useState } from 'react';
import { IRouteProps } from 'umi';

// redux
import { connect } from 'react-redux';
import { actions } from '@/store/fixed-btns';

// 样式
import style from './module.less';

// 请求
import { api_getFileContentOrChildDirectory } from '@/api/file';

// 公共函数
import { isType } from '@/utils/validate';
import { joinClass } from '@/utils/array';
import { dateFormater } from '@/utils/date';

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


  // #region 手机端菜单按钮控制
  const [ phoneMenuVisible, setPhoneMenuVisible ] = useState(false);
  useEffect(() => {
    const listKey = 'note_fileList';
    props.clientWidth < 768 && props.onAddFixedBtn(listKey, <i
      className='iconfont'
      onClick={() => setPhoneMenuVisible(!phoneMenuVisible)}
    >&#xe603;</i>, 6);

    return () => {
      props.onDelFixedBtn(listKey);
    }
  }, [phoneMenuVisible, props.clientWidth])
  // #endregion


  // #region 文件大纲按钮
  useEffect(() => {
    const outlineKey = 'note_outline';
    props.onAddFixedBtn(outlineKey, <i className='iconfont'>&#xe618;</i>, 5)

    return () => {
      props.onDelFixedBtn(outlineKey);
    }
  }, [])
  // #endregion


  return (<div className={joinClass(style.container, 'leayer clearfix')}>
    {data && <>

      {/* 面包屑 */}
      <div className={style.breadCrumb}>
        <Breadcrumb filename={data.filename} route={route} />
      </div>

      {/* 文件目录 */}
      <div className={joinClass(style.side, data.fileAttr.content ? '' : style.grid, phoneMenuVisible ? style.active : '' )}
        onClick={() => setPhoneMenuVisible(false)}
      >
        <FileDirectory fileDirectory={data.fileDirectory} />
      </div>
      

      {/* 内容 */}
      {data.fileAttr.content && <div className={style.content}>

        {/* 文件信息 */}
        <p className={style.fileInfo}>
          <span>{dateFormater('YYYY/MM/DD', data.fileAttr.createTime * 1000)}</span>
          <span>{data.fileAttr.size}字符</span>
        </p>

        {/* 文件内容 */}
        {isRender
          ? <Markdown html={data.fileAttr.content} skewing={90}/>
          : <div dangerouslySetInnerHTML={{ __html: data.fileAttr.content }} ></div>
        }

      </div>}
    </>}
  </div>)
}

NotePage.getInitialProps = async({ history, path }) => {
  const { pathname } = history.location;
  const piecewise = pathname.split('/');
  const filename = (pathname.startsWith('http') ? piecewise.slice(4) : piecewise.slice(2)).join('/');
  
  const { fileDirectory, fileAttr } = await getFileChildDirectoryAndContent(filename, path);

  return {
    data: {
      fileDirectory,
      fileAttr,
      filename,
    }
  }
}

function mapStateToProps(state: any, ownProps: any) {
  return {
    scrollY: state.scroll.scrollY,
    clientWidth: state.scroll.clientWidth,
    btns: state.fixedBtns,
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    onAddFixedBtn(key, element, count) {
      dispatch(actions.addFixedBtn(key, element, count));
    },
    onDelFixedBtn(key) {
      dispatch(actions.delFixedBtn(key));
    }
  }
}

const hoc = connect(mapStateToProps, mapDispatchToProps);

export default hoc(NotePage);




/**
 * 获取文件子目录和内容
 * @param filename
 * @returns 
 */
async function getFileChildDirectoryAndContent(filename: string = '', path: string) {
  let fileDirectory = [], fileAttr: any = {};

  const response = await api_getFileContentOrChildDirectory(`/note/${filename}`);
  if (response.code !== 200) {
    fileAttr.content = response.msg;
    return {
      fileDirectory,
      fileAttr,
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
      return { fileDirectory, fileAttr };
    }

    // 获取子目录下第一个文件的内容
    const response = await api_getFileContentOrChildDirectory(`/note/${filename}/${fileList[0].name}`);
    if (response.code === 200) fileAttr = response.data;
    else fileAttr.content = response.msg;
  } else if (isType(data) === 'object') {  // 如果是文件内容
    fileAttr = data;

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
    fileAttr,
  }

}