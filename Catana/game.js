import { gameBoard } from "./gameBoard.js";
import { player } from "./player.js";

export class game{
    board;
    diceNumber;
    turnNumber;
    players = new Map([]);
    currentPlayer;

    constructor(...playerNames){
        playerNames.forEach((element,index)=>{this.players.set(index,new player(index,element))})
        this.board = new gameBoard();
        this.board.initializeBoard();
        this.currentPlayer = this.players.get(0);
     
    } 

    async initializeGame(){
        let initialRollNumbers = [];
        for(let i = 0; i<this.players.size;i++){ 
            initialRollNumbers.push(this.rollDice()); 
        }
        const goFirst = initialRollNumbers.indexOf(Math.max(...initialRollNumbers)); 
        this.currentPlayer = this.players.get(goFirst);
        this.turnNumber = goFirst; 
        this.board.setCurrentPlayer(this.currentPlayer);   


        for(let i = 0; i<this.players.size; i++){
            while(this.currentPlayer.initialTurns!=2){
                await this.checkFirstInitialTurn(50);
            }
            this.finishTurn(); 
        }

        this.reverseOrderTurn();
        for(let i = 0; i<this.players.size; i++){
            while(this.currentPlayer.initialTurns!=0){
                await this.checkFirstInitialTurn(50);
            }
            this.reverseOrderTurn(); 
        }
        this.finishTurn();
        
        for(let i = 0; i<this.players.size; i++){
            while(this.currentPlayer.initialTurns!=-1){
                await this.checkFirstInitialTurn(50);
            }
            console.log(this.currentPlayer);
            this.finishTurn(); 
        }
        
        
        
    }

    checkFirstInitialTurn(ms) {
        return new Promise((resolve) => {setTimeout(resolve,ms)});
    }

    rollDice(){
        let dice1 = Math.floor(Math.random() * 6)+1;
        let dice2 = Math.floor(Math.random() * 6)+1;
        this.diceNumber = dice1+dice2;
        return this.diceNumber;
    }

    finishTurn(){
        if(this.turnNumber == this.players.size -1){
            this.turnNumber = 0;
        }else{
            this.turnNumber++;
        }
        this.currentPlayer = this.players.get(this.turnNumber);
        this.board.setCurrentPlayer(this.currentPlayer);
    }

    reverseOrderTurn(){
        if(this.turnNumber == 0){
            this.turnNumber = this.players.size -1;
        }else{
            this.turnNumber--;
        }
        this.currentPlayer = this.players.get(this.turnNumber);
        this.board.setCurrentPlayer(this.currentPlayer);
    }

    collectResources(numberRolled){

    }

    vertexClicked(){

    }

}