export const SEND_MESSAGE           = 'message/send-message';
export const RECEIVE_MESSAGE        = 'message/receive-message';
export const MESSAGE_SENT           = 'message/message-sent';

//sendMessage is handled in middleware
export const sendMessage = message => {
    return {
        type: SEND_MESSAGE,
        message: message
    }
}

export const messageReceived = message => {
    return {
        type: RECEIVE_MESSAGE,
        message: message
    }
}

export const messageSent = () => {
    return {
        type: MESSAGE_SENT
    };
}

