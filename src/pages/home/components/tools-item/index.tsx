// styles
import style from './module.less';

// npm
import { useEffect, useState } from 'react';
import { Dropdown, Modal } from 'antd';

// utils
import { getSystemEnvironment } from '@/utils/browser';
import { joinClass } from '@/utils/array';

// env
import env from '~/config/env';



type Props = {
  title:     string
  introduce: string
  filename:  string
  size:      string
  preview?:  JSX.Element
}

let systemCache = null;

function ToolsItem(props: Props) {

  const [ system, setSystem ] = useState('darwin');
  useEffect(() => {
    systemCache ||= getSystemEnvironment();
    setSystem(systemCache);
  }, [])

  const [ modalVisible, useModalVisible ] = useState(false);

  const items = [
    { key: '1', label: <a href={env.BASE_RESOURCE_URL+'/download/darwin/'+props.filename}>MacOS</a> },
    { key: '2', label: <a href={env.BASE_RESOURCE_URL+'/download/linux/'+props.filename}>Linux</a> },
    { key: '3', label: <a href={env.BASE_RESOURCE_URL+'/download/windows/'+props.filename}>Windows</a> },
  ];

  return (<div className={style.toolsItem}>
    <h2 className={style.title}>{props.title}</h2>
    <p>{props.introduce}</p>
    <span className={style.size}>Size: {props.size}</span>
    <div className={style.btns}>
      {props.preview
        ? <span className={joinClass(style.btn, style.preview)} onClick={() => useModalVisible(true)}>预览</span>
        : null
      }
      <span className={joinClass(style.btn, style.download)}>
        <a href={'/download/'+system+'/'+props.filename} download>下载</a>
        <Dropdown overlayClassName={style.overlay} menu={{ items }}>
          <span className={joinClass('iconfont', style.more)}>&#xe6b9;</span>
        </Dropdown>
      </span>
    </div>

    <Modal
      className={style.videoModal}
      open={modalVisible}
      closable={false}
      footer={null}
      width='80vw'
      style={{
        maxWidth: '1000px',
        maxHeight: '90vh',
      }}
      onCancel={() => useModalVisible(false)}
    >
      {props.preview}
    </Modal>

  </div>)
}

export default ToolsItem;
