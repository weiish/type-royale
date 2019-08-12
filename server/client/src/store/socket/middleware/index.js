import Socket from "./Socket";
import { messageReceived, SEND_MESSAGE } from "../../message/actions";
import { CREATE_LOBBY } from '../../game/actions'
import { CONNECT_SOCKET, CONNECTION_CONFIRMED, connectionConfirmed } from "../actions";

const socketMiddleware = store => {
  //onMessage is what our Socket will call whenever the IO connection gets a "message" event
  const onMessage = message => {
    store.dispatch(messageReceived(message));
  };

  const onRoomData = data => {};

  const onConnected = (user) => {
      store.dispatch(connectionConfirmed(user));
  }

  const socket = new Socket(onConnected, onMessage, onRoomData);

  return next => action => {
    switch (action.type) {
      case CONNECT_SOCKET:
        socket.connect(action.user);
      case CREATE_LOBBY:
        
      default:
        console.log("Socket middleware will ignore this action");
    }
    return next(action);
  };
};

export default socketMiddleware;
