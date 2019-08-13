import React, { Component } from "react";
import {createRoom} from '../store/game/actions'
import { connectSocket } from '../store/socket/actions'; 
import {connect} from 'react-redux'

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = { name: "" };
    this.handleInput = this.handleInput.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
  }

  handleCreate() {
    console.log('Handling Create Room, current name is...',this.state.name)
    this.props.connectSocket(this.state.name)
    this.props.createRoom(this.state.name)
  }

  validInput(input) {
    if (!input) return false;
    const regex = /[^a-zA-Z0-9]/g;
    if (input.match(regex) !== null) {
      return false;
    }
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
        <div>
          <button onClick={this.handleCreate}>Create Game</button>
          <button>Join Game</button>
        </div>
      );
    } else {
      return (
        <div>
          <p>Please enter a valid username (No special characters or spaces)</p>
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        <h1>Type Royale</h1>
        <input
          onChange={this.handleInput}
          type="text"
          placeholder="Enter your name"
        />
        {this.renderButtons()}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
    createRoom: (user) => dispatch(createRoom(user)),
    connectSocket: (user) => dispatch(connectSocket(user))
})

export default connect(null, mapDispatchToProps)(Main);
