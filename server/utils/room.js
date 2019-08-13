class Room {
    constructor(id, hostID) {
        this.id = id; //Room name
        this.playerList = []; //List of socket.io IDs that are in this game
        this.settings = {};
        this.gameStarted = false;
        this.gameState = {};
        this.hostID = hostID;
    }

    addPlayer(playerObject) {
        this.playerList.push(playerObject)
    }
    
    remPlayer(playerID) {
        this.playerList = this.playerList.filter((player) => {
            return player.id !== playerID
        })
    }

    setHost(playerID) {
        this.hostID = playerID;
    }
}

module.exports = Room