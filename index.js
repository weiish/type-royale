const express = require("express");
const app = express();

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

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
const { Game, createGame, deleteGame, getGame } = require("./utils/game");
const {
  handleCreateRoom,
  handleJoinRoom,
  handleSetSpawnDelay,
  handleSetMaxWordLength,
  handleSetMinWordLength,
  handleSetPowerUps,
  handleSetAllowSpectators,
  handleSwitchToPlayer,
  handleSwitchToSpectator
} = require("./utils/roomHandlers");

const { handleStartNewGame } = require("./utils/gameHandlers");

const userIsHost = (user, room) => {
  return user.id === room.hostID;
};

io.on("connection", socket => {
  console.log("a user connected: ", socket.id);
  socket.emit(Protocol.ON_CONNECTED, socket.id);
  addUser({ id: socket.id });

  socket.on(Protocol.START_GAME, () => {
    const user = getUser(socket.id);
    const room = getRoom(user.room_id);
    if (!userIsHost(user, room)) {
      return socket.emit(Protocol.ENCOUNTERED_ERROR, {
        type: ErrorProtocol.ERR_PERMISSIONS,
        error: "Only Host may start the game"
      });
    }

    if (room.playerList.length < 2) {
      return socket.emit(Protocol.ENCOUNTERED_ERROR, {
        type: ErrorProtocol.ERR_PERMISSIONS,
        error: "Not enough players to start the game"
      });
    }

    if (room.gameStarted)
      return socket.emit(Protocol.ENCOUNTERED_ERROR, {
        type: ErrorProtocol.ERR_PERMISSIONS,
        error: "A game is currently in session"
      });
    const { newGame, updatedRoom } = handleStartNewGame(socket, io, room.id);
    io.to(room.id).emit(Protocol.ROOM_DATA, updatedRoom);
  });

  socket.on(Protocol.MESSAGE, message => {
    //Get room of current user
    const user = getUser(socket.id);
    io.to(user.room_id).emit(
      Protocol.MESSAGE,
      generateMessage(user.username, message)
    );
  });

  socket.on(Protocol.PLAYER_INPUT, input => {
    const user = getUser(socket.id);
    const room = getRoom(user.room_id);
    const game = getGame(room.game_id);
    if (game) {
      game.updatePlayerInput(user.id, input);
    }
  });

  socket.on(Protocol.SEND_WORD, () => {
    const user = getUser(socket.id);
    const room = getRoom(user.room_id);
    const game = getGame(room.game_id);
    if (game) {
      game.handlePlayerSendWord(user.id);
    }
  });

  //Room - Spawn Delay Setting
  socket.on(Protocol.SET_SPAWN_DELAY, value =>
    handleSetSpawnDelay(socket, value)
  );
  //Room - Max Word Length Setting
  socket.on(Protocol.SET_MAX_WORD_LENGTH, value =>
    handleSetMaxWordLength(socket, value)
  );
  //Room - Min Word Length Setting
  socket.on(Protocol.SET_MIN_WORD_LENGTH, value =>
    handleSetMinWordLength(socket, value)
  );
  //Room - Power ups Setting
  socket.on(Protocol.SET_POWER_UPS, value => handleSetPowerUps(socket, value));
  //Room - Spectators Setting
  socket.on(Protocol.SET_ALLOW_SPECTATORS, value =>
    handleSetAllowSpectators(socket, value)
  );

  socket.on(Protocol.SWITCH_TO_PLAYER, id => handleSwitchToPlayer(socket, id));

  socket.on(Protocol.SWITCH_TO_SPECTATOR, id =>
    handleSwitchToSpectator(socket, id)
  );

  socket.on(Protocol.SET_USERNAME, username => {
    console.log("Setting socket id", socket.id, "username to", username);
    setUsername(socket.id, username);
  });
  //Room - Create
  socket.on(Protocol.CREATE_ROOM, () => handleCreateRoom(socket, io));
  //Room - Join
  socket.on(Protocol.JOIN_ROOM, room_id => handleJoinRoom(socket, room_id));

  socket.on("disconnect", () => {
    console.log("a user has disconnected", socket.id);
    //Check if user was in any channels
    const user = getUser(socket.id);
    const room = getRoom(user.room_id);
    if (room) {
      socket.broadcast
        .to(room.id)
        .emit(
          Protocol.MESSAGE,
          generateMessage("SYSTEM", `${user.username} has left.`)
        );
      socket.leave(room.id);
      room.remPlayer(socket.id);

      if (room.playerList.length === 0) {
        //Delete game object in game if any existed
        console.log("Room is empty! Deleting Game and Room");
        deleteGame(room.gameID);
        deleteRoom(room.id);
      } else {
        if (room.gameStarted) {
          const game = getGame(room.game_id);
          game.disconnectPlayer(user.id);
        }

        if (socket.id === room.hostID) {
          room.selectRandomNewHost();
          io.to(room.id).emit(
            Protocol.MESSAGE,
            generateMessage(
              "SYSTEM",
              "The host has left, selecting a random new host"
            )
          );
        }
        io.to(room.id).emit(Protocol.ROOM_DATA, room);
      }
    }
    removeUser(socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Listening on port ${server.address().port}`);
});
