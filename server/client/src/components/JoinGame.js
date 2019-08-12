import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class JoinGame extends Component {

    render() {
        return (
            <div>
                <h1>Join Game</h1>
                <input type="text" placeholder="Name"></input>
                <input type="text" placeholder="Room Code"></input>
                <button>Join</button>
            </div>
        )
    }
}

export default JoinGame