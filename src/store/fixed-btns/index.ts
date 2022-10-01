import { createNum } from '@/utils/number';
const iter = createNum();

const ADD = Symbol('add');
const DELETE = Symbol('delete');


type InitialState = any
const initialState: InitialState = {};

// reducer 必须是一个没有副作用的纯函数
function reducer(state = initialState, action: { type: symbol, payload?: any }) {
  switch (action.type) {
    case ADD:
      return Object.assign({}, state, action.payload);
    case DELETE:
      const { [action.payload]: key, ...args } = state;
      return args;
    default:
      return state;
  }
}


export const actions = {
  addFixedBtn(key: string, element: JSX.Element, count: number) {
    return {
      type: ADD,
      payload: { [key]: { element, count } }
    }
  },
  delFixedBtn(key: string) {
    return {
      type: DELETE,
      payload: key
    }
  }
}

export default reducer;
