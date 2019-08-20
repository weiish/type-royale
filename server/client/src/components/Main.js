import React, { Component } from "react";
import { createRoom, joinRoom } from "../store/room/actions";
import { connectSocket, setUsername } from "../store/socket/actions";
import { errorHandled } from "../store/errors/actions"
import { connect } from "react-redux";
import { getQueryStringValue } from '../helper/urlHandler';
import * as ErrorProtocol from '../constants/ErrorProtocol'

class Main extends Component {
  constructor(props) {
    super(props);
    const room_id = getQueryStringValue('room');
    this.state = { 
      name: "", 
      connecting: false, 
      create_game: false, 
      join_game: (room_id!==""), 
      name_error: "",
      room_id
    };
    this.handleNameInput = this.handleNameInput.bind(this);
    this.handleRoomInput = this.handleRoomInput.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleJoin = this.handleJoin.bind(this);
    this.checkConnecting = this.checkConnecting.bind(this);
    this.handleShowJoin = this.handleShowJoin.bind(this);
    this.handleShowCreateGame = this.handleShowCreateGame.bind(this);
    this.handleGoBack = this.handleGoBack.bind(this);
    this.usernameError = this.usernameError.bind(this);
  }

  handleCreate() {
    const name_error = this.usernameError();
    if (name_error) {
      return this.setState({
        name_error
      })
    }
    this.setState({ connecting: false });
    if (!this.props.connection.connected) {
      this.props.connectSocket(process.env.IO_URL);
    }
    this.props.setUsername(this.state.name);
    this.props.createRoom(this.state.name);
    this.setState({ connecting: true });
  }

  checkConnecting() {
    return this.state.connecting;
  }

  handleJoin() {
    this.props.errorHandled(ErrorProtocol.ERR_TYPE_JOIN_ROOM);
    const name_error = this.usernameError();
    this.setState({
      name_error
    })
    if (name_error) return;
    
    if (!this.props.connection.connected) {
      this.props.connectSocket(process.env.IO_URL);
    }
    this.props.setUsername(this.state.name);
    
    this.props.joinRoom(this.state.room_id);
  }

  handleShowJoin() {
    this.setState({
      join_game: true
    })
  }

  handleShowCreateGame() {
    this.setState({
      create_game: true
    })
  }

  
  handleGoBack() {
    this.setState({
      join_game: false,
      create_game: false      
    })
  }
  
  usernameError() {
    const input = this.state.name
    if (!input.length) return "Empty username";
    const regex = /[^a-zA-Z0-9]/g;
    if (input.match(regex) !== null) {
      return "Spaces and special characters are invalid";
    }
    if(input.length > 15) return "Username too long (15 characters max)";
    if (input.toLowerCase() === "system") return "Username of \'System\' is not allowed";
    return "";
  }

  handleNameInput(e) {
    this.setState({
      name: e.target.value
    });
  }

  handleRoomInput(e) {
    this.setState({
      room_id: e.target.value
    });
  }


  renderMainButtons() {
      return (
        <div className="main-button-wrapper">
          <button
            className="main-button"
            disabled={this.checkConnecting()}
            onClick={this.handleShowCreateGame}
          >
            {!this.checkConnecting() ? "Create Game" : "Connecting..."}
          </button>
          <button
            className="main-button"
            disabled={this.checkConnecting()}
            onClick={this.handleShowJoin}
          >
            Join Game
          </button>
        </div>
      );
    
  }

  renderNameField() {
    return (
      <input
            className="main-input__input"
            onChange={this.handleNameInput}
            type="text"
            value={this.state.name}
            placeholder="Enter your name"
            maxLength="15"
          />
    )
  }

  renderRoomField() {
    return (
      <input
            className="main-input__input"
            onChange={this.handleRoomInput}
            type="text"
            value={this.state.room_id}
            placeholder="Enter the room access code"
            maxLength="15"
          />
    )
  }

  renderBackGoButtons(isCreateGame) {
    let onClickGo;
    if (isCreateGame) {
      onClickGo = this.handleCreate;
    } else {
      onClickGo = this.handleJoin;
    }

    return (
      <div className="main-button-wrapper">
        <button
          className="main-button"
          disabled={this.checkConnecting()}
          onClick={this.handleGoBack}
        >
          Back
        </button>
        <button
          className="main-button"
          disabled={this.checkConnecting()}
          onClick={onClickGo}
        >
          Go!
        </button>
      </div>
    );
  }

  renderLogic() {
    if (this.state.create_game) {
      return (
        <div className="main-input">
          <h1 className="main-text">Create Game</h1>
          {this.renderNameField()}
          {this.renderBackGoButtons(true)}
          <div className="main-error">{this.state.name_error}</div>
        </div>
      )
    } else if (this.state.join_game) {
      return (
        <div className="main-input">
          <h1 className="main-text">Join Game</h1>
          {this.renderNameField()}
          {this.renderRoomField()}
          {this.renderBackGoButtons(false)}
          <div className="main-error">{this.props.join_error}</div>
          <div className="main-error">{this.state.name_error}</div>
        </div>
      )
    } else {
      return (
        <div className="main-input">
          {this.renderMainButtons()}
        </div>
      )
    }
  }

  render() {
    return (
      <div className="container">
          {this.renderLogic()}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    connection: state.connection,
    join_error: state.error[ErrorProtocol.ERR_TYPE_JOIN_ROOM]
  }
}

const mapDispatchToProps = dispatch => ({
  createRoom: user => dispatch(createRoom(user)),
  connectSocket: user => dispatch(connectSocket(user)),
  joinRoom: (user, room_id) => dispatch(joinRoom(user, room_id)),
  setUsername: username => dispatch(setUsername(username)),
  errorHandled: (errorType) => dispatch(errorHandled(errorType))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);
