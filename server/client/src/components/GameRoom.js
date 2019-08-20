import React, { Component } from "react";
import { connect } from "react-redux";
import PlayerList from "./PlayerList";
import SpectatorList from "./SpectatorList";
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
          content.push(<GameOtherPlayer key={player_id} id={player_id} />);
        }
      }
    } else {
      const playerList = this.props.room.room.playerList;
      for (let i = 0; i < playerList.length; i++) {
        if (playerList[i].id !== this.props.id) {
          content.push(
            <GameOtherPlayer key={playerList[i].id} id={playerList[i].id} />
          );
        }
      }
    }
    return <div className="game-other-player-wrapper">{content}</div>;
  }

  copyInviteLink = () => {
    navigator.clipboard.writeText(`${window.location.hostname}/?room=${this.props.room.room.id}`)
  }

  renderGameHeader() {
    return (
      <div className="game-room__header">
          <div className="game-room__room-info">
            <h1 className="game-room__title">Room:</h1>
            <h1 className="game-room__id">{this.props.room.room.id}</h1>
            <button className="button game-room__button" onClick={this.copyInviteLink}>
              Copy Link
            </button>
            <button className="button game-room__button" onClick={this.props.startGame}>
              Start Game
            </button>
          </div>
          <div className="game-room__game-info">
            <h1 className="game-status__status">
              Status:{" "}
              {this.props.room.room.gameStarted
                ? "In Progress"
                : "Waiting for players"}
            </h1>
            <h1 className="game-status__elapsed-time">
              Time: {this.props.game.elapsedTime / 1000}
            </h1>
            <h1 className="game-status__spawn-time">
              Spawn: {this.props.game.timeUntilSpawn / 1000}
            </h1>
          </div>
        </div>
    )
  }

  render() {
    return (
      <div className="game-room__container">
        {this.renderGameHeader()}
        <div className="game-container">
          <div className="column">
            <div className="game-player-spectator-container">
              <PlayerList />
              <SpectatorList />
            </div>

            <GameSettings />
            <GameChat />
          </div>
          <GamePlayer />
          <div className="column-3">{this.renderPlayers()}</div>
        </div>
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
