const NOWROUTE = Symbol('nowRoute');

type Obj = {
  [key: string]: any
}
type InitialState = {
  nowRoute: Obj
}

const initialState: InitialState = {
  nowRoute: {}
};

// reducer 必须是一个没有副作用的纯函数
function reducer(state = initialState, action: { type: symbol, payload?: any }) {
  switch (action.type) {
    case NOWROUTE:
      return Object.assign({}, state, { nowRoute: action.payload });
    default:
      return state;
  }
}


export const actions = {
  setNowRouteAction(value: Obj) {
    return {
      type: NOWROUTE,
      payload: value
    }
  }
}

export default reducer;
