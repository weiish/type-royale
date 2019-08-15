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
    room.playerList.forEach(player => {
      this.playerStates[player.id] = {
        username: player.username,
        words: [],
        status: PLAYER_STATUS_ALIVE,
        input: ""
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

  addWordToPlayer(player_id, word) {
    this.playerState[player_id].words.push(word);
  }

  remWordFromPlayer(player_id, word) {
    const index = this.playerState[player_id].words.indexOf(word);
    if (index > -1) {
      this.playerState[player_id].words.splice(index, 1);
    }
  }

  updatePlayerInput(player_id, input) {
    this.playerState[player_id].input = input;
  }

  checkPlayerStatus(player_id) {
    if (this.playerState[player_id].words.length > MAX_WORD_LIST_LENGTH) {
      //Player Lost
      this.playerState[player_id].status = PLAYER_STATUS_DEAD;
    }
  }

  startGame() {
    console.log("Game ", this.id, "started!");
    this.gameStarted = true;
    this.startTimer();
  }

  endGame() {
    this.gameStarted = false;
    this.stopTimer();
  }

  onTimerTick() {
    //Everytime the second clicks
    // Check if it is time to add a new word to all ALIVE players
    // Update the timer and send an update to all players
    this.sendTimeUpdates(this.elapsedTime, this.timeUntilSpawn);
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
    console.log("Spawning words");
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
