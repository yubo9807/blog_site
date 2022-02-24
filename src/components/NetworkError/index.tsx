import { joinClass } from '@/utils/array';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { actions } from '@/store/comp/networkerror';
import './index.less';

function NetworkError(props) {
  const { visible, onHiddenMessage, icon, message } = props;

  useEffect(() => {
    if (visible) {
      setTimeout(() => onHiddenMessage(false), 1600);
    }
  }, [visible])

  return <div className={joinClass('yu-network-error', visible ? 'show' : '')}>
    <i className='iconfont' dangerouslySetInnerHTML={{ __html: icon }}></i>
    <p>{message}</p>
  </div>
}

function mapStateToProps(state: any, ownProps: any) {
  return {
    visible: state.networkerror.visible,
    icon: state.networkerror.icon,
    message: state.networkerror.message,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onHiddenMessage() {
      dispatch(actions.hiddenMessageAction())
    }
  }
}

const hoc = connect(mapStateToProps, mapDispatchToProps);

export default hoc(NetworkError)