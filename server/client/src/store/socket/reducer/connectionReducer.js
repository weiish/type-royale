import { CONNECTION_CONFIRMED } from '../actions'

export default function (state = {connected: false, user: undefined}, action) {
    switch (action.type) {
        case CONNECTION_CONFIRMED:
            console.log('Connection confirmed!')
            return {connected: true, user: action.user}
        default:
            return state
    }
}