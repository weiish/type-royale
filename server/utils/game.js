const shortid = require("shortid");
const MAX_WORD_LIST_LENGTH = 30;
const INITIAL_WORD_LIST_LENGTH = 10;
const PLAYER_STATUS_ALIVE = "Alive";
const PLAYER_STATUS_DEAD = "Dead";
const PLAYER_STATUS_DISCONNECTED = "Disconnected";
const { generateRandomWord } = require("./words");
var games = [];

class Game {
  constructor(room, sendTimeUpdates, sendGameState, sendPlayerInputs, sendMessage) {
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
        order: null,
        lastAttacker: ""
      };
    });
    this.settings = room.settings;
    this.gameStarted = room.gameStarted;
    this.startTime = null;
    this.elapsedTime = null;
    this.timeUntilSpawn = null;
    this.winner = null;
    this.timeInterval = 1000;
    this.timer = undefined;
    this.sendTimeUpdates = sendTimeUpdates;
    this.sendGameState = sendGameState;
    this.sendPlayerInputs = sendPlayerInputs;
    this.onGameEnd = room.endGame;
    this.recurseTimer = this.recurseTimer.bind(this);
    this.endGame = this.endGame.bind(this);
    this.sendMessage = sendMessage;
  }

  handlePlayerSendWord(player_id) {
    if (this.playerStates[player_id].status === PLAYER_STATUS_ALIVE) {
      const currentInput = this.playerStates[player_id].input
        .trim()
        .toLowerCase();
      const removedWord = this.tryRemWordFromPlayer(player_id, currentInput);
      this.playerStates[player_id].input = "";
      if (removedWord) {
        //Generate word of equal length and send to target player
        const targetList = this.playerList.filter(player => {
          return ((player.id !== player_id) && (this.playerStates[player.id].status === PLAYER_STATUS_ALIVE));
        });
        const targetPlayerIndex = Math.floor(Math.random() * targetList.length);
        const randomWord = generateRandomWord(removedWord[0].length);

        this.addWordToPlayer(targetList[targetPlayerIndex].id, randomWord, this.playerStates[player_id].username);
      }
      this.sendGameState(this.generateGameStatePacket());
    }
  }

  addWordToPlayer(player_id, word, lastAttacker) {
    const isAlive = this.checkPlayerStatus(player_id);
    if (isAlive) {
      this.playerStates[player_id].words.push(word)
      this.playerStates[player_id].lastAttacker = lastAttacker;
    };
  }

  tryRemWordFromPlayer(player_id, word) {
    const index = this.playerStates[player_id].words.indexOf(word);
    if (index > -1) {
      return this.playerStates[player_id].words.splice(index, 1);
    } else {
      return null;
    }
  }

  updatePlayerInput(player_id, input) {
    //Add checks for cheating here by comparing previous input to current input
    if (this.playerStates[player_id].status === PLAYER_STATUS_ALIVE) {
      this.playerStates[player_id].input = input;
      this.sendGameState(this.generateGameStatePacket());
    }
  }

  checkPlayerStatus(player_id) {
    if (this.playerStates[player_id].words.length >= MAX_WORD_LIST_LENGTH) {
      //Player Lost
      this.playerStates[player_id].status = PLAYER_STATUS_DEAD;
      this.sendMessage(`${this.playerStates[player_id].username} was killed by ${this.playerStates[player_id].lastAttacker}`);
      this.checkWinner();
      return false;
    }
    return true;
  }

  checkWinner() {
    let deadCount = 0;
    let alivePlayerId;
    for (var id in this.playerStates) {
      if (this.playerStates[id].status === PLAYER_STATUS_DEAD || this.playerStates[id].status === PLAYER_STATUS_DISCONNECTED) {
        deadCount++;
      } else {
        alivePlayerId = id;
      }
    }
    if (deadCount === Object.keys(this.playerStates).length - 1) {
      //End game, we have a winner
      this.endGame();
      this.winner = alivePlayerId;
      this.playerStates[alivePlayerId].status = "Winner"
      this.sendMessage(`${this.playerStates[alivePlayerId].username} has won!`)
      this.onGameEnd(this.playerStates[alivePlayerId].username, alivePlayerId, this);
      //TODO Play game over animation
    }
    this.sendGameState(this.generateGameStatePacket());
  }

  disconnectPlayer(player_id) {
    if (player_id in this.playerStates) {
      this.playerStates[player_id].status = PLAYER_STATUS_DISCONNECTED;
      this.checkWinner();
    }
  }

  startGame() {
    console.log("Game ", this.id, "started!");
    this.sendMessage('A new game is starting!')
    this.generateInitialLists();
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

  generateInitialLists() {
    let initialWords = [];
    for (let i = 0; i < INITIAL_WORD_LIST_LENGTH; i++) {
      let randomLength = randomNumber(
        this.settings.minWordLength,
        this.settings.maxWordLength
      );
      initialWords.push(generateRandomWord(randomLength));
    }
    for (let player_id in this.playerStates) {
      this.playerStates[player_id].words = [...initialWords];
    }
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
    let randomWordLength = randomNumber(
      this.settings.minWordLength,
      this.settings.maxWordLength
    );
    while (randomWordLength === 26 || randomWordLength === 30)
      randomWordLength = randomNumber(
        this.settings.minWordLength,
        this.settings.maxWordLength
      );

    for (var player_id in this.playerStates) {
      if (this.playerStates[player_id].status === PLAYER_STATUS_ALIVE) {
        let word = generateRandomWord(randomWordLength);
        this.addWordToPlayer(player_id, word, "the word spawner");
      }
    }
    this.sendGameState(this.generateGameStatePacket());
  }
}

const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const createGame = (room, sendTimeUpdates, sendGameState, sendPlayerInputs, sendMessage) => {
  let newGame = new Game(
    room,
    sendTimeUpdates,
    sendGameState,
    sendPlayerInputs,
    sendMessage
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
