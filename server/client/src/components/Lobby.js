import React from 'react';
import {connect} from 'react-redux';

class Lobby extends React.Component {    

    render() {
        return (
            <div>
                <h1>Welcome {this.props.connection.username}</h1>
            </div>
        )

    }
}

function mapStateToProps(state) {
    return state
}

export default connect(mapStateToProps)(Lobby);