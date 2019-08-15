
export const START_GAME     ='game/start-game'
export const TIME_UPDATE    ='game/time-update'

export const startGame = () => {
    return {
        type: START_GAME,
    }
}

export const updateTime = (elapsedTime, timeUntilSpawn) => {
    return {
        type: TIME_UPDATE,
        elapsedTime,
        timeUntilSpawn
    }
}
