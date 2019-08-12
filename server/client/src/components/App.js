import React from 'react';
import io from 'socket.io-client';
import { BrowserRouter, Route, Link } from 'react-router-dom'
import {connect} from 'react-redux'
import Login from './Login'
import Lobby from './Lobby'
import Main from './Main'
import JoinGame from './JoinGame'
import GameLobby from './GameLobby'

class App extends React.Component {

  constructor() {
    super();
  }
  
  render() {
    return (
      <div>
        <BrowserRouter>
          <div className="App">
            <Route exact path="/" component={Main} />
            <Route exact path="/create" component={GameLobby} />
            <Route exact path="/join" component={JoinGame} />
            <Route exact path="/lobby" component={Lobby} />
          </div>
        </BrowserRouter>
      </div>

    );
  }
}

function mapStateToProps(state) {
  return state
}

export default connect(mapStateToProps)(App);
