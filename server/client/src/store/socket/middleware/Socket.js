import * as Protocol from "../../../constants/Protocol.js";

import io from "socket.io-client";

export default class Socket {
  constructor(
    onConnected,
    onMessage,
    onSystemMessage,
    onRoomData,
    onReceiveError,
    onTimeUpdate,
    onGameState
  ) {
    this.onMessage = onMessage;
    this.onRoomData = onRoomData;
    this.onSystemMessage = onSystemMessage;
    this.onConnected = onConnected;
    this.onReceiveError = onReceiveError;
    this.onTimeUpdate = onTimeUpdate;
    this.onGameState = onGameState;
    this.socket = null;
    this.port = 4000;
  }

  connect = () => {
    const host = `http://localhost:${this.port}`;
    this.socket = io.connect(host);

    this.socket.on(Protocol.ROOM_DATA, this.onRoomData);
    this.socket.on(Protocol.ENCOUNTERED_ERROR, this.onReceiveError);
    this.socket.on(Protocol.ON_CONNECTED, this.onConnected);
    this.socket.on(Protocol.MESSAGE, this.onMessage);
    this.socket.on(Protocol.SYSTEM_MESSAGE, this.onSystemMessage);
    this.socket.on(Protocol.TIME_UPDATE, this.onTimeUpdate);
    this.socket.on(Protocol.GAME_STATE, this.onGameState)
  };

  requestJoinRoom = (username, room_id) => {
    console.log("Client socket is requesting to join a room... ");
    this.socket.emit(Protocol.JOIN_ROOM, username, room_id);
  };

  requestCreateRoom = username => {
    console.log("Client socket is requesting to create a room... ");
    this.socket.emit(Protocol.CREATE_ROOM, username);
  };

  sendIM = message => this.socket.emit(Protocol.MESSAGE, message);

  setUsername = username => this.socket.emit(Protocol.SET_USERNAME, username);
  sendPlayerInput = input => this.socket.emit(Protocol.PLAYER_INPUT, input)
  sendWord = () => this.socket.emit(Protocol.SEND_WORD)

  requestSetSpawnDelay = value =>
    this.socket.emit(Protocol.SET_SPAWN_DELAY, value);
  requestSetMaxWordLength = value =>
    this.socket.emit(Protocol.SET_MAX_WORD_LENGTH, value);
  requestSetMinWordLength = value =>
    this.socket.emit(Protocol.SET_MIN_WORD_LENGTH, value);
  requestSetPowerups = value => this.socket.emit(Protocol.SET_POWER_UPS, value);
  requestSetAllowSpectate = value =>
    this.socket.emit(Protocol.SET_ALLOW_SPECTATORS, value);

  requestStartGame = () => this.socket.emit(Protocol.START_GAME);


  
}
