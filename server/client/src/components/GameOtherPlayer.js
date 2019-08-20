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
        return (
          <p className="gameOtherPlayer__word" key={index}>
            {word}
          </p>
        );
      });
    } else {
      return <p className="gameOtherPlayer__word">Other player word list</p>;
    }
  }

  renderPlayerHeader() {
    if (this.props.gameStarted) {
      return (
        <div className="gameOtherPlayer-header">
          <h1 className="gameOtherPlayer-header__name">
            {this.props.playerStates[this.props.id].username}
          </h1>
          <h1 className="gameOtherPlayer-header__word_count">
            {this.props.playerStates[this.props.id].words.length}/30
          </h1>
          <h2 className="gameOtherPlayer-header__status">
            {this.props.playerStates[this.props.id].status}
          </h2>
        </div>
      );
    } else {
      return (
        <div className="gameOtherPlayer-header">
          <h1 className="gameOtherPlayer-header__name">{this.props.playerList.find(({id}) => id===this.props.id).username}</h1>
        </div>
      );
    }
  }

  renderPlayerInput() {
    if (this.props.gameStarted) {
      return (
        <form className="gameOtherPlayer-input">
          <input
            className="gameOtherPlayer-input__input"
            type="text"
            placeholder="Other Player Input..."
            value={this.props.playerStates[this.props.id].input}
            disabled={true}
          />
        </form>
      );
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
  }

  render() {
    return (
      <div className="gameOtherPlayer" key={this.props.key}>
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
    gameStarted: state.game.gameStarted
  };
};
export default connect(mapStateToProps)(GameOtherPlayer);
