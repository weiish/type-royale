
export const START_GAME     ='game/start-game'
export const TIME_UPDATE    ='game/time-update'
export const GAME_STATE     ='game/game-state'
export const PLAYER_INPUT   ='game/player-input'
export const SEND_WORD      ='game/send-word'

//For Middleware
export const startGame = () => {
    return {
        type: START_GAME,
    }
}

//For Reducer
export const updateTime = ({elapsedTime, timeUntilSpawn}) => {
    return {
        type: TIME_UPDATE,
        elapsedTime,
        timeUntilSpawn
    }
}

//For Reducer
export const updateGameState = ({playerStates, gameStarted}) => {
    return {
        type: GAME_STATE,
        playerStates,
        gameStarted
    }
}

//For Middleware
export const sendPlayerInput = (input) => {
    return {
        type: PLAYER_INPUT,
        input
    }
}

//For Middleware
export const sendWord = () => {
    return {
        type: SEND_WORD
    }
}
