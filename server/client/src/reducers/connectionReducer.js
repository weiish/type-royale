import {START_IO} from '../actions/types'

export default function(state = null, action) {
    switch (action.type) {
        case START_IO:
            return {io: action.connection, username: action.username}
        default:
            return state
    }
}