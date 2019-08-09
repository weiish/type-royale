const express = require('express')
const app = express()
const server = require('http').Server(app);
const io = require('socket.io').listen(server);


//Server needs to...

io.on('connection', socket => {
    console.log('a user connected: ', socket.id)
})

//Check for new connections
//  When a new connection appears, assign them to THE "lobby"
//      Show them a list of available games
//      Allow them to create a game or join a game
//      
//      On joining a game
//          Show them the other users in that room
//          Update the room (for other players) and for the lobby display
//      On starting a game
//          Remove game from joinable list, change to a "started" status
//          Move all players to the "game UI"
//          Randomize player attack order, send this list to all players
//          Initiate countdown for all players
//      On leaving a game
//          Remove player from list, boot em back to the main lobby
//          Update the room (for other players) and for the lobby display\
//      
//

const PORT = process.env.PORT || 4000
server.listen(PORT, () => {
    console.log(`Listening on port ${server.address().port}`)
})

