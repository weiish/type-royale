import React from "react";
import { connect } from "react-redux";
import { connectSocket } from '../store/socket/actions'; 

class Login extends React.Component {
   constructor(props) {
     super(props);
     this.state = {username: ""}
     this.handleUsernameChange = this.handleUsernameChange.bind(this)
   }

  componentDidUpdate() {
      if (this.props.connection.connected === true) {
        this.props.history.push('/lobby')
      }
  }

  handleUsernameChange(e) {
    this.setState({username: e.target.value})
  }

  renderContent() {
    const {username} = this.state
    switch (this.props.connection.connected) {
      case false:
        return (
          <div>
            <h1>Please choose a username</h1>
            <input onChange={this.handleUsernameChange} type="text" placeholder="Username"></input>
            <button onClick={() => this.props.connectSocket(username)}>Connect</button>
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

const mapStateToProps = (state) => {
    return {
        connection: state.connection
    }
};

const mapDispatchToProps = (dispatch) => ({
    connectSocket: (user) => dispatch(connectSocket(user))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
