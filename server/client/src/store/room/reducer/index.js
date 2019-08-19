
import {
    UPDATE_ROOM,
    SHOW_JOIN_PAGE
} from '../actions';


// TODO
// EACH TIME A SET ACTION IS DISPATCHED, SOCKET CLIENT NEEDS TO SEND A REQUEST TO HOST
// CLIENT WILL FIRST CHECK ON ITS END IF IT IS THE HOST, AND NOT SEND THE REQUEST IF NOT
// HOST WILL CHECK IF CLIENT IS THE HOST, AND IGNORE REQUEST IF NOT HOST
const INITIAL_STATE = {
    room: null,
    join_page: false
}

export default function roomReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case SHOW_JOIN_PAGE:
            console.log('Setting join page to ',action.value)
            return Object.assign({}, state, {
                join_page: action.value
            }) 
        case UPDATE_ROOM:
            return Object.assign({}, state, {
                room: action.roomData
            })
        default:
            return state;
    }
}