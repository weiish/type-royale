import React, { Component } from "react";
import { Link } from "react-router-dom";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = { name: "" };
    this.handleInput = this.handleInput.bind(this);
  }

  renderButtons() {
    if (this.validInput(this.state.name)) {
      return (
        <div>
          <Link to="/create">Create Game</Link>
          <Link to="/join">Join Game</Link>
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

export default Main;
