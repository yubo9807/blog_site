/**
 * 遮照组件
 */
import { joinClass } from '@/utils/array';
import './module.less';

export default ({ children, visible = false, onClose = () => {}, className = '', style = {} }) => {

  return (<div
    className={joinClass('yu-protective-bg', visible ? 'active' : '')}
    onClick={onClose}
  >
    <div className={joinClass('yu-protective-wrap', className)} onClick={e => e.stopPropagation()} style={style}>
      {children}
    </div>
  </div>)
}
