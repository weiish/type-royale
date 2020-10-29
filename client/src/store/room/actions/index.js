export const CREATE_ROOM = "game/create-room";
export const JOIN_ROOM = "game/join-room";
export const UPDATE_ROOM = "game/update-room";

export const SET_SPAWN_DELAY = "game/set-spawn-delay";
export const SET_MAX_WORD_LENGTH = "game/set-max-word-length";
export const SET_MIN_WORD_LENGTH = "game/set-min-word-length";
export const SET_POWER_UPS = "game/set-power-ups";
export const SET_ALLOW_SPECTATORS = "game/set-allow-spectators";

export const SWITCH_TO_PLAYER = "game/switch-to-player";
export const SWITCH_TO_SPECTATOR = "game/switch-to-spectator";

export const createRoom = user => {
  //user = username
  return {
    type: CREATE_ROOM,
    user
  };
};

export const updateRoom = roomData => {
  return {
    type: UPDATE_ROOM,
    roomData
  };
};

export const joinRoom = room_id => {
  //user = username
  return {
    type: JOIN_ROOM,
    room_id
  };
};

export const setSpawnDelay = value => {
  return {
    type: SET_SPAWN_DELAY,
    value
  };
};

export const setMaxWordLength = value => {
  return {
    type: SET_MAX_WORD_LENGTH,
    value
  };
};

export const setMinWordLength = value => {
  return {
    type: SET_MIN_WORD_LENGTH,
    value
  };
};

export const setPowerUps = value => {
  return {
    type: SET_POWER_UPS,
    value
  };
};

export const setAllowSpectators = value => {
  return {
    type: SET_ALLOW_SPECTATORS,
    value
  };
};

export const switchToPlayer = id => {
    return {
        type: SWITCH_TO_PLAYER,
        id
    }
}

export const switchToSpectator = id => {
    return {
        type: SWITCH_TO_SPECTATOR,
        id
    }
}