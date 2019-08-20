import Socket from "./Socket";
import {
  messageReceived,
  SEND_MESSAGE,
  systemMessageReceived
} from "../../message/actions";
import * as ErrorProtocol from "../../../constants/ErrorProtocol.js";
import {
  START_GAME,
  updateTime,
  updateGameState,
  PLAYER_INPUT,
  SEND_WORD
} from "../../game/actions";
import {
  CREATE_ROOM,
  JOIN_ROOM,
  updateRoom,
  SET_SPAWN_DELAY,
  SET_MAX_WORD_LENGTH,
  SET_MIN_WORD_LENGTH,
  SET_POWER_UPS,
  SET_ALLOW_SPECTATORS,
  SWITCH_TO_PLAYER,
  SWITCH_TO_SPECTATOR
} from "../../room/actions";
import { CONNECT_SOCKET, connectionConfirmed, SET_USERNAME } from "../actions";
import { joinRoomError, changeSettingError } from "../../errors/actions";

const socketMiddleware = store => {
  //onMessage is what our Socket will call whenever the IO connection gets a "message" event
  const onMessage = message => {
    store.dispatch(messageReceived(message));
  };

  const onSystemMessage = message => {
    store.dispatch(systemMessageReceived(message));
  };

  const onRoomData = roomData => {
    store.dispatch(updateRoom(roomData));
  };

  const onConnected = user_id => {
    store.dispatch(connectionConfirmed(user_id));
  };

  const onTimeUpdate = timePacket => {
    store.dispatch(updateTime(timePacket));
  };

  const onGameState = gameState => {
    store.dispatch(updateGameState(gameState));
  };

  const onReceiveError = error => {
    //Parse the error to see what kind of error it is, and dispatch accordingly
    console.log("Got an error");
    switch (error.type) {
      case ErrorProtocol.ERR_JOIN_ROOM:
        store.dispatch(joinRoomError(error.error));
        break;
      case ErrorProtocol.ERR_CHANGE_SETTING:
        console.log("Got change setting error");
        store.dispatch(changeSettingError(error.error));
      default:
        break;
    }
  };

  const socket = new Socket(
    onConnected,
    onMessage,
    onSystemMessage,
    onRoomData,
    onReceiveError,
    onTimeUpdate,
    onGameState
  );

  return next => action => {
    switch (action.type) {
      case SET_USERNAME:
        socket.setUsername(action.username);
        break;
      case CONNECT_SOCKET:
        socket.connect(action.url);
        break;
      case CREATE_ROOM:
        socket.requestCreateRoom(action.user);
        break;
      case JOIN_ROOM:
        socket.requestJoinRoom(action.room_id);
        break;
      case SEND_MESSAGE:
        socket.sendIM(action.message);
        break;
      case SET_SPAWN_DELAY:
        socket.requestSetSpawnDelay(action.value);
        break;
      case SET_MAX_WORD_LENGTH:
        socket.requestSetMaxWordLength(action.value);
        break;
      case SET_MIN_WORD_LENGTH:
        socket.requestSetMinWordLength(action.value);
        break;
      case SET_POWER_UPS:
        socket.requestSetPowerups(action.value);
        break;
      case SET_ALLOW_SPECTATORS:
        socket.requestSetAllowSpectate(action.value);
        break;
      case SWITCH_TO_PLAYER:
        socket.requestSwitchToPlayer(action.id);
        break;
      case SWITCH_TO_SPECTATOR:
        socket.requestSwitchToSpectator(action.id);
        break;
      case START_GAME:
        socket.requestStartGame();
        break;
      case PLAYER_INPUT:
        socket.sendPlayerInput(action.input);
        break;
      case SEND_WORD:
        socket.sendWord();
        break;
      default:
        break;
    }
    return next(action);
  };
};

export default socketMiddleware;
