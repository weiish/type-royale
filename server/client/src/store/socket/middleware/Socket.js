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
    console.log('The user is ', user)

    this.onConnected(user)
  };

  sendIM = message => this.socket.emit(Protocol.MESSAGE, message)
}
