import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PlayerList from './PlayerList'

class GameRoom extends Component {

    render() {
        return (
            <div>
                <h1>Game Room</h1>
                <PlayerList />
            </div>
        )
    }
}

export default GameRoom