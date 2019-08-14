const shortid = require("shortid");

var rooms = [];

class Room {
  constructor(id, hostID) {
    this.id = id; //Room name
    this.playerList = []; //List of socket.io IDs that are in this game
    this.settings = {
      spawnDelay: 5,
      maxWordLength: 10,
      minWordLength: 2,
      powerUps: false,
      allowSpectate: false
    };
    this.gameStarted = false;
    this.gameState = {};
    this.hostID = hostID;
  }

  addPlayer(playerObject) {
    this.playerList.push(playerObject);
  }

  remPlayer(playerID) {
    this.playerList = this.playerList.filter(player => {
      return player.id !== playerID;
    });
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

const createRoom = socketID => {
  let newRoom = new Room(shortid.generate(), socketID);
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
