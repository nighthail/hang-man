import promptSync from 'prompt-sync'

const prompt = promptSync()

//import { existsSync, writeFileSync, readFileSync } from 'fs'
import { appendFileSync, writeFile } from 'fs'
import fs from "node:fs"


class Player {
  constructor(name, score) {
    this.name = name;
    this.score = score;
    this.HSFile = 'highscore.csv'; // Replace with the path to your CSV file

    // Check if the CSV file already exists
    if (!fs.existsSync(this.HSFile)) {
      // If it doesn't exist, create a new file with a header
      const csvHeader = 'Name,Score\n';
      fs.writeFileSync(this.HSFile, csvHeader);
    }

    const csvContent = `${this.name},${this.score}\n`;

    fs.appendFile(this.HSFile, csvContent, (err) => {
      if (err) {
        console.error('Error writing to CSV file:', err);
      } else {
        console.log('Data added to CSV file successfully');
      }
    })
  }
}

let user = prompt("Please enter your name")
user = new Player(user, 0)



/*
// This displays whats i n the contacts.csv
class Contactlist {
  #entries

  constructor() {
    this.#entries = fs.readFileSync('contacts.csv', 'utf8')
      .trim()
      .split('\n')
      .map(c => c.split(','))
      .map(c => new Contact(c[0], c[1], c[2]))
  }
  display() {
    for (const entry of this.#entries) {
      console.log(entry.name + ': ' + entry.email + ', ' + entry.number)
    }
  }
}


//if (!existsSync("highscore.csv")) {
//  writeFileSync("highscore.csv", "")
//}
// här ska den spara till en fil
// Add more key-value pairs as needed



/*
//import { readFileSync } from 'fs';


const csvFile = 'wordlist.csv'
const lines = readFileSync(csvFile, 'utf-8').split('\n')
const data = lines.slice(1);
const randomIndex = Math.floor(Math.random() * data.length)
const randomRow = data[randomIndex].split(',')
const randomKey = randomRow[0]
console.log('Random Key:', randomKey)



/*
readFile("wordlist.csv", "utf-8", (err, data) => {
  let wordList = data
  const words = wordList.split(' ')
  let NUMB = Math.floor(Math.random() * 7)
  pickedWord = 'BENJAMIN'//words[NUMB] (Temporary word for debug purposes)
  tempword = pickedWord

  console.log(data)
})



/*
let dataToWrite = "BObbbs"
fs.writeFile('highscore.csv', dataToWrite, 'utf8', function (err) {
  if (err) {
    console.log('Some error occured - file either not saved or corrupted file saved.');
  } else {
    console.log('It\'s saved!')
  }
})

readFile("wordlist.csv", "utf-8", (err, data) => {
  if (err) console.log(err);
  else console.log(data);
})
*/

/* manuels kod
if (!fs.existsSync("highscore.csv")) {
  fs.writeFileSync("highscore.csv", "")
}

let highscore = fs.readFileSync("highscore.csv", "utf-8")
  .trim()
  .split("\n")
  .map(c => c.split(",")) // denna gör varje rad till en array
  .map(c => new Highscore(c[0], c[1]))


// numbers = numbers.map(n => n + 2)
//.trim() för att */