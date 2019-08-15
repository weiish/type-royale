import React, { Component } from "react";
import { connect } from "react-redux";

class GamePlayer extends Component {
  constructor(props) {
    super(props);
    this.renderWordList = this.renderWordList.bind(this);
  }

  renderWordList() {
    return this.props.gameState[this.props.id].words.map((word, index) => {
      <p key={index}>word</p>;
    });
  }

  render() {
    return (
      <div>
        <h1>{this.props.gameState[this.props.id].name}</h1>
        <h2>{this.props.gameState[this.props.id].status}</h2>
        {this.renderWordList()}
        <input type="text" placeholder="Type words here!" />
        <button>Send Word</button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    gameState: state.game.room.gameState,
    id: state.connection.user_id
  };
};
export default connect(mapStateToProps)(GamePlayer);
