function generateWinningNumber(){
    return Math.floor(Math.random() * 100 + 1)
};

var Game = function(){
    this.playersGuess = null;
    this.winningNumber = generateWinningNumber();
    this.pastGuesses = [];
};

function shuffle(arr){
   for(var i = arr.length-1; i > 0; i--) {
       var randomIndex = Math.floor(Math.random() * (i + 1));
       var temp = arr[i];
       arr[i] = arr[randomIndex];
       arr[randomIndex] = temp;
    }
    return arr;
};

function newGame() {
    return new Game();
};

Game.prototype.difference = function(){
    return Math.abs(this.playersGuess - this.winningNumber)
};

Game.prototype.isLower = function(){
    return this.playersGuess < this.winningNumber
};

Game.prototype.checkGuess = function() {
    if(this.playersGuess===this.winningNumber) {
        $('#hint, #submit').prop("disabled",true);
        $('#subtitle').text("Press the Reset button to play again!")
        return 'You Win!'
    }
    else {
        if(this.pastGuesses.indexOf(this.playersGuess) > -1) {
            return 'You have already guessed that number.';
        }
        else {
            this.pastGuesses.push(this.playersGuess);
            $('#guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
            if(this.pastGuesses.length === 5) {
                $('#hint, #submit').prop("disabled",true);
                $('#subtitle').text("Press the Reset button to play again!")
                return 'You Lose.';
            }
            else {
                var diff = this.difference();
                if(this.isLower()) {
                    $('#subtitle').text("Guess Higher!")
                } else {
                    $('#subtitle').text("Guess Lower!")
                }
                if(diff &lt; 10) return'You\'re burning up!';
                else if(diff &lt; 25) return'You\'re lukewarm.';
                else if(diff &lt; 50) return'You\'re a bit chilly.';
                else return'You\'re ice cold!';
            }
        }
    }
}

Game.prototype.playersGuessSubmission = function(guess){
    if(guess < 1 || typeof guess !== 'number' || guess > 100){
        throw "That is an invalid guess."
    }else{
        this.playersGuess = guess;
        return this.checkGuess()
    }
};

Game.prototype.provideHint = function(){
    var hints = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];
    return shuffle(hints)
};

function makeAGuess(game) {
    var guess = $('#player-input').val();
    $('#player-input').val("");
    var output = game.playersGuessSubmission(parseInt(guess,10));
    $('#title').text(output);
}


$(document).ready(function() {
    var game = new Game();

    $('#submit').click(function(e) {
        makeAGuess(game);
    })

    $('player-input').keypress(function(event) {
        if(event.which == 13){
            makeAGuess(game);
        }
    })

    $('#hint').click(function() {
        var hints = game.provideHint();
        $('#title').text('The winning number is '+hints[0]+', '+hints[1]+', or '+hints[2]);
    })

    $('#reset').click(function() {
        game = newGame();
        $('#title').text('Play the Guessing Game!');
        $('#subtitle').text('Guess a number between 1-100!')
        $('.guess').text('-');
        $('#hint, #submit').prop("disabled",false);

    })
})


/*

Code prior to jQuery integration: 


Game.prototype.checkGuess = function(){
    if(this.playersGuess === this.winningNumber){
        return "You Win!"
    }else{
        if(this.pastGuesses.indexOf(this.playersGuess) > -1){
            return "You have already guessed that number."
        }else{
            this.pastGuesses.push(this.playersGuess);
            if(this.pastGuesses.length === 5){
                return "You Lose."
            }else{
                var diff = this.difference();
                if(diff < 10){
                    return "You\'re burning up!"
                }else if(diff < 25){
                    return "You\'re lukewarm."
                }else if(diff < 50){
                    return "You\'re a bit chilly."
                }else{
                    return "You\'re ice cold!"
                }
            }
        }
    }
};

*/