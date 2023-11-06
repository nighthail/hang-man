// om dedt inte funkar är det pga package.json filens type modulemupperi

let passedGuesses = ""
let correctGuesses = ""
let tries = 0
let pickedWord = ""
let tempword = pickedWord
let underScore = "-"
let guessedword = ""


let user = ""



import promptSync from 'prompt-sync'

const prompt = promptSync()

let x = console.log // debug

class Player {
  constructor(name, score) {
    this.name = name;
    this.score = score;
    // här ska den spara till en fil
  }
}


function getUser() {
  user = prompt("Please enter your name")
  if (user == null || user == "") {
    let anonNum = Math.floor(100 + Math.random() * 900)
    user = "Anonymous" + anonNum
    x("We assigned you a username: " + user)
  }
  user = new Player(user, 0)
  x("Hello " + user.name)
  //userScoreUpdate(user.score)
}
getUser()
//
getRandomWord()

function getRandomWord() { // RANDOMIZAR ett ord ur en lista av ord
  //let wordList = hangmanWords
  //const words = wordList.split(' ')
  //let NUMB = Math.floor(Math.random() * 7)
  pickedWord = 'BENJAMIN'//words[NUMB] (Temporary word for debug purposes)
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

        //user.score += 10
        //userScoreUpdate(user.score)

        // For loop som kollar att bokstaven ersätts på ALLA ställen
        for (let index = 0; index < recuringLetter; index++) {
          let placement = tempword.indexOf(guessedword) + 1
          tempword = pickedWord.replace(guessedword, " ")
          let before = underScore.slice(0, placement - 1)
          let after = underScore.slice(placement)
          underScore = before + guessedword + after

        }

        x(underScore)
        newLetterPrompt()

        //    if (document.getElementById("word").innerText == pickedWord) { // måste kontrollera ordet på annat sätt
        //user.score += 50
        //userScoreUpdate(user.score)
        // Om du vinner
        //      winTracker()
        //    }

      }

      if (passedGuesses.includes(guessedword)) { // Om du upprepar samma bokstav
        x("You need to pick a new letter")
        newLetterPrompt()
      }

      else {
        tries = tries + 1
        showGuessedWordsFunc(guessedword)

        // document.getElementById("hangmanImage").style.content = "url('img/" + tries + ".png')"
        //console.log(user.score)
        //user.score -= 5
        //userScoreUpdate(user.score)
      }
    }
    else if (guessedword == pickedWord) {
      x("The guessed letter is: " + pickedWord)
      //user.score += 100
      //userScoreUpdate(user.score)

      // Om du vinner
      //winTracker()

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

