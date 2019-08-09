import React from 'react';
import io from 'socket.io-client';
import { BrowserRouter, Route, Link } from 'react-router-dom'
import Login from './Login'
import Lobby from './Lobby'

class App extends React.Component {

  constructor() {
    super();
    
  }

 

  render() {
    return (
      <div>
        <BrowserRouter>
          <div className="App">
            <Route exact path="/" component={Login} />
            <Route exact path="/lobby" component={Lobby} />
          </div>
        </BrowserRouter>
      </div>

    );
  }
}

export default App;
