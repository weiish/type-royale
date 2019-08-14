
import {
    CREATE_ROOM,
    JOIN_ROOM,
    UPDATE_ROOM,
    SHOW_JOIN_PAGE,
    SET_SPAWN_DELAY,
    SET_MAX_WORD_LENGTH,
    SET_MIN_WORD_LENGTH,
    SET_POWER_UPS,
    SET_ALLOW_SPECTATORS
} from '../actions';


// TODO
// EACH TIME A SET ACTION IS DISPATCHED, SOCKET CLIENT NEEDS TO SEND A REQUEST TO HOST
// CLIENT WILL FIRST CHECK ON ITS END IF IT IS THE HOST, AND NOT SEND THE REQUEST IF NOT
// HOST WILL CHECK IF CLIENT IS THE HOST, AND IGNORE REQUEST IF NOT HOST
const INITIAL_STATE = {
    room: null,
    join_page: false
}

export default function gameReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case SHOW_JOIN_PAGE:
            return Object.assign({}, state, {
                join_page: true
            }) 
        case UPDATE_ROOM:
            return Object.assign({}, state, {
                room: action.roomData
            })
        
        default:
            return state;
    }
}