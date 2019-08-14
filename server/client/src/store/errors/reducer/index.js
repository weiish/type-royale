
import {
    JOIN_ROOM_ERROR,
    CHANGE_SETTING_ERROR
} from '../actions';

const INITIAL_STATE = {
    join_room: null,
    change_setting: null
}

export default function errorReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case JOIN_ROOM_ERROR:
            return Object.assign({}, state, {
                join_room: action.error
            }) 
        default:
            return state;
    }
}