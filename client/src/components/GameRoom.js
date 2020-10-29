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
    } else if (this.props.room.lastGame) {
      for (let player_id in this.props.room.lastGame.playerStates) {
        if (player_id !== this.props.id) {
          content.push(<GameOtherPlayer key={player_id} id={player_id} />);
        }
      }
    } else {
      const playerList = this.props.room.playerList;
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
    navigator.clipboard.writeText(
      `https://${window.location.hostname}/?room=${this.props.room.id}`
    );
  };

  renderGameHeader() {
    const renderStart = () => {
      if (this.props.id === this.props.room.hostID) {
        return (
          <button
            className="button game-room__button"
            onClick={this.props.startGame}
            disabled={this.props.room.gameStarted}
          >
            Start Game
          </button>
        );
      } else {
        return;
      }
    };

    return (
      <div className="game-room__header">
        <div className="game-room__room-info">
          <h1 className="game-room__title">Room:</h1>
          <h1 className="game-room__id">{this.props.room.id}</h1>
          <button
            className="button game-room__button"
            onClick={this.copyInviteLink}
          >
            Invite Link
          </button>
          {renderStart()}
        </div>
        <div className="game-room__game-info">
          <div className="game-status__container">
            <h1 className="game-status__label">Status</h1>
            <h1 className="game-status__status">
              {this.props.room.gameStarted
                ? "In Progress"
                : "Waiting for players"}
            </h1>
          </div>

          <div className="game-status__container">
            <h1 className="game-status__label">Time</h1>
            <h1 className="game-status__elapsed-time">
              {this.props.game.elapsedTime / 1000}
            </h1>
          </div>

          <div className="game-status__container">
            <h1 className="game-status__label">Spawn</h1>
            <h1 className="game-status__spawn-time">
              {this.props.game.timeUntilSpawn / 1000}
            </h1>
          </div>

          <div className="game-status__container">
            <h1 className="game-status__label">Last Winner</h1>
            <h1 className="game-status__last-winner">
              {this.props.room.lastWinner}
            </h1>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const renderOverlay = () => {
      if (!this.props.room.gameStarted) {
        return <div className="game-overlay">
        <h1 className="game-overlay__message">Waiting for game to start...</h1>
      </div>
      } else {
        return
      }
    }

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
          <div className="game-playing-area-container">
          {renderOverlay()}
          <GamePlayer />
          <div className="column-3">{this.renderPlayers()}</div>
          </div>
          
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    room: state.room.room,
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
