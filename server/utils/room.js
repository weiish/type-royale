const shortid = require("shortid");
const MAX_PLAYERS = 7;
var rooms = [];

class Room {
  constructor(hostID, onSendRoomData) {
    this.id = shortid.generate(); //Room name
    this.playerList = []; //List of player objects which contain the socket id and username
    this.spectatorList = [];
    this.settings = {
      spawnDelay: 5,
      maxWordLength: 10,
      minWordLength: 2,
      powerUps: false,
      allowSpectate: true
    };
    this.gameStarted = false;
    this.game_id = null;
    this.hostID = hostID;
    this.MAX_PLAYERS = MAX_PLAYERS;
    this.lastWinner = 'Nobody';
    this.lastWinnerID = '';
    this.lastGame = null;
    this.onSendRoomData = onSendRoomData;
    this.endGame = this.endGame.bind(this);
  }

  startGame(game_id) {
    if (!this.gameStarted) {
      this.game_id = game_id;
      this.gameStarted = true;
      this.lastGame = null;
    }
  }

  isFull() {
    return (this.playerList.length >= this.MAX_PLAYERS)
  }

  endGame(winner, winner_id, game) {
    this.lastGame = game;
    this.gameStarted = false;
    this.game_id = null;
    this.lastWinner = winner;
    this.lastWinnerID = winner_id;
    this.sendUpdate();
  }

  generateRoomPacket() {
    return Object.assign({}, this, {sendRoomData: undefined});
  }

  sendUpdate() {
    this.onSendRoomData(this.id, this.generateRoomPacket());
  }

  addPlayer(playerObject) {
    this.playerList.push(playerObject);
  }

  selectRandomNewHost() {
    const randomIndex = Math.floor(Math.random() * this.playerList.length);
    this.hostID = this.playerList[randomIndex].id;
    this.sendUpdate();
  }

  remPlayer(playerID) {
    const player_index = this.playerList.findIndex(player => {
      return player.id === playerID;
    });
  
    if (player_index !== -1) {
      return this.playerList.splice(player_index, 1)[0];
    } else {
      return;
    }
  }

  addSpectator(playerObject) {
    this.spectatorList.push(playerObject);
  }

  remSpectator(playerID) {
    const player_index = this.spectatorList.findIndex(player => {
      return player.id === playerID;
    });
  
    if (player_index !== -1) {
      return this.spectatorList.splice(player_index, 1)[0];
    } else {
      return;
    }
  }

  setHost(playerID) {
    this.hostID = playerID;
  }

  setSpawnDelay(value) {
    this.settings.spawnDelay = value;
  }

  setMaxWordLength(value) {
    this.settings.maxWordLength = value;
  }

  setMinWordLength(value) {
    this.settings.minWordLength = value;
  }

  setPowerUps(value) {
    this.settings.powerUps = value;
  }

  setAllowSpectate(value) {
    this.settings.allowSpectate = value;
  }
}

const createRoom = (hostSocketID, onSendRoomData) => {
  let newRoom = new Room(hostSocketID, onSendRoomData);
  rooms.push(newRoom);
  return newRoom;
};

const deleteRoom = room_id => {
  const room_index = rooms.findIndex(room => {
    return room.id === room_id;
  });

  if (room_index !== -1) {
    return rooms.splice(room_index, 1);
  } else {
    return { error: "Could not find room to delete" };
  }
};

const getRoom = room_id => {
  return rooms.find(room => {
    return room.id === room_id;
  });
};

module.exports = { Room, createRoom, deleteRoom, getRoom };
