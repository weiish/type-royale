import React, { Component } from "react";
import { connect } from "react-redux";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";
import {
  setSpawnDelay,
  setMaxWordLength,
  setMinWordLength,
  setPowerUps,
  setAllowSpectators
} from "../store/room/actions";

class GameSettings extends Component {
  constructor(props) {
    super(props);
    this.isHost = this.isHost.bind(this);
    this.renderSpawnDelay = this.renderSpawnDelay.bind(this);
    this.renderWordLength = this.renderWordLength.bind(this);
  }
  isHost() {
    return this.props.hostID === this.props.myID;
  }

  renderSpawnDelay() {
    return (
      <li className="game-settings__spawn-delay">
        Spawn Delay: {this.props.spawnDelay}
        <InputRange
          className="game-settings__spawn-delay-input"
          maxValue={10}
          minValue={1}
          value={this.props.spawnDelay}
          onChange={value => this.props.setSpawnDelay(value)}
          disabled={!this.isHost() || this.props.gameStarted}
        />
      </li>
    );
  }

  renderWordLength() {
    return (
      <li className="game-settings__word-length">
        Word Length: Min: {this.props.minWordLength} Max:{" "}
        {this.props.maxWordLength}
        <InputRange
          className="game-settings__word-length-input"
          maxValue={25}
          minValue={1}
          value={{
            min: this.props.minWordLength,
            max: this.props.maxWordLength
          }}
          onChange={value => {
            this.props.setMinWordLength(value.min);
            this.props.setMaxWordLength(value.max);
          }}
          disabled={!this.isHost() || this.props.gameStarted}
        />
      </li>
    );
  }

  renderPowerUps() {
    let checkBox;
    if (this.isHost() && !this.props.gameStarted) {
      checkBox = (
        <input
          className="game-settings__power-up-input"
          onChange={() => this.props.setPowerUps(!this.props.powerUps)}
          type="checkbox"
          value="Power Ups"
          checked={this.props.powerUps}
        />
      );
    }
    return (
      <li className="game-settings__power-up">
        Power Ups: {this.props.powerUps ? "On" : "Off"}
        {checkBox}
      </li>
    );
  }

  renderSpectator() {
    let checkBox;
    if (this.isHost() && !this.props.gameStarted) {
      checkBox = (
        <input
          className="game-settings__spectator-input"
          onChange={() =>
            this.props.setAllowSpectators(!this.props.allowSpectate)
          }
          type="checkbox"
          value="Power Ups"
          visibility={this.isHost() ? "visible" : "hidden"}
          checked={this.props.allowSpectate}
        />
      );
    }
    return (
      <li className="game-settings__spectator">
        Allow Spectators: {this.props.allowSpectate ? "On" : "Off"}
        {checkBox}
      </li>
    );
  }

  render() {
    return (
      <div className="game-settings">
        <h1 className="game-settings__header">Settings</h1>
        <ul className="game-settings__ul">
          {this.renderSpawnDelay()}
          {this.renderWordLength()}
          {this.renderPowerUps()}
          {this.renderSpectator()}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const {
    spawnDelay,
    maxWordLength,
    minWordLength,
    powerUps,
    allowSpectate
  } = state.room.room.settings;

  const gameStarted = state.room.room.gameStarted;
  const hostID = state.room.room.hostID;
  const myID = state.connection.user_id;

  return {
    spawnDelay,
    maxWordLength,
    minWordLength,
    powerUps,
    allowSpectate,
    hostID,
    myID,
    gameStarted
  };
};

const mapDispatchToProps = dispatch => ({
  setSpawnDelay: value => dispatch(setSpawnDelay(value)),
  setMaxWordLength: value => dispatch(setMaxWordLength(value)),
  setMinWordLength: value => dispatch(setMinWordLength(value)),
  setPowerUps: value => dispatch(setPowerUps(value)),
  setAllowSpectators: value => dispatch(setAllowSpectators(value))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameSettings);
