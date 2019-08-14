//Only used this file once to generate the words JSON file

const readline = require("readline");
const fs = require("fs");
const path = require("path");

const READ_FILE_PATH = path.join(__dirname, "words_alpha.txt");
const WRITE_FILE_PATH = path.join(__dirname, "words_alpha.json");

const readInterface = readline.createInterface({
  input: fs.createReadStream(READ_FILE_PATH),
  console: false
});

let words = {};
let counter = 0;

readInterface.on("line", line => {
  if (counter % 100 === 0) {
    console.log(`Read ${counter} words...`);
  }
  const word_length = line.length;
  if (word_length in words) {
    words[word_length].push(line);
  } else {
    words[word_length] = [line];
  }
  counter++;
});

readInterface.on("end", () => {
  console.log(words);
  console.log("Writing to file");
  let words_json = JSON.stringify(words);
  fs.writeFileSync(WRITE_FILE_PATH, words_json);
});
