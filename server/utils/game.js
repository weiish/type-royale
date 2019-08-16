const shortid = require("shortid");
const MAX_WORD_LIST_LENGTH = 30;
const PLAYER_STATUS_ALIVE = "alive";
const PLAYER_STATUS_DEAD = "dead";
var games = [];

/*
    Each player needs...
        Socket ID    - for easily finding which player object to update
        User name    - for displayed name in player block
        Words        - for holding words in their list
        Input        - for holding the current input of that user
    */

/*
    Game Object OUTGOING Traffix
        Send Time updates to all users per tick
            to update clocks
        Send Player State updates to all users (userName, wordList, isAlive)
            when a user sends a word
            when new words are generated to all users
            when a user dies
        Send Player inputs to all users 
            when a user inputs something (LAG?!)
            every time tick
            OPTIONAL: this might cause a lot of unnecessary traffic, need to test it
        Send Game state to all users 
            when game starts
            when game is done

    Game Object INCOMING Traffic
        Player updates their input
            Whenever a user types something (might need to NOT do this if too much traffic/lag)
        Player SENDS a word
            Whenever a user hits spacebar/enter to "send" their current input
    */

class Game {
  constructor(room, sendTimeUpdates, sendGameState, sendPlayerInputs) {
    this.id = shortid.generate();
    this.room_id = room.id;
    this.playerStates = {};
    this.playerList = room.playerList;
    room.playerList.forEach(player => {
      this.playerStates[player.id] = {
        username: player.username,
        words: [],
        status: PLAYER_STATUS_ALIVE,
        input: "",
        order: null
      };
    });
    this.settings = room.settings;
    this.gameStarted = room.gameStarted;
    this.startTime = null;
    this.elapsedTime = null;
    this.timeUntilSpawn = null;
    this.timeInterval = 1000;
    this.timer = undefined;
    this.sendTimeUpdates = sendTimeUpdates;
    this.sendGameState = sendGameState;
    this.sendPlayerInputs = sendPlayerInputs;
    this.recurseTimer = this.recurseTimer.bind(this);
  }

  handlePlayerSendWord(player_id) {
    if (this.playerStates[player_id].status === PLAYER_STATUS_ALIVE) {
      const currentInput = this.playerStates[player_id].input.trim().toLowerCase()
      const removedWord = this.tryRemWordFromPlayer(player_id, currentInput);
      this.playerStates[player_id].input = ''
      if (removedWord) {
        //Generate word of equal length and send to target player
        const targetList = this.playerList.filter(player => {
          return player.id !== player_id
        })
        const targetPlayerIndex = Math.floor(Math.random() * targetList.length)
        
        this.addWordToPlayer(targetList[targetPlayerIndex].id, 'attack');
      } 
      this.sendGameState(this.generateGameStatePacket())
    }
  }

  addWordToPlayer(player_id, word) {
    this.playerStates[player_id].words.push(word);
    this.checkPlayerStatus(player_id);
  }

  tryRemWordFromPlayer(player_id, word) {
    const index = this.playerStates[player_id].words.indexOf(word);
    if (index > -1) {
      return this.playerStates[player_id].words.splice(index, 1);
    } else {
      return null
    }
  }

  updatePlayerInput(player_id, input) {
    //Add checks for cheating here by comparing previous input to current input
    console.log('Updating player input to be ',input)
    if (this.playerStates[player_id].status === PLAYER_STATUS_ALIVE) {
      this.playerStates[player_id].input = input;
      this.sendGameState(this.generateGameStatePacket())
    }
  }

  checkPlayerStatus(player_id) {
    if (this.playerStates[player_id].words.length > MAX_WORD_LIST_LENGTH) {
      //Player Lost
      this.playerStates[player_id].status = PLAYER_STATUS_DEAD;
    }
  }

  startGame() {
    console.log("Game ", this.id, "started!");
    this.gameStarted = true;
    this.startTimer();
    this.sendGameState(this.generateGameStatePacket());
  }

  shufflePlayers() {
    //Shuffle player order numbers ()
  }

  generateGameStatePacket() {
    return {
      //What should be sent to all players in a game state packet?
      playerStates: this.playerStates,
      gameStarted: this.gameStarted
    };
  }

  generateTimePacket() {
    return {
      elapsedTime: this.elapsedTime,
      timeUntilSpawn: this.timeUntilSpawn
    };
  }

  endGame() {
    this.gameStarted = false;
    this.stopTimer();
  }

  onDelete() {
    this.endGame();
  }

  onTimerTick() {
    //Everytime the second clicks
    // Check if it is time to add a new word to all ALIVE players
    // Update the timer and send an update to all players
    this.sendTimeUpdates(this.generateTimePacket());
  }

  recurseTimer() {
    //Timer that adjusts itself so that it follows system clock as closely as possible
    this.elapsedTime += this.timeInterval;
    this.timeUntilSpawn -= this.timeInterval;
    if (this.timeUntilSpawn <= 0) {
      this.spawnWords();
      this.timeUntilSpawn = this.settings.spawnDelay * 1000;
    }
    this.onTimerTick();
    const diff = new Date().getTime() - this.startTime - this.elapsedTime;
    if (this.gameStarted === true)
      //this.timer = setTimeout(this.recurseTimer(), this.timeInterval - diff);
      this.timer = setTimeout(this.recurseTimer, 1000);
  }

  startTimer() {
    this.timer = setTimeout(this.recurseTimer, this.timeInterval);
    this.timeUntilSpawn = this.settings.spawnDelay * 1000;
  }

  stopTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
  }

  spawnWords() {
    const maxLength = this.settings.maxWordLength;

    for (var player_id in this.playerStates) {
      if (this.playerStates[player_id].status === PLAYER_STATUS_ALIVE) {
        let word = "asdf";
      this.addWordToPlayer(player_id, word);
      }
      
    }
    this.sendGameState(this.generateGameStatePacket());
  }

  getState() {
    return {};
  }
}

const createGame = (room, sendTimeUpdates, sendGameState, sendPlayerInputs) => {
  let newGame = new Game(
    room,
    sendTimeUpdates,
    sendGameState,
    sendPlayerInputs
  );
  games.push(newGame);
  return newGame;
};

const deleteGame = game_id => {
  const game_index = games.findIndex(game => {
    return game.id === game_id;
  });

  if (game_index !== -1) {
    //Stop any timers in the game
    games[game_index].onDelete();
    return games.splice(game_index, 1);
  } else {
    return { error: "Could not find game to delete" };
  }
};

const getGame = game_id => {
  return games.find(game => {
    return game.id === game_id;
  });
};

module.exports = { Game, createGame, deleteGame, getGame };
