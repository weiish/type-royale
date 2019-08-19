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

const handleCreateRoom = socket => {
  console.log("Server got Create Room Request from socket id:", socket.id);
  let newRoom = createRoom(socket.id);
  setUserRoom(socket.id, newRoom.id);
  const user = getUser(socket.id);
  newRoom.addPlayer(user);
  socket.join(newRoom.id);
  socket.emit(Protocol.ROOM_DATA, newRoom);
};

const handleJoinRoom = (socket, io, username, room_id) => {
  console.log(
    `Server got Join Room Request, username=${username} room_id=${room_id}`
  );
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
    if (existingRoom.isFull()) {
      existingRoom.addSpectator(user);
    } else {
      existingRoom.addPlayer(user);
    }
    
    socket.join(existingRoom.id);
    io.to(room_id).emit(Protocol.ROOM_DATA, existingRoom);
    socket.broadcast
      .to(room_id)
      .emit(
        Protocol.MESSAGE,
        generateMessage("SYSTEM", `${user.username} has joined.`)
      );
  }
};

const handleSetSpawnDelay = (socket, io, value) => {
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
      io.to(room.id).emit(Protocol.ROOM_DATA, room);
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

const handleSetMaxWordLength = (socket, io, value) => {
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
      io.to(room.id).emit(Protocol.ROOM_DATA, room);
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

const handleSetMinWordLength = (socket, io, value) => {
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
      io.to(room.id).emit(Protocol.ROOM_DATA, room);
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

const handleSetPowerUps = (socket, io, value) => {
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
      io.to(room.id).emit(Protocol.ROOM_DATA, room);
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

const handleSetAllowSpectators = (socket, io, value) => {
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
      io.to(room.id).emit(Protocol.ROOM_DATA, room);
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

module.exports = {
  handleCreateRoom,
  handleJoinRoom,
  handleSetSpawnDelay,
  handleSetMaxWordLength,
  handleSetMinWordLength,
  handleSetPowerUps,
  handleSetAllowSpectators
};
