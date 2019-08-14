let users = []
 
const addUser = ({ id, username=null, room_id=null }) => {

    //Clean the data
    if (username) username = username.trim().toLowerCase()

    // Store user
    let user = { id, username, room_id }
    users.push(user)
    return user
}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })
    if (index !== -1) {
        return users.splice(index, 1)[0]
    } else {
        return {error: 'User not found'}
    }
}

const getUser = (id) => {
    return users.find((user) => {
        return user.id === id
    })
}

const setUsername = (id, username) => {
    const index = users.findIndex(user => {
        return user.id === id
    })
    users[index].username = username.trim()
}
const setUserRoom = (id, room_id) => {
    const index = users.findIndex(user => {
        return user.id === id
    })
    users[index].room_id = room_id
}

const getUsersInRoom = (room) => {
    return users.filter((user) => {
        return user.room.trim().toLowerCase() === room.trim().toLowerCase()
    })
}

module.exports = { addUser, removeUser, setUsername, setUserRoom, getUser, getUsersInRoom}