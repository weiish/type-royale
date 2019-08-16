import React, { Component } from "react";
import { connect } from "react-redux";

class GameOtherPlayer extends Component {
  constructor(props) {
    super(props);
    this.renderWordList = this.renderWordList.bind(this);
  }

  renderWordList() {
    if (this.props.gameStarted) {
      return this.props.playerStates[this.props.id].words.map((word, index) => {
        return <p key={index}>{word}</p>;
      });
    } else {
      return <p>Other player word list</p>;
    }
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
          <h1>Other Player</h1>
        </div>
      );
    }
  }

  renderPlayerInput() {
    if (this.props.gameStarted) {
      return (
        <input
          type="text"
          placeholder="Type words here!"
          value={this.props.playerStates[this.props.id].input}
          disabled={true}
        />
      );
    } else {
      return (
        <input
          type="text"
          placeholder="Type words here!"
          disabled={true}
        />
      );
    }
  }

  render() {
    return (
      <div id={this.props.id}>
        {this.renderPlayerHeader()}
        {this.renderWordList()}
        {this.renderPlayerInput()}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    playerStates: state.game.playerStates,
    gameStarted: state.game.gameStarted
  };
};
export default connect(mapStateToProps)(GameOtherPlayer);
