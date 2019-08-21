import React, { Component } from "react";
import { connect } from "react-redux";
import { sendPlayerInput, sendWord } from "../store/game/actions";

class GamePlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: ""
    };
    this.renderWordList = this.renderWordList.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleSend = this.handleSend.bind(this);
  }

  renderWordList() {
    let playerStates;
    if (this.props.gameStarted) {
      playerStates = this.props.playerStates;
    } else if (this.props.lastGame) {
      if (this.props.id in this.props.lastGame.playerStates) {
        playerStates = this.props.lastGame.playerStates;
      } else {
        return <p className="gamePlayer__word">Words list</p>;
      }
    } else {
      return <p className="gamePlayer__word">Words list</p>;
    }
    return playerStates[this.props.id].words.map((word, index) => {
      return this.getHighlightedText(index, word, this.state.input);
    });
  }

  getHighlightedText(index, text, highlight) {
    let parts = text.split(new RegExp(`^(${highlight})`, "gi"));
    return (
      <p className="gamePlayer__word" key={index}>
        {parts.map((part, i) => {
          if (part.length > 0) {
            return (
              <span
                key={i}
                className={
                  part.toLowerCase() === highlight.toLowerCase()
                    ? "gamePlayer__word__highlighted"
                    : ""
                }
              >
                {part}
              </span>
            );
          }
        })}
      </p>
    );
  }

  renderPlayerHeader() {
    let playerStates;
    if (this.props.gameStarted) {
      console.log("Game Started Rendering");
      playerStates = this.props.playerStates;
    } else if (this.props.lastGame) {
      console.log("Last Game Rendering");

      if (this.id in this.props.lastGame.playerStates) {
        playerStates = this.props.lastGame.playerStates;
      } else {
        return (
          <div className="gamePlayer-header">
            <h1 className="gamePlayer-header__name">
              {this.props.username}
            </h1>
          </div>
        );
      }
    } else {
      return (
        <div className="gamePlayer-header">
          <h1 className="gamePlayer-header__name">
            {this.props.username}
          </h1>
        </div>
      );
    }

    return (
      <div className="gamePlayer-header">
        <h1 className="gamePlayer-header__name">
          {playerStates[this.props.id].username}
        </h1>
        <h1 className="gamePlayer-header__word_count">
          {playerStates[this.props.id].words.length}/30
        </h1>
        <h1 className="gamePlayer-header__status">
          {playerStates[this.props.id].status}
        </h1>
      </div>
    );
  }

  renderPlayerInput() {
    return (
      <div className="gamePlayer-input">
        <form className="gamePlayer-input__form" onSubmit={this.handleSend}>
          <input
            className="gamePlayer-input__input"
            onChange={this.handleInput}
            type="text"
            placeholder="Type words here!"
            value={this.state.input}
          />
          <button className="button">Send Word</button>
        </form>
      </div>
    );
  }

  handleInput(e) {
    if (!this.props.gameStarted) {
      return;
    }
    if (!e.target.value.match(/[^a-zA-Z]/)) {
      this.setState({
        input: e.target.value
      });
      this.props.sendPlayerInput(e.target.value);
    }
  }

  handleSend(e) {
    e.preventDefault();
    if (this.state.input.length > 0 && this.props.gameStarted) {
      this.props.sendWord();
      this.setState({
        input: ""
      });
    }
  }

  render() {
    let winnerStyle = "";
    if (this.props.lastGame) {
      winnerStyle =
        this.props.id === this.props.lastGame.winner
          ? " gamePlayer-winner"
          : "";
    }

    if (this.props.playerList.find(({ id }) => id === this.props.id)) {
      return (
        <div className={"gamePlayer column" + winnerStyle}>
          {this.renderPlayerHeader()}
          <div className="gamePlayer__word-list">{this.renderWordList()}</div>

          {this.renderPlayerInput()}
        </div>
      );
    } else {
      return <div />;
    }
  }
}

const mapStateToProps = state => {
  return {
    playerList: state.room.room.playerList,
    gameStarted: state.game.gameStarted,
    playerStates: state.game.playerStates,
    id: state.connection.user_id,
    username: state.connection.username,
    lastGame: state.room.room.lastGame
  };
};

const mapDispatchToProps = dispatch => {
  return {
    sendPlayerInput: input => dispatch(sendPlayerInput(input)),
    sendWord: () => dispatch(sendWord())
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GamePlayer);
