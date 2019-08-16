import React, { Component } from "react";
import { connect } from "react-redux";
import PlayerList from "./PlayerList";
import GameSettings from "./GameSettings";
import GameChat from "./GameChat";
import GameOtherPlayer from "./GameOtherPlayer";
import GamePlayer from "./GamePlayer";

import { startGame } from "../store/game/actions";

class GameRoom extends Component {
  renderPlayers() {
    let content = [];
    if (this.props.game.gameStarted) {
      for (let player_id in this.props.game.playerStates) {
        if (player_id !== this.props.id) {
          content.push(<GameOtherPlayer id={player_id} />);
        }
      }
    } else {
      for (let i = 0; i < this.props.room.room.playerList.length - 1; i++) {
        console.log('Pushing another player')
        content.push(<GameOtherPlayer />)
      }
    }
    return content;
  }

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
        <h3>Time: {this.props.game.elapsedTime / 1000}</h3>
        <h3>Spawn: {this.props.game.timeUntilSpawn / 1000}</h3>
        <button onClick={this.props.startGame}>Start Game</button>
        {this.renderPlayers()}
        <GamePlayer />
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
    game: state.game,
    id: state.connection.user_id
  };
};

const mapDispatchToProps = dispatch => {
  return { startGame: () => dispatch(startGame()) };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameRoom);
