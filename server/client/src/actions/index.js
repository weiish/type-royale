import { LOGIN_USER, START_IO } from './types';
import io from 'socket.io-client';

const connectIO = (username) => {
    console.log('Connecting...')
    const myConnection = io('localhost:4000')
    return {
        type: START_IO,
        connection: myConnection,
        username
    }
}

export {
    connectIO
}