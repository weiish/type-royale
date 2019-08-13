import React from 'react';
import io from 'socket.io-client';
import { BrowserRouter, Route, Link } from 'react-router-dom'
import {connect} from 'react-redux'
import Login from './Login'
import Main from './Main'
import JoinGame from './JoinGame'
import GameRoom from './GameRoom'

class App extends React.Component {

  constructor() {
    super();
  }

  renderLogic() {
    if (this.props.game.room !== null) {
      return <GameRoom />
    } else {
      return <Main />
    }
  }
  
  render() {
    return (
      <div>
          <div className="App">
            {this.renderLogic()}
          </div>
      </div>

    );
  }
}

function mapStateToProps(state) {
  return state
}

export default connect(mapStateToProps)(App);
