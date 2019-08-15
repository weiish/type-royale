import { combineReducers } from 'redux';
import connectionReducer from './connectionReducer';
import gameReducer from '../../game/reducer'
import errorReducer from '../../errors/reducer'
import messageReducer from '../../message/reducer'
import roomReducer from '../../room/reducer'

export default combineReducers({
    connection: connectionReducer,
    game: gameReducer,
    error: errorReducer,
    message: messageReducer,
    room: roomReducer
})