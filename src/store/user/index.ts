
const TOKEN = 'token';
export function getToken() {
  return localStorage.getItem(TOKEN);
}
export function setToken(token: string) {
  localStorage.setItem(TOKEN, token);
}

const SIGNIN = Symbol('signIn');
const SIGNOUT = Symbol('signOut');
const SETUSERINFO = Symbol('setUserinfo');

type InitialState = {
  isLogin: 0 | 1 | 2,  // 0 初始状态 1 登录成功 2 退出登录
  userInfo: any
}
const initialState: InitialState = {
  isLogin: 0,
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
      payload: 1
    }
  },
  // 登出
  signOutAction() {
    setToken('');
    return {
      type: SIGNOUT,
      payload: 2
    }
  },
  // 设置用户信息
  setUserinfoAction(data: any) {
    return {
      type: SETUSERINFO,
      payload: data
    }
  }
}

export default reducer;
