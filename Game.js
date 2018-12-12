class Game {
  constructor() {
    this.players = [];
    this.currentRound = 1;
    this.bonusRoundLetters = ["r", "s", "t", "l", "n", "e"];
    this.puzzle = new Puzzle();
    this.wheel = new Wheel();
    this.finalRoundPlayer = [];
    this.bonusRound = false;
  }

  startGame() {
    let names = domUpdates.getPlayerNames();
    this.createPlayers(names);
    this.wheel.generateValues();
    domUpdates.forStartingGame(this.players[0], this.puzzle.currentPuzzle.correct_answer.toLowerCase(), this.puzzle.currentPuzzle.category);
  }

  createPlayers(names) {
    this.players = [
      new Player(names[0]),
      new Player(names[1]),
      new Player(names[2])
    ];
    domUpdates.setPlayerNames(names);
  }

  changeRounds() {
    if(this.currentRound <= 4) {
      this.players.forEach(player => {
        player.roundPoints = 0;
      });
      this.currentRound++;
      domUpdates.forRoundChange(this.currentRound, this.puzzle.currentPuzzle.correct_answer.toLowerCase(), this.puzzle.currentPuzzle.category);
      let newWheel = new Wheel();
      this.wheel = newWheel;
      this.wheel.generateValues();
      this.puzzle.setPuzzleForRound();
    } else {
      this.bonusRound = true;
      this.startBonusRound();
    }
}

  startBonusRound() {
    this.declareWinner();
    this.currentRound++;
    let bonusWheel = new BonusWheel();
    this.wheel = bonusWheel;
    this.wheel.generateValues();
    this.puzzle.setPuzzleForRound();


    // domUpdates.resetRoundScore();
    // domUpdates.updateRoundNumber(this.currentRound);
    // domUpdates.clearPuzzle();
    // domUpdates.displayPuzzle(
    //   this.puzzle.currentPuzzle.correct_answer.toLowerCase()
    // );
    // domUpdates.displayCategory(this.puzzle.currentPuzzle.category);
  }

  changePlayerTurn() {
    let player = this.players.shift();
    this.players.push(player);
    domUpdates.displayCurrentPlayerTurn(this.players[0]);
  }

  checkPlayerGuess(letter) {
    let vowels = 'aeiou';
    domUpdates.showGuessedLetter(letter);
    if (!(vowels.includes(letter)) && this.puzzle.currentPuzzle.correct_answer.toLowerCase().includes(letter)){
      domUpdates.updatePuzzleOnDom(letter);
      this.updatePlayerScore(letter);
    } else if (vowels.includes(letter)) {
      domUpdates.fireVowelAlert(letter);
    } else {
      this.changePlayerTurn(); 
    }
  }

  checkPlayerSolution(string) {
    if (this.puzzle.currentPuzzle.correct_answer.toLowerCase() === string) {
      this.updateTotalScore();
      domUpdates.forCorrectSolution(this.players[0].name, this.players[0].totalScore);
    } else {
      alert("Sorry, that is incorrect!");
      this.changePlayerTurn();
    }
  }

  updateTotalScore() {
    this.players[0].totalScore += this.players[0].roundPoints;
    this.players[1].totalScore += 0;
    this.players[2].totalScore += 0;
  }

  updatePlayerScore(letter) {
    let puzzle = this.puzzle.currentPuzzle.correct_answer.split("");
    let correctLetterCount = puzzle.filter(char => {
      return char.toLowerCase() === letter.toLowerCase();
    }).length;
    let mutlipliedScore = correctLetterCount * this.players[0].currentSpinValue;
    let fullScore = (this.players[0].roundPoints += mutlipliedScore);
    domUpdates.updatePlayerRoundScore(fullScore, this.players[0].name);
  }

  declareWinner() {
    let winner = game.players.sort((a, b) => {
      return b.totalScore - a.totalScore
    }).shift()
    this.finalRoundPlayer.push(winner)
  }

  bonusRoundLetterSubmission() {
    // if letters are there, put them there
    //. ++++++ maybe this happens only in DOM updates? ++++++
  }

  checkBonusRoundSolution() {
    // grab value from player input (maybe happens in DOM updates?)
    // to lowerCase the puzzle value AND player's input value
    // validate answer somehow.  guess === answerguess
    // if  player's guess is TRUE
    //.     update player.roundScore with bonusWheel value
    //      increment that value in player.bank
    //      display something that says 'You won!' and final score
    //      Offer an exit game option
    //. if player's guess is false
    //      fire game.youAreHorribleAtWheel.  ==== DOM manipulation
    //      display something that says your final score
    //      Offer an exit game option
  }

}
if (typeof module !== 'undefined') {
  module.exports = Game;
}