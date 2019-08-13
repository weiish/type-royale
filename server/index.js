const express = require('express')
const app = express()
const server = require('http').Server(app);
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')
const {generateMessage} = require('./utils/messages')
const io = require('socket.io').listen(server);
const Protocol = require("./constants/Protocol.js");
const Room = require('./utils/room')
const shortid = require('shortid');

var rooms = [];

const userCurrentRoom = (socketID) => {
    //TODO: check if user is in a room in the rooms
}

const createRoom = (socketID) => {
    let newRoom = new Room(shortid.generate(), socketID)
    rooms.push(newRoom);
    return newRoom;
}

const deleteRoom = (room_id) => {

}

const getRoom = (room_id) => {
    return rooms.filter(room => {
        return room.id === room_id
    })
}

io.on('connection', socket => {
    console.log('a user connected: ', socket.id)

    socket.on(Protocol.CREATE_ROOM, (username) => {  
        console.log('Server got Create Room Request from username: ',username)      
        let newRoom = createRoom(socket.id)
        let newUser = addUser({id: socket.id, username, room_id: newRoom.id})
        newRoom.addPlayer(newUser)
        console.log('Room created, sending back data to user')
        socket.emit(Protocol.ROOM_DATA, newRoom)
    })

    socket.on(Protocol.JOIN_ROOM, (username, room_id) => {
        console.log('Server got Join Room Request')
        let newUser = addUser({id: socket.id, username, room_id})
        let existingRoom = getRoom(room_id)
        existingRoom.addPlayer(newUser)
        io.to(room_id).emit(Protocol.ROOM_DATA, existingRoom)
    })

    socket.on('join', ({username, room}, callback) => {
        //Callback is for telling the client that the server processed their 'join' event
        const {error, user} = addUser({id: socket.id, username, room})
        if (error) {
            return callback(error)
        }

        socket.join(user.room)
        socket.emit('message', generateMessage('System', `Welcome to the room, ${user.username}`))
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
//  When a new connection appears, assign them to THE "room"
//      Show them a list of available games
//      Allow them to create a game or join a game
//      
//      On joining a game
//          Show them the other users in that room
//          Update the room (for other players) and for the room display
//      On starting a game
//          Remove game from joinable list, change to a "started" status
//          Move all players to the "game UI"
//          Randomize player attack order, send this list to all players
//          Initiate countdown for all players
//      On leaving a game
//          Remove player from list, boot em back to the main room
//          Update the room (for other players) and for the room display\
//      
//

const PORT = process.env.PORT || 4000
server.listen(PORT, () => {
    console.log(`Listening on port ${server.address().port}`)
})

