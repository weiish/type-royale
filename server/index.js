const express = require("express");
const app = express();
const server = require("http").Server(app);
const {
  addUser,
  removeUser,
  setUsername,
  setUserRoom,
  getUser,
  getUsersInRoom
} = require("./utils/users");
const { generateMessage } = require("./utils/messages");
const io = require("socket.io").listen(server);
const Protocol = require("./constants/Protocol.js");
const ErrorProtocol = require("./constants/ErrorProtocol.js");
const { Room, createRoom, deleteRoom, getRoom } = require("./utils/room");
const {
  handleSetSpawnDelay,
  handleSetMaxWordLength,
  handleSetMinWordLength,
  handleSetPowerUps,
  handleSetAllowSpectators
} = require("./utils/settingHandlers");


io.on("connection", socket => {
  console.log("a user connected: ", socket.id);
  socket.emit(Protocol.ON_CONNECTED, socket.id);
  addUser({ id: socket.id });

  socket.on(Protocol.MESSAGE, message => {
    //Get room of current user
    const user = getUser(socket.id)
    io.to(user.room_id).emit(Protocol.MESSAGE, generateMessage(user.username, message))
  })

  socket.on(Protocol.SET_SPAWN_DELAY, value =>
    handleSetSpawnDelay(socket, io, value)
  );

  socket.on(Protocol.SET_MAX_WORD_LENGTH, value =>
    handleSetMaxWordLength(socket, io, value)
  );

  socket.on(Protocol.SET_MIN_WORD_LENGTH, value =>
    handleSetMinWordLength(socket, io, value)
  );

  socket.on(Protocol.SET_POWER_UPS, value =>
    handleSetPowerUps(socket, io, value)
  );

  socket.on(Protocol.SET_ALLOW_SPECTATORS, value =>
    handleSetAllowSpectators(socket, io, value)
  );

  socket.on(Protocol.SET_USERNAME, username => {
    console.log("Setting socket id", socket.id, "username to", username);
    setUsername(socket.id, username);
  });

  socket.on(Protocol.CREATE_ROOM, () => {
    console.log("Server got Create Room Request from socket id:", socket.id);
    let newRoom = createRoom(socket.id);
    setUserRoom(socket.id, newRoom.id);
    const user = getUser(socket.id);
    newRoom.addPlayer(user);
    socket.join(newRoom.id);
    socket.emit(Protocol.ROOM_DATA, newRoom);
  });

  socket.on(Protocol.JOIN_ROOM, (username, room_id) => {
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
      existingRoom.addPlayer(user);
      socket.join(existingRoom.id);
      io.to(room_id).emit(Protocol.ROOM_DATA, existingRoom);
      socket.broadcast.to(room_id).emit(Protocol.SYSTEM_MESSAGE, generateMessage('System', `${user.username} has joined.`))
    }
  });

  socket.on("join", ({ username, room }, callback) => {
    //Callback is for telling the client that the server processed their 'join' event
    const { error, user } = addUser({ id: socket.id, username, room });
    if (error) {
      return callback(error);
    }

    socket.join(user.room);
    socket.emit(
      "message",
      generateMessage("System", `Welcome to the room, ${user.username}`)
    );
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room)
    });
    callback();
  });

  socket.on("disconnect", () => {
    console.log("a user has disconnected", socket.id);
    //Check if user was in any channels
    const user = getUser(socket.id);
    const room = getRoom(user.room_id)
    if (room) {
      socket.broadcast.to(room.id).emit(Protocol.SYSTEM_MESSAGE, generateMessage('System', `${user.username} has left.`))
      socket.leave(room.id)
      room.remPlayer(socket.id);
      if (room.playerList.length === 0) {
        deleteRoom(room.id)  
      } else {
        io.to(room.id).emit(Protocol.ROOM_DATA, room);
      }
    }
    removeUser(socket.id);
  });
});

//Check for new connections
//  When a new connection appears, assign them to THE "room"
//      Show them a list of available games
//      Allow them to create a game or join a game
//
//      On joining a game
//          Show them the other users in that room
//          Update the room (for other players) and for the room display
//      On starting a game
//          Remove game from joinable list, change to a "started" status
//          Move all players to the "game UI"
//          Randomize player attack order, send this list to all players
//          Initiate countdown for all players
//      On leaving a game
//          Remove player from list, boot em back to the main room
//          Update the room (for other players) and for the room display\
//
//

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Listening on port ${server.address().port}`);
});
