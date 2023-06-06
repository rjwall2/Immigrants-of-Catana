import { gameBoard } from "./gameBoard.js";
import { player } from "./player.js";

export class game{
    board;
    diceNumber;
    turnNumber;
    players = new Map([]);
    currentPlayer;
    initialization = true

    constructor(...playerNames){
        playerNames.forEach((element,index)=>{this.players.set(index,new player(index,element))})
        this.board = new gameBoard();
        this.board.initializeBoard();      
    }

    initializeGame(){
        let initialRollNumbers = [];
        for(let i = 0; i<this.players.size;i++){ 
            initialRollNumbers.push(this.rollDice()); 
        }
        const goFirst = initialRollNumbers.indexOf(Math.max(...initialRollNumbers));
        this.currentPlayer = this.players.get(goFirst);
        this.turnNumber = goFirst; 
        this.board.setCurrentPlayer(this.currentPlayer);

        for(let i = 0; i<this.players.size; i++){

            while(this.currentPlayer.initialTurns != 2){////does not work, use some other async method

            }
            this.finishTurn
        }

        

        
        // this.initialization = false;
        // this.board.setInitializationStatus(this.initialization);
    }

    rollDice(){
        let dice1 = Math.floor(Math.random() * 6)+1;
        let dice2 = Math.floor(Math.random() * 6)+1;
        this.diceNumber = dice1+dice2;
        return this.diceNumber;
    }

    finishTurn(){
        if(turnNumber == this.players.size -1){
            this.turnNumber = 0;
        }else{
            this.turnNumber++;
        }
        this.currentPlayer = players.get(this.turnNumber);
        this.board.setCurrentPlayer(this.currentPlayer);
    }

    collectResources(numberRolled){

    }

    vertexClicked(){

    }

}