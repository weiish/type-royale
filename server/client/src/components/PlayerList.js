import React from 'react';
import {connect} from 'react-redux';

class PlayerList extends React.Component {

    renderList() {
        if (!this.props.playerList) return <p>Empty</p>
        const playerList = this.props.playerList.map(player => {
            return <li key={player.id}>{player.username}</li>
        })
        return (
            <ul>
                {playerList}
            </ul>
        )
    }

    render() {
        return (
            <div>
                <h2>Player List</h2>
                {this.renderList()}
            </div>
        )

    }
}

const mapStateToProps = (state) => {
    return {playerList: state.room.room.playerList}
}

export default connect(mapStateToProps)(PlayerList);