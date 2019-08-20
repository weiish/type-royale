//Define Action Types

export const CONNECT_SOCKET    = 'socket/connect_socket'
export const CONNECTION_CONFIRMED    = 'socket/connection_confirmed'
export const SET_USERNAME   = 'socket/set-username'


export const connectSocket = (url) => {
    console.log('Attempting to connect to',url)
    return {
        type: CONNECT_SOCKET,
        url
    }
}

export const connectionConfirmed = (user_id) => {
    return {
        type: CONNECTION_CONFIRMED,
        user_id
    }
}

export const setUsername = (username) => {
    return {
        type: SET_USERNAME,
        username
    }
}
