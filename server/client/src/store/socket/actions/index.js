//Define Action Types

export const CONNECT_SOCKET    = 'socket/connect_socket'
export const CONNECTION_CONFIRMED    = 'socket/connection_confirmed'

export const connectSocket = (user) => {
    return {
        type: CONNECT_SOCKET,
        user: user
    }
}

export const connectionConfirmed = (user) => {
    return {
        type: CONNECTION_CONFIRMED,
        user: user
    }
}