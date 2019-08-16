// Got words list from https://github.com/dwyl/english-words
const words_list = require('../files/words_alpha.json')

const generateRandomWord = length => {
    const randomWordIndex = Math.floor(Math.random() * words_list[length].length)
    return words_list[length][randomWordIndex]
}

const generateRandomWordBetween = (minLength, maxLength) => {
    let randomWordLength = Math.floor(Math.random() * (maxLength-minLength+1)) + minLength;
    while (!(randomWordLength in words_list)) {
        randomWordLength = Math.floor(Math.random() * 31);
    }
    return generateRandomWord(randomWordLength)
}

module.exports = {
    generateRandomWord,
    generateRandomWordBetween
}