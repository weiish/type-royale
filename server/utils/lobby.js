class Lobby {
    constructor(id, hostID) {
        this.id = id; //Room name
        this.playerList = [hostID]; //List of socket.io IDs that are in this game
        this.settings = {};
        this.gameStarted = false;
        this.gameState = {};
        this.hostID = hostID;
    }

    addPlayer(playerID) {
        this.playerList.push(playerID)
    }
    
    remPlayer(playerID) {
        this.playerList = this.playerList.filter((existingID) => {
            return existingID !== playerID
        })
    }

    setHost(playerID) {
        this.hostID = playerID;
    }
}

module.exports = Lobby