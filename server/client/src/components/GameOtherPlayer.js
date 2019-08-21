import React, { Component } from "react";
import { connect } from "react-redux";

class GameOtherPlayer extends Component {
  constructor(props) {
    super(props);
    this.renderWordList = this.renderWordList.bind(this);
  }

  renderWordList() {
    let playerStates;
    console.log(
      "Game started?",
      this.props.gameStarted,
      "Last game?",
      this.props.lastGame
    );
    if (this.props.gameStarted) {
      playerStates = this.props.playerStates;
    } else if (this.props.lastGame) {
      playerStates = this.props.lastGame.playerStates;
    } else {
      return <p className="gameOtherPlayer__word">Other player word list</p>;
    }

    return playerStates[this.props.id].words.map((word, index) => {
      return (
        <p className="gameOtherPlayer__word" key={index}>
          {word}
        </p>
      );
    });
  }

  renderPlayerHeader() {
    let playerStates;
    let statusStyle = "";
    if (this.props.gameStarted) {
      playerStates = this.props.playerStates;
      statusStyle = this.getStatusStyle(playerStates);
    } else if (this.props.lastGame) {
      playerStates = this.props.lastGame.playerStates;
      statusStyle = this.getStatusStyle(playerStates);
    } else {
      return (
        <div className="gameOtherPlayer-header">
          <h1 className="gameOtherPlayer-header__name">
            {
              this.props.playerList.find(({ id }) => id === this.props.id)
                .username
            }
          </h1>
        </div>
      );
    }

    return (
      <div className="gameOtherPlayer-header">
        <h1 className="gameOtherPlayer-header__name">
          {playerStates[this.props.id].username}
        </h1>
        <h1 className="gameOtherPlayer-header__word_count">
          {playerStates[this.props.id].words.length}/30
        </h1>
        <h2 className={"gameOtherPlayer-header__status" + statusStyle}>
          {playerStates[this.props.id].status}
        </h2>
      </div>
    );
  }

  renderPlayerInput() {
    let playerStates;
    if (this.props.gameStarted) {
      playerStates = this.props.playerStates;
    } else if (this.props.lastGame) {
      playerStates = this.props.lastGame.playerStates;
    } else {
      return (
        <form className="gameOtherPlayer-input">
          <input
            className="gameOtherPlayer-input__input"
            type="text"
            placeholder="Other Player Input..."
            disabled={true}
          />
        </form>
      );
    }
    return (
      <form className="gameOtherPlayer-input">
        <input
          className="gameOtherPlayer-input__input"
          type="text"
          placeholder="Other Player Input..."
          value={playerStates[this.props.id].input}
          disabled={true}
        />
      </form>
    );
  }

  getStatusStyle(playerStates) {
    switch (playerStates[this.props.id].status) {
      case "Alive":
        return " gameOtherPlayer-alive";
      case "Dead":
        return " gameOtherPlayer-dead";
      case "Disconnected":
        return " gameOtherPlayer-disconnected";
      default:
        return "";
    }
  }

  render() {
    let winnerStyle = "";
    let statusStyle = "";
    if (!this.props.gameStarted && this.props.lastGame) {
      winnerStyle =
        this.props.id === this.props.winner ? " gameOtherPlayer-winner" : "";
      statusStyle = this.getStatusStyle(this.props.lastGame.playerStates);
    }

    if (this.props.gameStarted) {
      statusStyle = this.getStatusStyle(this.props.playerStates);
    }

    return (
      <div className={"gameOtherPlayer" + winnerStyle + statusStyle} key={this.props.key}>
        {this.renderPlayerHeader()}
        <div className="gameOtherPlayer__word-list">
          {this.renderWordList()}
        </div>

        {this.renderPlayerInput()}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    playerList: state.room.room.playerList,
    playerStates: state.game.playerStates,
    lastGame: state.room.room.lastGame,
    gameStarted: state.game.gameStarted
  };
};
export default connect(mapStateToProps)(GameOtherPlayer);
