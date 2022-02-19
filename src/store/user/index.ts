const SIGNIN = Symbol('signIn');
const SIGNOUT = Symbol('signOut');
const SETUSERINFO = Symbol('setUserinfo');

type InitialState = {
  isLogin: boolean
  userInfo: any
}
const initialState: InitialState = {
  isLogin: false,
  userInfo: {}
};

// reducer 必须是一个没有副作用的纯函数
function reducer(state = initialState, action: { type: symbol, payload?: any }) {
  switch (action.type) {
    case SIGNIN:
      return Object.assign({}, state, { isLogin: action.payload });
    case SIGNOUT:
      return Object.assign({}, state, { isLogin: action.payload });
    case SETUSERINFO:
      return Object.assign({}, state, { userInfo: action.payload });
    default:
      return state;
  }
}


export const actions = {
  // 登入
  signInAction() {
    return {
      type: SIGNIN,
      payload: true
    }
  },
  // 登出
  signOutAction() {
    return {
      type: SIGNOUT,
      payload: false
    }
  },
  setUserinfoAction(data: any) {
    return {
      type: SETUSERINFO,
      payload: data
    }
  }
}

export default reducer;
