// style
import style from './module.less';

// npm
import { useEffect, useState } from 'react';
import { IRouteProps, history } from 'umi';

// redux
import { connect } from 'react-redux';
import store from '@/store';
import { actions as actionsFixedBtns } from '@/store/fixed-btns';

// api
import { api_getFileContentOrChildDirectory } from '@/api/file';

// utils
import { isType } from '@/utils/validate';
import { joinClass } from '@/utils/array';
import { dateFormater } from '@/utils/date';
import { scrollTo } from '@/utils/browser';
import { createColor } from '@/utils/string';

// component
import Breadcrumb from './components/breadcrumb';
import FileDirectory from './components/file-directory';
import Search from './components/search';
import Helmet from './components/helmet';
import Markdown from '@/components/markdown/async';



const NotePage = (props: IRouteProps) => {
  const { data } = props;



  // #region dom 渲染完成后渲染一些东西
  const [ isRender, setIsRender ] = useState(false);
  useEffect(() => {
    setIsRender(true);
  }, [])
  // #endregion



  // #region 搜索弹框控制
  const [ searchVisible, setSearchVisible ] = useState(false);

  useEffect(() => {
    const key = 'note_search';
    const el = <i className='iconfont' onClick={() => setSearchVisible(true)}>&#xe64d;</i>;
    store.dispatch(actionsFixedBtns.addFixedBtn(key, el, 1));

    return () => {
      store.dispatch(actionsFixedBtns.delFixedBtn(key));
    }
  }, [])
  // #endregion



  // #region 手机端菜单按钮控制
  const [ phoneMenuVisible, setPhoneMenuVisible ] = useState(false);

  useEffect(() => {
    const onWheel = (e) => e.preventDefault();
    if (phoneMenuVisible) {
      // window.addEventListener('wheel', onWheel, { passive: false });
      document.body.style.overflowY = 'hidden';
    } else {
      // window.removeEventListener('wheel', onWheel);
      setTimeout(() => {
        document.body.style.overflowY = 'auto';
      }, 300)
    }
  }, [phoneMenuVisible])

  useEffect(() => {
    const key = 'note_fileList';
    const el = <i
      className='iconfont'
      onClick={() => setPhoneMenuVisible(!phoneMenuVisible)}
    >&#xe603;</i>;

    if (data && data.fileAttr.content && store.getState().viewport.clientWidth < 768) {
      store.dispatch(actionsFixedBtns.addFixedBtn(key, el, 6))
    }

    return () => {
      store.dispatch(actionsFixedBtns.delFixedBtn(key));
    }
  }, [phoneMenuVisible, store.getState().viewport.clientWidth, data])
  // #endregion



  // #region 文件大纲按钮
  // useEffect(() => {
  //   const outlineKey = 'note_outline';
  //   props.onAddFixedBtn(outlineKey, <i className='iconfont'>&#xe618;</i>, 5)

  //   return () => {
  //     props.onDelFixedBtn(outlineKey);
  //   }
  // }, [])
  // #endregion



  // #region 监听路由变化，页面回到顶部
  useEffect(() => {
    const unlisten = history.listen((location) => {
      scrollTo(0);
      setPhoneMenuVisible(false);
    })

    return () => {
      unlisten();
    }
  }, [])
  // #endregion



  // #region jsx
  return (<article className={joinClass(style.container, 'leayer clearfix')}>
    {data && <>

      <Helmet html={data.fileAttr.content} />

      {/* 面包屑 */}
      <nav className={style.breadCrumb}>
        <Breadcrumb filename={data.filename} />
      </nav>

      {/* 文件目录 */}
      <div className={style.slideBg} style={{ display: phoneMenuVisible ? 'block' : 'none' }} onClick={() => setPhoneMenuVisible(false)}></div>
      <aside
        className={joinClass(
          style.side,
          data.fileAttr.content ? '' : style.grid,
          phoneMenuVisible ? style.active : '',
        )}
      >
        <FileDirectory fileDirectory={data.fileDirectory} />
      </aside>
      

      {/* 内容 */}
      {data.fileAttr.content && <div className={style.content}>

        {/* 文件信息 */}
        <p className={style.fileInfo}>
          <span>{dateFormater(data.fileAttr.createTime * 1000, 'YYYY/MM/DD')}</span>
          <span>{data.fileAttr.size}字符</span>
        </p>

        {/* 文件内容 */}
        {isRender
          ? <Markdown html={data.fileAttr.content} skewing={90} />
          : <section dangerouslySetInnerHTML={{ __html: data.fileAttr.content }} ></section>
        }

      </div>}

      {/* 搜索 */}
      <Search visible={searchVisible} onCancel={() => setSearchVisible(false)} />

    </>}
  </article>)
  // #endregion

}



// #region 页面渲染之前拿到数据
NotePage.getInitialProps = async({ history, path }) => {
  const { pathname } = history.location;
  const piecewise = pathname.split('/');
  const filename = (pathname.startsWith('http') ? piecewise.slice(4) : piecewise.slice(2)).join('/');

  const { fileDirectory, fileAttr } = await getFileChildDirectoryAndContent(decodeURI(filename), path);

  return {
    data: {
      fileDirectory,
      fileAttr,
      filename,
    }
  }
}

/**
 * 获取文件子目录和内容
 * @param filename
 * @returns 
 */
async function getFileChildDirectoryAndContent(filename: string = '', path: string) {
  let fileDirectory = [], fileAttr: any = {};

  const [ err, res ] = await api_getFileContentOrChildDirectory(`/note/${filename}`);
  if (err) {
    fileAttr.content = err.msg;
    return Promise.reject({
      fileDirectory,
      fileAttr,
    })
  }

  const { data } = res;
  
  // 如果是文件目录
  if (isType(data) === 'array') {
    const folderList = [], fileList = [];
    data.forEach(val => {
      val.path = val.path.replace('/note', path);
      val.color = createColor('888888', 'aaaaaa') + 'aa';
      val.isFile ? fileList.push(val) : folderList.push(val);
    });
    fileDirectory = [].concat(folderList, fileList);

    if (fileList.length === 0) {
      return Promise.resolve({ fileDirectory, fileAttr });
    }

    // 获取子目录下第一个文件的内容
    const [ err, res ] = await api_getFileContentOrChildDirectory(`/note/${filename}/${fileList[0].name}`);
    if (err) {
      fileAttr.content = err.msg;
      return Promise.reject({
        fileDirectory,
        fileAttr,
      })
    }

    fileAttr = res.data;
  } else if (isType(data) === 'object') {  // 如果是文件内容
    fileAttr = data;

    // 获取上一级文件目录
    const piecewise = filename.split('/');
    const foldername = piecewise.slice(0, piecewise.length - 1).join('/');
    const [ err, res ] = await api_getFileContentOrChildDirectory(`/note/${foldername}`);
    if (err) return;

    const folderList = [], fileList = [];
    res.data.forEach(val => {
      val.path = val.path.replace('/note', path);
      val.color = createColor('888888', 'aaaaaa') + 'aa';
      val.isFile ? fileList.push(val) : folderList.push(val);
    });
    fileDirectory = [].concat(folderList, fileList);
    
  }

  return Promise.resolve({
    fileDirectory,
    fileAttr,
  })

}
// #endregion



const hoc = connect(() => store.getState());
export default hoc(NotePage);




