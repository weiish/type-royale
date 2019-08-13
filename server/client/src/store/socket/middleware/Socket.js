import * as Protocol from "../../../constants/Protocol.js";
import io from "socket.io-client";

export default class Socket {
  constructor(onConnected, onMessage, onRoomData) {
    this.onMessage = onMessage;
    this.onRoomData = onRoomData;
    this.onConnected = onConnected;
    this.socket = null;
    this.user = null;
    this.port = 4000;
  }

  connect = user => {
    this.user = user;
    const host = `http://localhost:${this.port}`;
    this.socket = io.connect(host);

    this.socket.on(Protocol.ROOM_DATA, this.onRoomData);
    this.onConnected(user);
  };

  requestJoinRoom = (username, room_id) => {
    this.socket.emit(Protocol.JOIN_ROOM, (username, room_id));
  }
    

  requestCreateRoom = username => {
      console.log('Requesting to create a room... Protocol',Protocol.CREATE_ROOM)
      this.socket.emit(Protocol.CREATE_ROOM, username);
  }

  sendIM = message => this.socket.emit(Protocol.MESSAGE, message);
}
