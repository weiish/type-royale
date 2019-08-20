
import * as Errors from "../../../constants/ErrorProtocol.js";

export const joinRoomError = (error) => {
    return {
        type: Errors.ERR_JOIN_ROOM,
        error
    }
}

export const changeSettingError = (error) => {
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

export const errorHandled = (errorType) => {
    return {
        type: Errors.ERR_HANDLED,
        errorType
    }
}