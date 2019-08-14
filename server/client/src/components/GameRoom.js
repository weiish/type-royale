import React, { Component } from "react";
import { connect } from "react-redux";
import PlayerList from "./PlayerList";
import GameSettings from "./GameSettings";
import GameChat from "./GameChat";

class GameRoom extends Component {
  render() {
    return (
      <div>
        <h1>Game Room</h1>
        <h2>Room ID: {this.props.game.room.id}</h2>
        <GameSettings />
        <PlayerList />
        <GameChat />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return state;
};
export default connect(mapStateToProps)(GameRoom);
