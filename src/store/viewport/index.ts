const SETSCROLLY = Symbol('setScrollY');
const SETCLIENTWIDTH = Symbol('setClientWidth');

type InitialState = {
  scrollY: number
  clientWidth: number
}
const initialState: InitialState = {
  scrollY: 0,
  clientWidth: 0
};

function reducer(state = initialState, action: { type: symbol, payload?: any }) {
  switch (action.type) {
    case SETSCROLLY:
      return Object.assign({}, state, { scrollY: action.payload });
    case SETCLIENTWIDTH:
      return Object.assign({}, state, { clientWidth: action.payload });
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
  },
  setClientWidthAction(value: number) {
    return {
      type: SETCLIENTWIDTH,
      payload: value
    }
  }
}

export default reducer;
