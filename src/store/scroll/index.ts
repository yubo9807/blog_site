const SETSCROLLY = Symbol('setScrollY');

type InitialState = {
  scrollY: number
}
const initialState: InitialState = {
  scrollY: 0
};

// reducer 必须是一个没有副作用的纯函数
function reducer(state = initialState, action: { type: symbol, payload?: any }) {
  switch (action.type) {
    case SETSCROLLY:
      return Object.assign({}, state, { scrollY: action.payload });
    default:
      return state;
  }
}


export const actions = {
  setScrollYAction(value: number) {
    return {
      type: SETSCROLLY,
      payload: value
    }
  }
}

export default reducer;
