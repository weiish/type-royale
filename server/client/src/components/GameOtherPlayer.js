import React, { Component } from "react";
import { connect } from "react-redux";

class GameOtherPlayer extends Component {
  render() {
    return (
      <div>
        <h1>Player</h1>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
    return {settings: state.game.room.settings}
}
export default connect(mapStateToProps)(GameOtherPlayer);
