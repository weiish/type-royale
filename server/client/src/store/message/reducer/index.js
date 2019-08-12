
import {
    RECEIVE_MESSAGE,
    MESSAGE_SENT
} from '../actions';

const INITIAL_STATE = {
    user: undefined,
    messages: []
}

function messageReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case RECEIVE_MESSAGE:
            return Object.assign({}, state, {
                messages: [...state.messages, action.message]
            })
    }
}