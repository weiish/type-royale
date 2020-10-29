// Got words list from https://github.com/dwyl/english-words
const words_list = require('../files/words_alpha.json')

const generateRandomWord = length => {
    const randomWordIndex = Math.floor(Math.random() * words_list[length].length)
    return words_list[length][randomWordIndex]
}

module.exports = {
    generateRandomWord
}