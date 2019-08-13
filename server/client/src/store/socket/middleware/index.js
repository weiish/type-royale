import Socket from "./Socket";
import { messageReceived, SEND_MESSAGE } from "../../message/actions";
import { CREATE_ROOM, updateRoom} from '../../game/actions'
import { CONNECT_SOCKET, CONNECTION_CONFIRMED, connectionConfirmed } from "../actions";

const socketMiddleware = store => {
  //onMessage is what our Socket will call whenever the IO connection gets a "message" event
  const onMessage = message => {
      store.dispatch(messageReceived(message));
  };

  const onRoomData = roomData => {
      console.log('Got room data!')
      store.dispatch(updateRoom(roomData))
  };

  const onConnected = (user) => {
      store.dispatch(connectionConfirmed(user));
  }

  const socket = new Socket(onConnected, onMessage, onRoomData);

  return next => action => {
    switch (action.type) {
      case CONNECT_SOCKET:
        socket.connect(action.user);
        break;
      case CREATE_ROOM:
        console.log('Middleware got create room request')
        socket.requestCreateRoom(action.user)
        break;
      default:
        console.log("Socket middleware will ignore this action");
        break;
    }
    return next(action);
  };
};

export default socketMiddleware;
