import React from 'react';
import {connect} from 'react-redux';

class SpectatorList extends React.Component {

    renderList() {
        if (!this.props.spectatorList) return <p>Empty</p>
        const spectatorList = this.props.spectatorList.map(player => {
            return <li className="player-list__li" key={player.id}>{player.username}</li>
        })
        return (
            <ul className='player-list__ul'>
                {spectatorList}
            </ul>
        )
    }

    render() {
        return (
            <div className="player-list">
                <h2 className="player-list__header">Spectators</h2>
                {this.renderList()}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {spectatorList: state.room.room.spectatorList}
}

export default connect(mapStateToProps)(SpectatorList);