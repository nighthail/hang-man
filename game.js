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

// todo:
// Skriv poängen till rätt person i higscore-listan
// visa highscorelistan ?
// överkurs:
// Kontrollera om personen redan finns i highscore-listan när den registerar sig
// Om dess nya highscore är högre, skriv över highscore.
// Rita ut hänga gubbe figur

const prompt = promptSync()
let x = console.log // debug

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

    const csvContent = `${this.name},${this.score}\n`;

    fs.appendFileSync(this.HSFile, csvContent, (err) => {
      if (err) {
        console.error('Error writing to CSV file:', err);
      } else {
        console.log('Data added to CSV file successfully');
      }
    })
  }
}


function getUser() {
  let user = prompt("Please enter your name");
  if (!user || user.trim() === "") {
    let anonNum = Math.floor(100 + Math.random() * 900)
    user = "Anonymous" + anonNum
    user = new Player(user, 30)
    x("We assigned you a username: " + user.name)
  } else {
    user = new Player(user, 10);
    x("Hello " + user.name);
  }
}
getUser()
//
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
  //let guess = document.getElementById("guessbox").value.toUpperCase() // tar in den gissade bokstaven
  if (guess == '') {
    // lägg till funktion för ifall du inte gissar ett ord
  } else {
    compareWords(guess)
  }
}


function compareWords(guessedword) {
  // if som räknar antalet försök
  if (tries > 3) {
    x("You lost :( The word was: " + pickedWord)
    playAgain()

    //let user = document.getElementById("currentUser").innerText
    //let score = document.getElementById("currentScore").innerText
    //document.getElementById("highscore").innerHTML = user + " : " + score
    //localStorage.setItem(highscore, name + " : " + score)

  }
  else {
    if (guessedword.length == 1) {// ser till att det bara finns en bokstav

      if (pickedWord.includes(guessedword) && !correctGuesses.includes(guessedword)) { // Kollar att gissningen är rätt och inte upprepad
        correctGuesses = correctGuesses + guessedword
        let recuringLetter = pickedWord.split(guessedword).length - 1 // ta fram antalet ggr bokstaven förekommer

        // For loop som kollar att bokstaven ersätts på ALLA ställen
        for (let index = 0; index < recuringLetter; index++) {
          let placement = tempword.indexOf(guessedword) + 1
          tempword = pickedWord.replace(guessedword, " ")
          let before = underScore.slice(0, placement - 1)
          let after = underScore.slice(placement)
          underScore = before + guessedword + after
          //kontrollera ordet som finns i terminalen
          x(underScore)
        }

        if (underScore == pickedWord) {
          x("Wow shit dawg")
          playAgain()

          //userScoreUpdate(user.score)
          // Om du vinner
          //      winTracker()
        }
        else {
          newLetterPrompt()

        }



      }

      if (passedGuesses.includes(guessedword)) { // Om du upprepar samma bokstav
        x("You need to pick a new letter")
        newLetterPrompt()
      }

      else {
        tries = tries + 1
        showGuessedWordsFunc(guessedword)

        //console.log(user.score)
        //user.score -= 5
        //userScoreUpdate(user.score)
      }
    }
    else if (guessedword == pickedWord) {
      x("Congrats, you guessed right: " + pickedWord)
      currentScore += 50
      x("your score is:" + currentScore)
      playAgain()
      //user.score += 100
      //userScoreUpdate(user.score)


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
  //make an if here
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
    getRandomWord()
  }
  else {
    x("Ok i guess...")
  }

}