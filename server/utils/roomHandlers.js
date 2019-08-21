const { Room, createRoom, deleteRoom, getRoom } = require("./room");
const { generateMessage } = require("./messages");
const {
  addUser,
  removeUser,
  setUsername,
  setUserRoom,
  getUser,
  getUsersInRoom
} = require("./users");
const Protocol = require("../constants/Protocol.js");
const ErrorProtocol = require("../constants/ErrorProtocol.js");

const userIsHost = (user, room) => {
  return user.id === room.hostID;
};

const handleCreateRoom = (socket, io) => {

  const sendRoomData = (room_id, room) => {
    io.to(room_id).emit(Protocol.ROOM_DATA, room);
  }

  console.log("Server got Create Room Request from socket id:", socket.id);
  let newRoom = createRoom(socket.id, sendRoomData);
  setUserRoom(socket.id, newRoom.id);
  const user = getUser(socket.id);
  newRoom.addPlayer(user);
  socket.join(newRoom.id);
  socket.emit(Protocol.ROOM_DATA, newRoom);
};

const handleJoinRoom = (socket, room_id) => {
  let existingRoom = getRoom(room_id);
  if (!existingRoom) {
    console.log("Invalid room ID, sending error back");
    socket.emit(Protocol.ENCOUNTERED_ERROR, {
      type: ErrorProtocol.ERR_JOIN_ROOM,
      error: "Room not found"
    });
  } else {
    setUserRoom(socket.id, room_id);
    const user = getUser(socket.id);
    if (existingRoom.isFull() || existingRoom.gameStarted) {
      existingRoom.addSpectator(user);
    } else {
      existingRoom.addPlayer(user);
    }
    
    socket.join(existingRoom.id);
    existingRoom.sendUpdate();
    if (existingRoom.gameStarted) {
      
    }
    socket.broadcast
      .to(room_id)
      .emit(
        Protocol.MESSAGE,
        generateMessage("SYSTEM", `${user.username} has joined.`)
      );
  }
};

const handleSetSpawnDelay = (socket, value) => {
  if (value >= 1 && value <= 10) {
    const user = getUser(socket.id);
    const room = getRoom(user.room_id);
    if (userIsHost(user, room)) {
      if (room.gameStarted) {
        return socket.emit(Protocol.ENCOUNTERED_ERROR, {
          type: ErrorProtocol.ERR_PERMISSIONS,
          error: "Cannot edit settings while game is in progress"
        });
      }
      room.setSpawnDelay(value);
      room.sendUpdate();
    } else {
      socket.emit(Protocol.ENCOUNTERED_ERROR, {
        type: ErrorProtocol.ERR_PERMISSIONS,
        error: "Only the host may edit settings of the room"
      });
    }
  } else {
    socket.emit(Protocol.ENCOUNTERED_ERROR, {
      type: ErrorProtocol.ERR_CHANGE_SETTING,
      error: "Value for spawn delay was not within bounds"
    });
  }
};

const handleSetMaxWordLength = (socket, value) => {
  const user = getUser(socket.id);
  const room = getRoom(user.room_id);

  if (value >= room.settings.minWordLength && value <= 31) {
    if (userIsHost(user, room)) {
      if (room.gameStarted) {
        return socket.emit(Protocol.ENCOUNTERED_ERROR, {
          type: ErrorProtocol.ERR_PERMISSIONS,
          error: "Cannot edit settings while game is in progress"
        });
      }
      room.setMaxWordLength(value);
      room.sendUpdate();
    } else {
      socket.emit(Protocol.ENCOUNTERED_ERROR, {
        type: ErrorProtocol.ERR_PERMISSIONS,
        error: "Only the host may edit settings of the room"
      });
    }
  } else {
    socket.emit(Protocol.ENCOUNTERED_ERROR, {
      type: ErrorProtocol.ERR_CHANGE_SETTING,
      error: "Value for max word length was not within bounds"
    });
  }
};

const handleSetMinWordLength = (socket, value) => {
  const user = getUser(socket.id);
  const room = getRoom(user.room_id);

  if (value >= 1 && value <= room.settings.maxWordLength) {
    if (userIsHost(user, room)) {
      if (room.gameStarted) {
        return socket.emit(Protocol.ENCOUNTERED_ERROR, {
          type: ErrorProtocol.ERR_PERMISSIONS,
          error: "Cannot edit settings while game is in progress"
        });
      }
      room.setMinWordLength(value);
      room.sendUpdate();
    } else {
      socket.emit(Protocol.ENCOUNTERED_ERROR, {
        type: ErrorProtocol.ERR_PERMISSIONS,
        error: "Only the host may edit settings of the room"
      });
    }
  } else {
    socket.emit(Protocol.ENCOUNTERED_ERROR, {
      type: ErrorProtocol.ERR_CHANGE_SETTING,
      error: "Value for spawn delay was not within bounds"
    });
  }
};

const handleSetPowerUps = (socket, value) => {
  if (value === true || value === false) {
    const user = getUser(socket.id);
    const room = getRoom(user.room_id);
    if (userIsHost(user, room)) {
      if (room.gameStarted) {
        return socket.emit(Protocol.ENCOUNTERED_ERROR, {
          type: ErrorProtocol.ERR_PERMISSIONS,
          error: "Cannot edit settings while game is in progress"
        });
      }
      room.setPowerUps(value);
      room.sendUpdate();
    } else {
      socket.emit(Protocol.ENCOUNTERED_ERROR, {
        type: ErrorProtocol.ERR_PERMISSIONS,
        error: "Only the host may edit settings of the room"
      });
    }
  } else {
    socket.emit(Protocol.ENCOUNTERED_ERROR, {
      type: ErrorProtocol.ERR_CHANGE_SETTING,
      error: "Invalid value for power ups"
    });
  }
};

const handleSetAllowSpectators = (socket, value) => {
  if (value === true || value === false) {
    const user = getUser(socket.id);
    const room = getRoom(user.room_id);
    if (userIsHost(user, room)) {
      if (room.gameStarted) {
        return socket.emit(Protocol.ENCOUNTERED_ERROR, {
          type: ErrorProtocol.ERR_PERMISSIONS,
          error: "Cannot edit settings while game is in progress"
        });
      }
      room.setAllowSpectate(value);
      room.sendUpdate();
    } else {
      socket.emit(Protocol.ENCOUNTERED_ERROR, {
        type: ErrorProtocol.ERR_PERMISSIONS,
        error: "Only the host may edit settings of the room"
      });
    }
  } else {
    socket.emit(Protocol.ENCOUNTERED_ERROR, {
      type: ErrorProtocol.ERR_CHANGE_SETTING,
      error: "Invalid value for spectate setting"
    });
  }
};

const handleSwitchToPlayer = (socket, id) => {
  const moveUser = getUser(id);
  const requestUser = getUser(socket.id);
  const room = getRoom(moveUser.room_id);
  if (room.gameStarted) return socket.emit(Protocol.ENCOUNTERED_ERROR, {
    type: ErrorProtocol.ERR_PERMISSIONS,
    error: "Cannot switch to Player while game is in progress"
  });
  if (room.playerList.length >= room.MAX_PLAYERS) return socket.emit(Protocol.ENCOUNTERED_ERROR, {
    type: ErrorProtocol.ERR_PERMISSIONS,
    error: "Players list is full"
  }); 
  if (userIsHost(requestUser, room) || socket.id === id) { //If requester is host, or the user requested to change themselves
    const removedSpectator = room.remSpectator(id);
    if (removedSpectator) {
      room.addPlayer(removedSpectator)
      room.sendUpdate();
    }
  }
}

const handleSwitchToSpectator = (socket, id) => {
  const moveUser = getUser(id);
  const requestUser = getUser(socket.id);
  const room = getRoom(moveUser.room_id);
  if (room.gameStarted) return socket.emit(Protocol.ENCOUNTERED_ERROR, {
    type: ErrorProtocol.ERR_PERMISSIONS,
    error: "Cannot switch to Spectator while game is in progress"
  });
  if (userIsHost(requestUser, room) || socket.id === id) { //If requester is host, or the user requested to change themselves
    const removedPlayer = room.remPlayer(id);
    if (removedPlayer) {
      room.addSpectator(removedPlayer)
      room.sendUpdate();
    }
  }
}

module.exports = {
  handleCreateRoom,
  handleJoinRoom,
  handleSetSpawnDelay,
  handleSetMaxWordLength,
  handleSetMinWordLength,
  handleSetPowerUps,
  handleSetAllowSpectators,
  handleSwitchToPlayer,
  handleSwitchToSpectator
};
