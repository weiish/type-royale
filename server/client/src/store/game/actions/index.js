
export const CREATE_ROOM      = 'game/create-room'
export const JOIN_ROOM        = 'game/join-room'
export const UPDATE_ROOM      = 'game/update-room'
export const SHOW_JOIN_PAGE   = 'game/show-join-page'

export const SET_SPAWN_DELAY  = 'game/set-spawn-delay'
export const SET_MAX_WORD_LENGTH  = 'game/set-max-word-length'
export const SET_MIN_WORD_LENGTH  = 'game/set-min-word-length'
export const SET_POWER_UPS  = 'game/set-power-ups'
export const SET_ALLOW_SPECTATORS  = 'game/set-allow-spectators'

export const START_GAME     ='game/start-game'
export const TIME_UPDATE    ='game/time-update'

export const createRoom = (user) => {
    //user = username
    return {
        type: CREATE_ROOM,
        user
    }
}

export const updateRoom = (roomData) => {
    return {
        type: UPDATE_ROOM,
        roomData
    }
}

export const joinRoom = (user, room_id) => {
    //user = username
    return {
        type: JOIN_ROOM,
        user,
        room_id
    }
}

export const showJoinPage = () => {
    return {
        type: SHOW_JOIN_PAGE
    }
}

export const setSpawnDelay = (value) => {
    return {
        type: SET_SPAWN_DELAY,
        value
    }
}

export const setMaxWordLength = (value) => {
    return {
        type: SET_MAX_WORD_LENGTH,
        value
    }
}

export const setMinWordLength = (value) => {
    return {
        type: SET_MIN_WORD_LENGTH,
        value
    }
}

export const setPowerUps = (value) => {
    return {
        type: SET_POWER_UPS,
        value
    }
}

export const setAllowSpectators = (value) => {
    return {
        type: SET_ALLOW_SPECTATORS,
        value
    }
}

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
