import React, { Component } from "react";
import { connect } from "react-redux";

class GamePlayer extends Component {
  render() {
    return (
      <div>
        <h1>Settings</h1>
        <ul>
            <li>Spawn Delay: {this.props.settings.spawnDelay}</li>
            <li>Max Word Length: {this.props.settings.maxWordLength}</li>
            <li>Min Word Length: {this.props.settings.minWordLength}</li>
            <li>Power Ups: {this.props.settings.powerUps ? 'On' : 'Off'}</li>
            <li>Allow Spectators: {this.props.settings.allowSpectators ? 'On' : 'Off'}</li>
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
    return {settings: state.game.room.settings}
}
export default connect(mapStateToProps)(GamePlayer);
