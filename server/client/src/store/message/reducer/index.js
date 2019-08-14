import { RECEIVE_MESSAGE, MESSAGE_SENT, RECEIVE_SYSTEM_MESSAGE } from "../actions";

const INITIAL_STATE = {
  user: undefined,
  messages: [],
  systemMessages: []
};

export default function messageReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case RECEIVE_MESSAGE:
      return Object.assign({}, state, {
        messages: [...state.messages, action.message]
      });
    case RECEIVE_SYSTEM_MESSAGE:
        return Object.assign({}, state, {
            systemMessages: [...state.systemMessages, action.message]
        })
    default:
      return state;
  }
}
