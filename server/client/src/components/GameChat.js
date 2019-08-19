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

  renderMessages() {
    return this.props.messages.map((message, index) => {
      let username = message.username;
      if (username.length > 8) {
        username = username.substring(0,8);
      } 
      let system_message_class = ""
      if (username.toLowerCase() === "system") {
        system_message_class = "game-system-chat"
        username = ""
      } else {
        username += ":"
      }
      return (
        <div key={index} className="game-chat__message">
          <p className={`game-chat__message-name ${system_message_class}`}>{username}</p>
          <p className={`game-chat__message-text ${system_message_class}`}>{message.text}</p>
          <p className={`game-chat__message-timestamp ${system_message_class}`}>
            {moment(message.createdAt).format("h:mm:ss a")}
          </p>
        </div>
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
    });
  }

  handleInput(e) {
    this.setState({ message: e.target.value });
  }

  handleSend(e) {
    e.preventDefault();
    if (this.state.message.length > 0) {
      this.props.sendMessage(this.state.message);
      this.setState({
        message: ""
      });
    }
  }

  scrollCheck() {
    const { messageBox } = this.refs;
    const clientBottom = messageBox.scrollTop + messageBox.clientHeight;
    if (clientBottom - messageBox.scrollHeight > -80) {
      messageBox.scrollTop = messageBox.scrollHeight;
    }
  }

  componentDidUpdate() {
    this.scrollCheck();
  }

  render() {
    return (
      <div className="game-chat">
        <h2 className="game-chat__header">Chat</h2>
        <div className="game-chat__message-wrapper" ref="messageBox">
          {this.renderMessages()}
        </div>

        <form className="game-chat__form" onSubmit={this.handleSend}>
          <input
            className="game-chat__input"
            onChange={this.handleInput}
            type="text"
            placeholder="Message"
            value={this.state.message}
            required
            autoComplete="off"
          />
          <button className="button">Send</button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    messages: state.message.messages,
    systemMessages: state.message.systemMessages
  };
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
