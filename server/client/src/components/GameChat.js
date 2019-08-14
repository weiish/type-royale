import React, { Component } from "react";
import { connect } from "react-redux";
import { sendMessage } from "../store/message/actions";
import moment from "moment";

class GameChat extends Component {
  constructor(props) {
    super(props);
    this.state = { message: "" };
    this.renderMessages = this.renderMessages.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleSend = this.handleSend.bind(this);
  }

  _handleKeyDown = e => {
    if (e.key === "Enter") {
      this.handleSend();
    }
  };

  renderMessages() {
    return this.props.messages.map((message, index) => {
      return (
        <p key={index}>
          {message.username}: {message.text} -{" "}
          {moment(message.createdAt).format("h:mm:ss a")}
        </p>
      );
    });
  }

  renderSystemMessages() {
      return this.props.systemMessages.map((message, index) => {
        return (
            <p key={index}>
              SYSTEM: {message.text} -{" "}
              {moment(message.createdAt).format("h:mm:ss a")}
            </p>
          );
      })
  }

  handleInput(e) {
    this.setState({ message: e.target.value });
  }

  handleSend() {
    if (this.state.message.length > 0) {
      this.props.sendMessage(this.state.message);
      this.setState({
        message: ""
      });
    }
  }

  render() {
    return (
      <div>
        <h2>Chat</h2>
        {this.renderSystemMessages()}
        {this.renderMessages()}
        <input
          onChange={this.handleInput}
          type="text"
          placeholder="Message"
          value={this.state.message}
          required
          autoComplete="off"
          onKeyDown={this._handleKeyDown}
        />
        <button onClick={this.handleSend}>Send</button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { messages: state.message.messages, systemMessages: state.message.systemMessages };
};

const mapDispatchToProps = dispatch => {
  return {
    sendMessage: message => dispatch(sendMessage(message))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameChat);
