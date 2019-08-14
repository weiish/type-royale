import { CONNECTION_CONFIRMED, SET_USERNAME } from "../actions";

const INITIAL_STATE = { connected: false, username: null, user_id: null };

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CONNECTION_CONFIRMED:
      console.log("Connection confirmed!");
      return Object.assign({}, state, {
        connected: true,
        user_id: action.user_id
      });
    case SET_USERNAME:
      return Object.assign({}, state, {
          username: action.username
      });
    default:
      return state;
  }
}
