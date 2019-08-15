
import * as Errors from "../../../constants/ErrorProtocol.js";

export const joinRoomError = (error) => {
    console.log('Dispatching join room error, error is ',error)
    return {
        type: Errors.ERR_JOIN_ROOM,
        error
    }
}

export const changeSettingError = (error) => {
    console.log('Dispatching change setting error, error is ',error)
    return {
        type: Errors.ERR_CHANGE_SETTING,
        error
    }
}

export const permissionsError = (error) => {
    return {
        type: Errors.ERR_PERMISSIONS,
        error
    }
}