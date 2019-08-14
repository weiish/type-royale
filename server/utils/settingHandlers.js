const { Room, createRoom, deleteRoom, getRoom } = require("./room");
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

const handleSetSpawnDelay = (socket, io, value) => {
  if (value >= 1 && value <= 10) {
    const user = getUser(socket.id);
    const room = getRoom(user.room_id);
    if (userIsHost(user, room)) {
      room.setSpawnDelay(value);
      io.to(room.id).emit(Protocol.ROOM_DATA, room);
    } else {
      socket.emit(Protocol.ENCOUNTERED_ERROR, {
        type: ErrorProtocol.ERR_CHANGE_SETTING,
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

const handleSetMaxWordLength = (socket, io, value) => {
    const user = getUser(socket.id);
    const room = getRoom(user.room_id);

    if (value >= room.settings.minWordLength && value <= 10) {
      if (userIsHost(user, room)) {
        room.setMaxWordLength(value);
        io.to(room.id).emit(Protocol.ROOM_DATA, room);
      } else {
        socket.emit(Protocol.ENCOUNTERED_ERROR, {
          type: ErrorProtocol.ERR_CHANGE_SETTING,
          error: "Only the host may edit settings of the room"
        });
      }
    } else {
      socket.emit(Protocol.ENCOUNTERED_ERROR, {
        type: ErrorProtocol.ERR_CHANGE_SETTING,
        error: "Value for max word length was not within bounds"
      });
    }
  }

  const handleSetMinWordLength = (socket, io, value) => {
    const user = getUser(socket.id);
    const room = getRoom(user.room_id);

    if (value >= 1 && value <= room.settings.maxWordLength) {
      if (userIsHost(user, room)) {
        room.setMinWordLength(value);
        io.to(room.id).emit(Protocol.ROOM_DATA, room);
      } else {
        socket.emit(Protocol.ENCOUNTERED_ERROR, {
          type: ErrorProtocol.ERR_CHANGE_SETTING,
          error: "Only the host may edit settings of the room"
        });
      }
    } else {
      socket.emit(Protocol.ENCOUNTERED_ERROR, {
        type: ErrorProtocol.ERR_CHANGE_SETTING,
        error: "Value for spawn delay was not within bounds"
      });
    }
  }

  const handleSetPowerUps = (socket, io, value) => {
    if (value === true || value === false) {
      const user = getUser(socket.id);
      const room = getRoom(user.room_id);
      if (userIsHost(user, room)) {
        room.setPowerUps(value);
        io.to(room.id).emit(Protocol.ROOM_DATA, room);
      } else {
        socket.emit(Protocol.ENCOUNTERED_ERROR, {
          type: ErrorProtocol.ERR_CHANGE_SETTING,
          error: "Only the host may edit settings of the room"
        });
      }
    } else {
      socket.emit(Protocol.ENCOUNTERED_ERROR, {
        type: ErrorProtocol.ERR_CHANGE_SETTING,
        error: "Invalid value for power ups"
      });
    }
  }

  const handleSetAllowSpectators = (socket, io, value) => {
    if (value === true || value === false) {
      const user = getUser(socket.id);
      const room = getRoom(user.room_id);
      if (userIsHost(user, room)) {
        room.setAllowSpectate(value);
        io.to(room.id).emit(Protocol.ROOM_DATA, room);
      } else {
        socket.emit(Protocol.ENCOUNTERED_ERROR, {
          type: ErrorProtocol.ERR_CHANGE_SETTING,
          error: "Only the host may edit settings of the room"
        });
      }
    } else {
      socket.emit(Protocol.ENCOUNTERED_ERROR, {
        type: ErrorProtocol.ERR_CHANGE_SETTING,
        error: "Invalid value for spectate setting"
      });
    }
  }

module.exports = {
    handleSetSpawnDelay,
    handleSetMaxWordLength,
    handleSetMinWordLength,
    handleSetPowerUps,
    handleSetAllowSpectators
}