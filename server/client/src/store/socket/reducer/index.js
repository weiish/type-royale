import { combineReducers } from 'redux';
import connectionReducer from './connectionReducer';
import gameReducer from '../../game/reducer'

export default combineReducers({
    connection: connectionReducer,
    game: gameReducer
})