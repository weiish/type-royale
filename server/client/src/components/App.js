import React from 'react';
import {connect} from 'react-redux'
import Main from './Main'
import GameRoom from './GameRoom'
import JoinGame from './JoinGame'
import Header from './Header'

class App extends React.Component {

  constructor() {
    super();
  }

  renderLogic() {
    if (this.props.room.room !== null) {
      return <GameRoom />
    } else if (this.props.room.join_page) {
      return <JoinGame />
    } else {
      return <Main />
    }
  }
  
  render() {
    return (
      <div>
          <div className="App">
            <Header />
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
