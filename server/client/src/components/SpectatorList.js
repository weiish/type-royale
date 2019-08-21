import React from "react";
import { connect } from "react-redux";
import {switchToSpectator} from "../store/room/actions"

class SpectatorList extends React.Component {
  renderList() {
    if (!this.props.spectatorList) return <p>Empty</p>;
    const spectatorList = this.props.spectatorList.map(player => {
      return (
        <li className="player-list__li" key={player.id}>
        {(player.id === this.props.hostID) ? "⭐" : ""}{(player.id === this.props.lastWinnerID) ? "🥇" : ""}{player.username}
        </li>
      );
    });
    return <ul className="player-list__ul">{spectatorList}</ul>;
  }

  renderButton() {
    const me = this.props.spectatorList.find(player => {
      return player.id === this.props.id;
    });
    if (!me) {
      return <button className="button player-list__button" onClick={() => this.props.switchToSpectator(this.props.id)} disabled={this.props.gameStarted}>Swap</button>;
    }
    return;
  }

  render() {
    return (
      <div className="player-list">
        <div className="player-list__header-container">
          <h2 className="player-list__header">Spectators</h2>
          {this.renderButton()}
        </div>

        {this.renderList()}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    spectatorList: state.room.room.spectatorList,
    gameStarted: state.room.room.gameStarted,
    lastWinnerID: state.room.room.lastWinnerID,
    id: state.connection.user_id,
    hostID: state.room.room.hostID
  };
};

const mapDispatchToProps = dispatch => {
    return {
        switchToSpectator: id => dispatch(switchToSpectator(id))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(SpectatorList);
