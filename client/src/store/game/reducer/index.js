
import {
    TIME_UPDATE,
    GAME_STATE
} from '../actions';


// TODO
// EACH TIME A SET ACTION IS DISPATCHED, SOCKET CLIENT NEEDS TO SEND A REQUEST TO HOST
// CLIENT WILL FIRST CHECK ON ITS END IF IT IS THE HOST, AND NOT SEND THE REQUEST IF NOT
// HOST WILL CHECK IF CLIENT IS THE HOST, AND IGNORE REQUEST IF NOT HOST
const INITIAL_STATE = {
    elapsedTime: 0,
    timeUntilSpawn: 0,
    playerStates: {},
    gameStarted: false
}

export default function gameReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case TIME_UPDATE:
            return Object.assign({}, state, {
                elapsedTime: action.elapsedTime,
                timeUntilSpawn: action.timeUntilSpawn
            })
        case GAME_STATE:
            return Object.assign({}, state, {
                playerStates: action.playerStates,
                gameStarted: action.gameStarted
            })
        default:
            return state;
    }
}