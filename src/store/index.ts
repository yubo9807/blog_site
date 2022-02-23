import { createStore, combineReducers, bindActionCreators, applyMiddleware } from 'redux';

import scroll from './scroll';
import user from './user';
import networkerror from './comp/networkerror';

// function reducer (state: any, action: any) {
//   return {
//     scroll: scroll(state, action)
//   }
// }

const reducer = combineReducers({
  scroll,
  user,
  networkerror,
})

// 中间件
const logger = (state: any) => (next: any) => (action: any) => {
  // console.log('旧数据', store.getState());
  next(action);
  // console.log('新数据', store.getState());
}

const store = createStore(reducer, applyMiddleware(logger));

// console.log(store.getState())

// // 增强 action 创建函数的功能，完成分发
// const boundActions = bindActionCreators(actions, store.dispatch);

// boundActions.increaseAction()
// store.dispatch(actions.increaseAction())

// console.log(store.getState())
export default store;