const express = require('express')
const app = express()
const server = require('http').Server(app);
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')
const {generateMessage} = require('./utils/messages')
const io = require('socket.io').listen(server);

io.on('connection', socket => {
    console.log('a user connected: ', socket.id)
    socket.on('join', ({username, room}, callback) => {
        //Callback is for telling the client that the server processed their 'join' event
        const {error, user} = addUser({id: socket.id, username, room})
        if (error) {
            return callback(error)
        }

        socket.join(user.room)
        socket.emit('message', generateMessage('System', `Welcome to the lobby, ${user.username}`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        callback()
    })

    socket.on('disconnect', () => {
        console.log('a user has disconnected', socket.id)
    })
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

