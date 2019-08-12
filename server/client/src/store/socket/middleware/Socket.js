import * as Protocol from "../../../constants/Protocol.js";
import io from "socket.io-client";

export default class Socket {
  constructor(onConnected, onMessage, onLobbyData) {
    this.onMessage = onMessage;
    this.onRoomData = onLobbyData;
    this.onConnected = onConnected;
    this.socket = null;
    this.user = null;
    this.port = 4000;
  }

  connect = user => {
    this.user = user;
    const host = `http://localhost:${this.port}`;
    this.socket = io.connect(host);

    this.onConnected(user)
  };

  requestCreateLobby = () => this.socket.emit(Protocol.CREATE_ROOM)

  sendIM = message => this.socket.emit(Protocol.MESSAGE, message)
}
