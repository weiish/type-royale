import React, { Component } from "react";
import { connect } from "react-redux";
import PlayerList from "./PlayerList";
import GameSettings from "./GameSettings";
import GameChat from "./GameChat";

import { startGame } from "../store/game/actions";

class GameRoom extends Component {
  render() {
    return (
      <div>
        <h1>Game Room</h1>
        <h2>Room ID: {this.props.room.room.id}</h2>
        <h3>
          Status:{" "}
          {this.props.room.room.gameStarted
            ? "In Progress"
            : "Waiting for players"}
        </h3>
        <h3>Time: {this.props.game.elapsedTime/1000}</h3>
        <h3>Spawn: {this.props.game.timeUntilSpawn/1000}</h3>
        <button onClick={this.props.startGame}>Start Game</button>
        <GameSettings />
        <PlayerList />
        <GameChat />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    room: state.room,
    game: state.game
  };
};

const mapDispatchToProps = dispatch => {
  return { startGame: () => dispatch(startGame()) };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameRoom);
