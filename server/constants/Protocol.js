const MESSAGE = "message";
const SYSTEM_MESSAGE = "system_message";
const JOIN_ROOM = "join_room";
const LEAVE_ROOM = "leave_room";
const ROOM_DATA = "room_data";
const CREATE_ROOM = "create_room";

//Socket Protocols for Errors
const ENCOUNTERED_ERROR = "encountered_error";
const ON_CONNECTED = "on_connected";

//Settings
const SET_USERNAME = "set_username";
const SET_SPAWN_DELAY = "set_spawn_delay";
const SET_MAX_WORD_LENGTH = "set_max_word_length";
const SET_MIN_WORD_LENGTH = "set_min_word_length";
const SET_POWER_UPS = "set_power_ups";
const SET_ALLOW_SPECTATORS = "set_allow_spectators";

//Game
const TIME_UPDATE = "time_update";
const GAME_STATE = "game_state";
const PLAYER_INPUT = "player_input";
const SEND_WORD = "send_word";
const START_GAME = "start_game";

module.exports = {
  MESSAGE,
  SYSTEM_MESSAGE,
  JOIN_ROOM,
  LEAVE_ROOM,
  ROOM_DATA,
  CREATE_ROOM,
  ENCOUNTERED_ERROR,
  ON_CONNECTED,
  SET_USERNAME,
  SET_SPAWN_DELAY,
  SET_MAX_WORD_LENGTH,
  SET_MIN_WORD_LENGTH,
  SET_POWER_UPS,
  SET_ALLOW_SPECTATORS,
  TIME_UPDATE,
  GAME_STATE,
  PLAYER_INPUT,
  SEND_WORD,
  START_GAME
};
