import React from "react";
import { connect } from "react-redux";
import {switchToPlayer} from "../store/room/actions"

class PlayerList extends React.Component {
  renderList() {
    if (!this.props.playerList) return <p>Empty</p>;
    const playerList = this.props.playerList.map(player => {
      return (
        <li className="player-list__li" key={player.id}>
          {player.username}
        </li>
      );
    });
    return <ul className="player-list__ul">{playerList}</ul>;
  }

  renderButton() {
    const me = this.props.playerList.find(player => {
      return player.id === this.props.id;
    });
    if (!me) {
      return <button className="button player-list__button" onClick={() => this.props.switchToPlayer(this.props.id)}>Swap</button>;
    }
    return;
  }

  render() {
    return (
      <div className="player-list">
        <div className="player-list__header-container">
          <h2 className="player-list__header">Players</h2>
          {this.renderButton()}
        </div>
        {this.renderList()}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    playerList: state.room.room.playerList,
    id: state.connection.user_id
  };
};

const mapDispatchToProps = dispatch => {
    return {
        switchToPlayer: id => dispatch(switchToPlayer(id))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(PlayerList);
