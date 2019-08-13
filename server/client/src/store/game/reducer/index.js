
import {
    CREATE_ROOM,
    JOIN_ROOM,
    UPDATE_ROOM
} from '../actions';

const INITIAL_STATE = {
    room: null
}

export default function gameReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case UPDATE_ROOM:
            return Object.assign({}, state, {
                room: action.roomData
            })
        default:
            return state;
    }
}