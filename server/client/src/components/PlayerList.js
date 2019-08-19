import React from 'react';
import {connect} from 'react-redux';

class PlayerList extends React.Component {

    renderList() {
        if (!this.props.playerList) return <p>Empty</p>
        const playerList = this.props.playerList.map(player => {
            return <li className="player-list__li" key={player.id}>{player.username}</li>
        })
        return (
            <ul className='player-list__ul'>
                {playerList}
            </ul>
        )
    }

    render() {
        return (
            <div className="player-list">
                <h2 className="player-list__header">Players</h2>
                {this.renderList()}
            </div>
        )

    }
}

const mapStateToProps = (state) => {
    return {playerList: state.room.room.playerList}
}

export default connect(mapStateToProps)(PlayerList);