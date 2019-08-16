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

  _handleKeyDown = e => {
    if (e.key === "Enter") {
      this.handleSend();
    }
  };

  renderWordList() {
    if (this.props.gameStarted) {
      return this.props.playerStates[this.props.id].words.map((word, index) => {
        return this.getHighlightedText(index, word, this.state.input);
      });
    } else {
      return <p>Words list</p>;
    }
  }

  getHighlightedText(index, text, highlight) {
    let parts = text.split(new RegExp(`^(${highlight})`, "gi"));
    return (
      <p key={index}>
        {parts.map((part, i) => {
          if (part.length > 0) {
            return (
              <span
                key={i}
                style={
                  part.toLowerCase() === highlight.toLowerCase()
                    ? { fontWeight: "bold" }
                    : {}
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
        <div>
          <h1>{this.props.playerStates[this.props.id].username}</h1>
          <h2>{this.props.playerStates[this.props.id].status}</h2>
        </div>
      );
    } else {
      return (
        <div>
          <h1>{this.props.username}</h1>
        </div>
      );
    }
  }

  renderPlayerInput() {
    if (this.props.gameStarted) {
      return (
        <input
          onKeyDown={this._handleKeyDown}
          onChange={this.handleInput}
          type="text"
          placeholder="Type words here!"
          value={this.state.input}
        />
      );
    } else {
      return <input type="text" placeholder="Type words here!" />;
    }
  }

  handleInput(e) {
    this.setState({
      input: e.target.value
    });
    console.log("New input is ", e.target.value);
    this.props.sendPlayerInput(e.target.value);
  }

  handleSend() {
    if (this.state.input.length > 0) {
      this.props.sendWord();
      this.setState({
        input: ""
      });
    }
  }

  render() {
    return (
      <div>
        {this.renderPlayerHeader()}
        {this.renderWordList()}
        {this.renderPlayerInput()}
        <button onClick={this.handleSend}>Send Word</button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
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
