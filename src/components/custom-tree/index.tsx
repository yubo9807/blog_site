import { useEffect, useRef } from 'react';
import './index.less';

const ISOPEN = 'is-open';
const ACTIVE = 'active';
const TREENODE = 'yu-tree-node';

export const TreeNode = ({ children, title }) => {
  return (<div className={TREENODE}>
    {children ? <i className='iconfont'>&#xe602;</i> : <i></i>}
    <div className={'yu-tree-node-title'}>{title}</div>
    {children}
  </div>)
}

const Tree = ({ children, search = '', onSelect = (ele) => {} }) => {
  
  const treeRef = useRef();
  // 监听搜索值变化
  useEffect(() => {
    const tree: HTMLElement = treeRef.current;
    const { children } = tree;
    // 关闭第一层
    [...children].forEach((val: HTMLElement) => {
      val.classList.remove(ISOPEN);
      val.style.height = '30px';
    });

    const treeNodes = tree.getElementsByClassName(TREENODE);
    [...treeNodes].filter(val => {
      const title = val.children[1];
      val.classList.remove(ACTIVE);
      if ((title as HTMLElement).innerText === search) {
        val.classList.add(ACTIVE);
        openParent(val);
      }
    })
  }, [search])

  // 展开父级节点（递归）
  function openParent(ele) {
    const parent = ele.parentElement;
    const { classList } = parent;
    if ([...classList].includes(TREENODE)) {
      parent.classList.add(ISOPEN);
      parent.style.height = 'auto';
      openParent(parent);
    }
  }
  
  let backupHeight = 0;
  // 点击每个节点
  function onClick(e) {
    const ele = e.target.parentElement;
    const isActive = [...ele.classList].includes(ISOPEN);
    if (isActive) {
      ele.style.height = backupHeight + 'px';  // 备份一下高度
    } else {
      backupHeight = ele.offsetHeight;
      ele.style.height = 'auto';
    }
    ele.classList.toggle(ISOPEN);
    onSelect(ele);  // 向上抛出事件，选中了哪一项
  }

  return (<div ref={treeRef} className='yu-tree' onClick={onClick}>
    {children}
  </div>)
}
export default Tree;