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
} from "../store/game/actions";

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
      <li>
        Spawn Delay: {this.props.spawnDelay}
        <InputRange
          maxValue={10}
          minValue={1}
          value={this.props.spawnDelay}
          onChange={value => this.props.setSpawnDelay(value)}
          disabled={!this.isHost()}
        />
      </li>
    );
  }

  renderWordLength() {
    return (
      <li>
        Word Length: Min: {this.props.minWordLength} Max:{" "}
        {this.props.maxWordLength}
        <InputRange
          maxValue={10}
          minValue={1}
          value={{
            min: this.props.minWordLength,
            max: this.props.maxWordLength
          }}
          onChange={value => {
            this.props.setMinWordLength(value.min);
            this.props.setMaxWordLength(value.max);
          }}
          disabled={!this.isHost()}
        />
      </li>
    );
  }

  renderPowerUps() {
    let checkBox;
    if (this.isHost()) {
      checkBox = (
        <input
          onClick={() => this.props.setPowerUps(!this.props.powerUps)}
          type="checkbox"
          value="Power Ups"
        />
      );
    }
    return (
      <li>
        Power Ups: {this.props.powerUps ? "On" : "Off"}
        {checkBox}
      </li>
    );
  }

  renderSpectator() {
    let checkBox;
    if (this.isHost()) {
      checkBox = (
        <input
          onClick={() =>
            this.props.setAllowSpectators(!this.props.allowSpectate)
          }
          type="checkbox"
          value="Power Ups"
          visibility={this.isHost() ? "visible" : "hidden"}
        />
      );
    }
    return (
      <li>
        Allow Spectators: {this.props.allowSpectate ? "On" : "Off"}
        {checkBox}
      </li>
    );
  }

  render() {
    return (
      <div>
        <h1>Settings</h1>
        <ul>
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
  } = state.game.room.settings;

  const hostID = state.game.room.hostID;
  const myID = state.connection.user_id;

  return {
    spawnDelay,
    maxWordLength,
    minWordLength,
    powerUps,
    allowSpectate,
    hostID,
    myID
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
