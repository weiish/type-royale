const { Game, createGame, deleteGame, getGame } = require('./game')
const { Room, createRoom, deleteRoom, getRoom } = require("./room");
const {
    addUser,
    removeUser,
    setUsername,
    setUserRoom,
    getUser,
    getUsersInRoom
  } = require("./users");
  const { generateMessage } = require("./messages");
  const Protocol = require("../constants/Protocol.js");
  const ErrorProtocol = require("../constants/ErrorProtocol.js");

const handleStartNewGame = (socket, io, room_id) => {

    const onSendTimeUpdates = (timePacket) => {
        io.to(room_id).emit(Protocol.TIME_UPDATE, timePacket)
    }

    const onSendGameState = (gameState) => {
        io.to(room_id).emit(Protocol.GAME_STATE, gameState);
    }

    const onSendPlayerInputs = (playerInputs) => {
        io.to(room_id).emit(Protocol.PLAYER_INPUT, playerInputs);
    }

    const sendMessage = (message) => {
        io.to(room_id).emit(Protocol.MESSAGE, generateMessage("SYSTEM", message))
    }

    let room = getRoom(room_id);
    

    let newGame = createGame(room, onSendTimeUpdates, onSendGameState, onSendPlayerInputs, sendMessage);
    newGame.startGame()
    room.startGame(newGame.id)

    return {newGame, updatedRoom: room}
}

module.exports = {handleStartNewGame}


