import React, { Component } from "react";
import { createRoom, showJoinPage } from "../store/room/actions";
import { connectSocket, setUsername } from "../store/socket/actions";
import { connect } from "react-redux";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = { name: "", connecting: false };
    this.handleInput = this.handleInput.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleJoin = this.handleJoin.bind(this);
    this.checkConnecting = this.checkConnecting.bind(this);
  }

  handleCreate() {
    console.log("Handling Create Room, current name is...", this.state.name);
    this.setState({ connecting: false });
    this.props.connectSocket();
    this.props.setUsername(this.state.name);
    this.props.createRoom(this.state.name);
    this.setState({ connecting: true });
  }

  checkConnecting() {
    return this.state.connecting;
  }

  handleJoin() {
    console.log("Handling Join Room Page... current name is ", this.state.name);
    this.props.connectSocket();
    this.props.setUsername(this.state.name);
    this.props.showJoinPage(true);
  }

  validInput(input) {
    if (!input) return false;
    const regex = /[^a-zA-Z0-9]/g;
    if (input.match(regex) !== null) {
      return false;
    }
    if(input.length > 15) return false;
    if (input.toLowerCase() === "system") return false;
    return true;
  }

  handleInput(e) {
    this.setState({
      name: e.target.value
    });
  }

  renderButtons() {
    if (this.validInput(this.state.name)) {
      return (
        <div className="main-button-wrapper">
          <button
            className="main-button"
            disabled={this.checkConnecting()}
            onClick={this.handleCreate}
          >
            {!this.checkConnecting() ? "Create Game" : "Connecting..."}
          </button>
          <button
            className="main-button"
            disabled={this.checkConnecting()}
            onClick={this.handleJoin}
          >
            Join Game
          </button>
        </div>
      );
    } else {
      return (
        <div className="main-input">
          <p className="main-text">No special characters or spaces</p>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="container">
        <div className="main-input">
          <input
            className="main-input__input"
            onChange={this.handleInput}
            type="text"
            placeholder="Enter your name"
            maxLength="15"
          />
          <div className="break" />
          {this.renderButtons()}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  createRoom: user => dispatch(createRoom(user)),
  connectSocket: user => dispatch(connectSocket(user)),
  showJoinPage: (value) => dispatch(showJoinPage(value)),
  setUsername: username => dispatch(setUsername(username))
});

export default connect(
  null,
  mapDispatchToProps
)(Main);
