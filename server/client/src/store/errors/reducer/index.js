import * as Errors from "../../../constants/ErrorProtocol.js";

const INITIAL_STATE = {
  join_room: null,
  change_setting: null,
  permissions: null
};

export default function errorReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case Errors.ERR_JOIN_ROOM:
      return Object.assign({}, state, {
        join_room: action.error
      });
    case Errors.ERR_CHANGE_SETTING:
      return Object.assign({}, state, {
        change_setting: action.error
      });
    case Errors.ERR_PERMISSIONS:
      return Object.assign({}, state, {
        permissions: action.error
      });
    default:
      return state;
  }
}
