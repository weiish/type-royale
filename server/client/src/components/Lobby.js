import React from 'react';
import {connect} from 'react-redux';

class Lobby extends React.Component {    

    render() {
        return (
            <div>
                <h1>Welcome {this.props.connection.user}</h1>
            </div>
        )

    }
}

function mapStateToProps(state) {
    console.log(state)
    return {connection: state.connection}
}

export default connect(mapStateToProps)(Lobby);