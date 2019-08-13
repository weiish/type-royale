
export const CREATE_ROOM      = 'game/create-room'
export const JOIN_ROOM        = 'game/join-room'
export const UPDATE_ROOM      = 'game/update-room'

export const createRoom = (user) => {
    console.log('Dispatching create room, user is ',user)
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