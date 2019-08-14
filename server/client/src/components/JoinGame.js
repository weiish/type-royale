import React, { Component } from "react";
import { connect } from "react-redux";
import { joinRoom } from "../store/game/actions";
import { connectSocket } from "../store/socket/actions";

class JoinGame extends Component {
  constructor(props) {
    super(props);
    this.handleInput = this.handleInput.bind(this);
    this.handleJoin = this.handleJoin.bind(this);
    this.renderError = this.renderError.bind(this);
  }

  handleInput(e) {
    this.setState({
      code: e.target.value
    });
  }

  handleJoin() {
    console.log("Sending join request with user=",this.props.user,'and room=',this.state.code);    
    this.props.joinRoom(this.props.user, this.state.code);
  }

  renderError() {
    if (this.props.error !== null) {
      return <p>Invalid room id!</p>;
    }
  }

  render() {
    return (
      <div>
        <h1>Join Game</h1>
        <h2>Welcome {this.props.user}</h2>
        <input
          onChange={this.handleInput}
          type="text"
          placeholder="Room Code"
        />
        <button onClick={this.handleJoin}>Join</button>
        {this.renderError()}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.connection.username,
    error: state.error.join_room
  };
};

const mapDispatchToProps = dispatch => ({
  joinRoom: (user, room_id) => dispatch(joinRoom(user, room_id)),
  connectSocket: user => dispatch(connectSocket(user))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JoinGame);
