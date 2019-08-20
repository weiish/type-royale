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
    if (this.props.gameStarted) {
      return this.props.playerStates[this.props.id].words.map((word, index) => {
        return this.getHighlightedText(index, word, this.state.input);
      });
    } else {
      return <p className="gamePlayer__word">Words list</p>;
    }
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
    if (this.props.gameStarted) {
      return (
        <div className="gamePlayer-header">
          <h1 className="gamePlayer-header__name">
            {this.props.playerStates[this.props.id].username + " (YOU)"}
          </h1>
          <h1 className="gamePlayer-header__word_count">
            {this.props.playerStates[this.props.id].words.length}/30
          </h1>
          <h1 className="gamePlayer-header__status">
            {this.props.playerStates[this.props.id].status}
          </h1>
        </div>
      );
    } else {
      return (
        <div className="gamePlayer-header">
          <h1 className="gamePlayer-header__name">
            {this.props.username + " (YOU)"}
          </h1>
        </div>
      );
    }
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
    if (this.props.playerList.find(({id}) => id === this.props.id)) {
      return (
        <div className="gamePlayer column">
          {this.renderPlayerHeader()}
          <div className="gamePlayer__word-list">{this.renderWordList()}</div>
  
          {this.renderPlayerInput()}
        </div>
      );
    } else {
      return (
        <div></div>
      )
    }
    
  }
}

const mapStateToProps = state => {
  return {
    playerList: state.room.room.playerList,
    gameStarted: state.game.gameStarted,
    playerStates: state.game.playerStates,
    id: state.connection.user_id,
    username: state.connection.username
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
