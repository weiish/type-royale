const users = []
 
const addUser = ({ id, username, room_id }) => {

    //Clean the data
    username = username.trim().toLowerCase()

    // Validate the data
    if (!username) {
        return {
            error: 'Username is required.'
        }
    }

    // Store user
    const user = { id, username, room_id }
    users.push(user)
    return { user }
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

const getUsersInRoom = (room) => {
    return users.filter((user) => {
        return user.room.trim().toLowerCase() === room.trim().toLowerCase()
    })
}

module.exports = { addUser, removeUser, getUser, getUsersInRoom}