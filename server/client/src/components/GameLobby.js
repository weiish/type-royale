import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PlayerList from './PlayerList'

class GameLobby extends Component {

    render() {
        return (
            <div>
                <h1>Game Lobby</h1>
                <PlayerList />
            </div>
        )
    }
}

export default GameLobby