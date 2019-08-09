import React from 'react';
import io from 'socket.io-client';

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      endpoint: 'http://localhost:4000'
    }
  }

  connectIO() {
    var socket = io(this.state.endpoint)
    this.setState({ connection: socket })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <button onClick={() => this.connectIO()}>Connect</button>
        </header>
      </div>
    );
  }
}

export default App;
