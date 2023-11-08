import { readFileSync } from 'fs'
import promptSync from 'prompt-sync'
import fs from "node:fs"
import { drawMan0, drawMan1, drawMan2, drawMan3, drawMan4 } from './hang-man.js'

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
    this.File = 'highscore.csv'

    if (!fs.existsSync(this.File)) {
      const csvHeader = 'Name,Score\n';
      fs.writeFileSync(this.HSFile, csvHeader);
    }

    const csvContent = `\n${this.name},${this.score}`

    fs.appendFileSync(this.File, csvContent, (err) => {
    })
  }
}

function topOneHS() {

  const csvData = fs.readFileSync(HSFile, 'utf8');
  const rows = csvData.split('\n').map(row => row.trim());
  const columns = rows[0].split(',')

  let topOneHS = []
  for (let i = 1; i < rows.length; i++) {
    const rowValues = rows[i].split(',')
    const person = {}

    for (let j = 0; j < columns.length; j++) {
      person[columns[j]] = rowValues[j]
    }
    topOneHS.push(person)
  }
  const personAtIndex1 = topOneHS[0]

  x('Highest Score: ' + personAtIndex1.username + ": " + personAtIndex1.score + "p")
  topOneHS = []
}

function getUser() {
  let user = prompt("Please enter your name");
  if (!user || user.trim() === "") {
    x("You have to enter a username!")
    getUser()
  } else {
    currentUser = user

    if (!fs.existsSync(HSFile)) {
      const csvHeader = 'Name,Score\n';
      fs.writeFileSync(this.HSFile, csvHeader);
    }
    const userToFind = currentUser
    const csvData = fs.readFileSync(HSFile, 'utf8');

    const rows = csvData.split('\n').map(row => row.trim());
    const columns = rows[0].split(',')
    const hsObjects = []

    for (let i = 1; i < rows.length; i++) {
      const rowValues = rows[i].split(',')
      const obj = {}

      for (let j = 0; j < columns.length; j++) {
        obj[columns[j]] = rowValues[j]
      }
      hsObjects.push(obj)
    }
    if (hsObjects.some(obj => obj.username === currentUser)) {
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

function getRandomWord() {
  const wordList = 'wordlist.csv'
  const lines = readFileSync(wordList, 'utf-8').split('\n')
  const data = lines.slice(1);
  const randomIndex = Math.floor(Math.random() * data.length)
  const randomRow = data[randomIndex].split(',')
  pickedWord = randomRow[0]
  tempword = pickedWord
  genclue(pickedWord)
}

function genclue() {
  for (let index = 1; index < pickedWord.length; index++) {
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
  if (tries > 3) {
    x("You lost :( The word was: " + pickedWord)
    x(drawMan4)
    playAgain()

  }
  else {
    if (guessedword.length == 1) {

      if (passedGuesses.includes(guessedword)) {
        x("You need to pick a new letter")
        newLetterPrompt()
      }

      if (pickedWord.includes(guessedword) && !correctGuesses.includes(guessedword)) {
        correctGuesses = correctGuesses + guessedword
        let recuringLetter = pickedWord.split(guessedword).length - 1

        currentScore += 10

        for (let index = 0; index < recuringLetter; index++) {
          let placement = tempword.indexOf(guessedword) + 1
          tempword = pickedWord.replace(guessedword, " ")
          let before = underScore.slice(0, placement - 1)
          let after = underScore.slice(placement)
          underScore = before + guessedword + after
          x(underScore)
        }


        if (underScore == pickedWord) {
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
        switch (tries) {
          case 0:
            x(drawMan0)
            tries = tries + 1
            showGuessedWordsFunc(guessedword)
            break;
          case 1:
            x(drawMan1)
            tries = tries + 1
            showGuessedWordsFunc(guessedword)
            break;
          case 2:
            x(drawMan2)
            tries = tries + 1
            showGuessedWordsFunc(guessedword)
            break;
          case 3:
            x(drawMan3)
            tries = tries + 1
            showGuessedWordsFunc(guessedword)
            break;
          case 4:
            x(drawMan4)
            tries = tries + 1
            showGuessedWordsFunc(guessedword)
            break;

          default:
            break;
        }
      }


    }
    else if (guessedword == pickedWord) {
      x("Congrats, you guessed right: " + pickedWord)
      currentScore += 100
      x("your score is:" + currentScore)
      playAgain()

    }

    else {
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
    reset()
    getRandomWord()
  }
  else {
    x("Ok i guess...")
    reset()
    AddToHighscore()

  }
}

function AddToHighscore() {
  const userToFind = currentUser
  const filePath = 'highscore.csv';
  const csvData = fs.readFileSync(filePath, 'utf8');

  const rows = csvData.split('\n').map(row => row.trim());
  const columns = rows[0].split(',')

  let highscoreObjects = []

  for (let i = 1; i < rows.length; i++) {
    const rowValues = rows[i].split(',')
    const obj = {}

    for (let j = 0; j < columns.length; j++) {
      obj[columns[j]] = rowValues[j]
    }
    highscoreObjects.push(obj)
  }
  let placement = highscoreObjects.findIndex(x => x.username === currentUser)
  let obj = highscoreObjects.find(o => o.username === currentUser)

  if (obj.score < currentScore) {
    x("You broke your previous record!")
    highscoreObjects[placement] = { username: currentUser, score: currentScore }

    let sortedHighscore = highscoreObjects.slice().sort((a, b) => b.score - a.score);

    const header = Object.keys(sortedHighscore[0]).join(',')
    const dataRows = sortedHighscore.map(obj => Object.values(obj).join(','))
    const csvString = [header, ...dataRows].join('\n')

    fs.writeFileSync(filePath, csvString, 'utf8');
    x('We updated the highscore.')
    highscoreObjects = []
    sortedHighscore = []
  } else {
    x("You didn't break you previous record")
  }
  currentScore = 0
}

function reset() {
  passedGuesses = ""
  correctGuesses = ""
  tries = 0
  pickedWord = ""
  tempword = pickedWord
  underScore = "-"
  guessedword = ''
}