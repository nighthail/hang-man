import { existsSync, writeFileSync, readFileSync } from 'fs'
import promptSync from 'prompt-sync'
import fs from "node:fs"

let passedGuesses = ""
let correctGuesses = ""
let tries = 0
let pickedWord = ""
let tempword = pickedWord
let underScore = "-"
let guessedword = ""
let user = ""
let currentScore = 0
let currentUser = ''
let HSFile = 'highscore.csv'

const prompt = promptSync()
let x = console.log

class Player {
  constructor(name, score) {
    this.name = name;
    this.score = score;
    this.HSFile = 'highscore.csv'; // Replace with the path to your CSV file

    // Check if the CSV file already exists
    if (!fs.existsSync(this.HSFile)) {
      const csvHeader = 'Name,Score\n';
      fs.writeFileSync(this.HSFile, csvHeader);
    }

    const csvContent = `\n${this.name},${this.score}`

    fs.appendFileSync(this.HSFile, csvContent, (err) => {
      if (err) {
        console.error('Error writing to highscore file:', err);
      } else {
        console.log('Data added to highscore file successfully');
      }
    })
  }
}

function topOneHS() {
  const csvData = fs.readFileSync(HSFile, 'utf8');
  const rows = csvData.split('\n').map(row => row.trim());
  const columns = rows[0].split(',')

  // Create an array to store the highscoreObjects
  const highscoreObjects = []

  // Iterate through the rows and create highscoreObjects
  for (let i = 1; i < rows.length; i++) { // Start from 1 to skip the header row
    const rowValues = rows[i].split(',')
    const obj = {}

    for (let j = 0; j < columns.length; j++) {
      obj[columns[j]] = rowValues[j]
    }
    highscoreObjects.push(obj)
  }
  const highest = highscoreObjects.reduce((previous, current) => {
    return current.score > previous.score ? current : previous;
  })

  x('Highest Score: ' + highest.username + ": " + highest.score + "p")

}

function getUser() {
  let user = prompt("Please enter your name");
  if (!user || user.trim() === "") {
    x("You have to enter a username!")
    getUser()
  } else {
    currentUser = user

    // Check if the CSV file already exists
    if (!fs.existsSync(HSFile)) {
      const csvHeader = 'Name,Score\n';
      fs.writeFileSync(this.HSFile, csvHeader);
    }
    const userToFind = currentUser
    const csvData = fs.readFileSync(HSFile, 'utf8');

    const rows = csvData.split('\n').map(row => row.trim());
    const columns = rows[0].split(',')

    // Create an array to store the highscoreObjects
    const highscoreObjects = []

    // Iterate through the rows and create highscoreObjects
    for (let i = 1; i < rows.length; i++) { // Start from 1 to skip the header row
      const rowValues = rows[i].split(',')
      const obj = {}

      for (let j = 0; j < columns.length; j++) {
        obj[columns[j]] = rowValues[j]
      }
      highscoreObjects.push(obj)
    }
    if (highscoreObjects.some(obj => obj.username === currentUser)) {

      x("Welcome back " + currentUser + "!")
    } else {
      currentUser = user
      user = new Player(user, 0)
      x("Hello " + user.name)

    }
  }
} getUser()
topOneHS()
getRandomWord()

function getRandomWord() { // RANDOMIZAR ett ord ur en lista av ord
  const wordList = 'wordlist.csv'
  const lines = readFileSync(wordList, 'utf-8').split('\n')
  const data = lines.slice(1);
  const randomIndex = Math.floor(Math.random() * data.length)
  const randomRow = data[randomIndex].split(',')
  pickedWord = 'BEN' //randomRow[0] 
  tempword = pickedWord
  genclue(pickedWord)
}

function genclue() {
  for (let index = 1; index < pickedWord.length; index++) { // genererar ledtråd
    underScore += "-"
  }
  x(underScore)
  newLetterPrompt()
}


function newLetterPrompt() {
  let guess = prompt("Guess a letter:").toUpperCase()
  if (guess == '') {
    newLetterPrompt()
  } else {
    compareWords(guess)
  }
}


function compareWords(guessedword) {
  // if som räknar antalet försök
  if (tries > 4) {
    x("You lost :( The word was: " + pickedWord)
    playAgain()
    // lägg in att du hamnar i highscoren här och resetta currentScore

  }
  else {
    if (guessedword.length == 1) {// ser till att det bara finns en bokstav

      if (passedGuesses.includes(guessedword)) { // Om du upprepar samma bokstav
        x("You need to pick a new letter")
        newLetterPrompt()
      }

      if (pickedWord.includes(guessedword) && !correctGuesses.includes(guessedword)) { // Kollar att gissningen är rätt och inte upprepad
        correctGuesses = correctGuesses + guessedword
        let recuringLetter = pickedWord.split(guessedword).length - 1 // ta fram antalet ggr bokstaven förekommer

        currentScore += 10

        // For loop som kollar att bokstaven ersätts på ALLA ställen
        for (let index = 0; index < recuringLetter; index++) {
          let placement = tempword.indexOf(guessedword) + 1
          tempword = pickedWord.replace(guessedword, " ")
          let before = underScore.slice(0, placement - 1)
          let after = underScore.slice(placement)
          underScore = before + guessedword + after
          x(underScore)
        }

        //kontrollera ordet som finns i terminalen
        if (underScore == pickedWord) { // här har jag en bugg
          x("Congrats, you guessed right: " + pickedWord)
          currentScore += 50
          x("Your score is:" + currentScore)
          playAgain()
        }
        else {
          newLetterPrompt()
        }
      }
      else {
        tries = tries + 1
        showGuessedWordsFunc(guessedword)
      }


    }
    else if (guessedword == pickedWord) {
      x("Congrats, you guessed right: " + pickedWord)
      currentScore += 100
      x("your score is:" + currentScore)
      playAgain()

    }

    else { // BER DIG ANVÄNDA ENBART ETT ORD
      x("Only one letter allowed at a time!")
      newLetterPrompt()
    }
  }
}

function showGuessedWordsFunc(guessedword) {
  passedGuesses = passedGuesses + guessedword
  x("guessed letters: " + passedGuesses)
  x(tries + "/5 tries")
  newLetterPrompt()
}

function playAgain() {
  let playagain = prompt("Play again? y/n")
  if (playagain == 'y') {
    passedGuesses = ""
    correctGuesses = ""
    tries = 0
    pickedWord = ""
    tempword = pickedWord
    underScore = "-"
    guessedword = ''

    // Visa highscore listans top 3
    getRandomWord()
  }
  else {
    x("Ok i guess...")
    passedGuesses = ""
    correctGuesses = ""
    tries = 0
    pickedWord = ""
    tempword = pickedWord
    underScore = "-"
    guessedword = ''

    AddToHighscore()
    // Lägg till hiscoren och resetta current score

  }
}

function AddToHighscore() {
  const userToFind = currentUser
  const filePath = 'highscore.csv';
  const csvData = fs.readFileSync(filePath, 'utf8');

  const rows = csvData.split('\n').map(row => row.trim());
  const columns = rows[0].split(',')

  // Create an array to store the highscoreObjects
  const highscoreObjects = []

  // Iterate through the rows and create highscoreObjects
  for (let i = 1; i < rows.length; i++) { // Start from 1 to skip the header row
    const rowValues = rows[i].split(',')
    const obj = {}

    for (let j = 0; j < columns.length; j++) {
      obj[columns[j]] = rowValues[j]
    }
    highscoreObjects.push(obj)
  }

  //hitta usernamnet i arrayen av objekt, för att sedan ersätta objektet
  let placement = highscoreObjects.findIndex(x => x.username === userToFind)
  const lastScore = ''

  for (const obj of highscoreObjects) {
    if (obj.hasOwnProperty(userToFind)) {
      lastScore = obj[userToFind]
    }
  }


  if (lastScore < currentScore) {
    x("You broke your previous record!")
    highscoreObjects[placement] = { username: currentUser, score: currentScore } // ersätter förra rekordet

    // Create a header row from the keys of the first object
    const header = Object.keys(highscoreObjects[0]).join(',')

    // Create an array of data rows
    const dataRows = highscoreObjects.map(obj => Object.values(obj).join(','))

    // Combine the header and data rows into a CSV string
    const csvString = [header, ...dataRows].join('\n')

    // Write the CSV string back to the file
    fs.writeFileSync(filePath, csvString, 'utf8');
    console.log('We updated the highscore.')
  } else if (lastScore >= currentScore) {
    x("You didn't break you previous record")
  }
  currentScore = 0
}