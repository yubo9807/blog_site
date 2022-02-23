import { joinClass } from '@/utils/array';
import { connect } from 'react-redux';
import './index.less';

function NetworkError({ visible }) {
  return <div className={joinClass('yu-network-error', visible ? 'show' : '')}>
    <i className='iconfont'>&#xec72;</i>
    <p>网络错误</p>
  </div>
}

function mapStateToProps(state: any, ownProps: any) {
  return {
    visible: state.networkerror.visible
  }
}

const hoc = connect(mapStateToProps);

export default hoc(NetworkError)