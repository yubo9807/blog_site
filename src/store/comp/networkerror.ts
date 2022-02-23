const SETVISIBLE = Symbol('setVisble');

type InitialState = {
  visible: boolean
}
const initialState: InitialState = {
  visible: false
};

function reducer(state = initialState, action: { type: symbol, payload?: any }) {
  switch (action.type) {
    case SETVISIBLE:
      return Object.assign({}, state, { visible: action.payload });
    default:
      return state;
  }
}


export const actions = {
  setVisibleAction(bool: boolean) {
    return {
      type: SETVISIBLE,
      payload: bool
    }
  }
}

export default reducer;
