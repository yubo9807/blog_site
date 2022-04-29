// style
import './module.less';

// utils
import { joinClass } from '@/utils/array';



export default ({ children, visible = false, onClose = () => {}, className = '', style = {} }) => {

  // #region jsx
  return (<div
    className={joinClass('yu-protective-bg', visible ? 'active' : '')}
    onClick={onClose}
  >
    <div className={joinClass('yu-protective-wrap', className)} onClick={e => e.stopPropagation()} style={style}>
      {children}
    </div>
  </div>)
  // #endregion

}
