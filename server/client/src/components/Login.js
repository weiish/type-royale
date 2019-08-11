import React from "react";
import { connect } from "react-redux";
import * as actions from "../actions";

class Login extends React.Component {
   constructor(props) {
     super(props);
     this.state = {username: ""}
     this.handleUsernameChange = this.handleUsernameChange.bind(this)
   }

  componentDidUpdate() {
      if (this.props.connection !== null) {
        this.props.history.push('/lobby')
      }
  }

  handleUsernameChange(e) {
    this.setState({username: e.target.value})
  }

  renderContent() {
    const {username} = this.state
    switch (this.props.connection) {
      case null:
        return (
          <div>
            <h1>Please choose a username</h1>
            <input onChange={this.handleUsernameChange} type="text" placeholder="Username"></input>
            <button onClick={() => this.props.connectIO(username)}>Connect</button>
          </div>
        );
      default:
            return (
                <div>
                  <p>You are connected!</p>
                </div>
              );
    }
  }

  render() {
    return (
      <div>
        <header className="Login-header">{this.renderContent()}</header>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    connection: state.connection
  };
}

export default connect(
  mapStateToProps,
  actions
)(Login);
