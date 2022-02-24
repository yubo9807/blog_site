const SHOWMESSAGE = Symbol('showMessage');
const HIDDENMESSAGE = Symbol('hiddenMessage');

type InitialState = {
  visible: boolean,
  icon: string,
  message: string,
}
const initialState: InitialState = {
  visible: false,
  message: '',
  icon: '',
};

function reducer(state = initialState, action: { type: symbol, payload?: any }) {
  switch (action.type) {
    case SHOWMESSAGE:
      const { message, icon } = action.payload;
      return Object.assign({}, state, { visible: true, message, icon } );
    case HIDDENMESSAGE: 
      return Object.assign({}, state, { visible: false });
    default:
      return state;
  }
}


export const actions = {
  showMessageAction(message = '网络错误', icon = '&#xec72;') {
    return {
      type: SHOWMESSAGE,
      payload: { message, icon }
    }
  },
  hiddenMessageAction() {
    return {
      type: HIDDENMESSAGE
    }
  }
}

export default reducer;
