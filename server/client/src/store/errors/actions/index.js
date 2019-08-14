
export const JOIN_ROOM_ERROR      = 'error/join-room'
export const CHANGE_SETTING_ERROR      = 'error/change-setting'

export const joinRoomError = (error) => {
    console.log('Dispatching join room error, error is ',error)
    return {
        type: JOIN_ROOM_ERROR,
        error
    }
}

export const changeSettingError = (error) => {
    console.log('Dispatching change setting error, error is ',error)
    return {
        type: CHANGE_SETTING_ERROR,
        error
    }
}