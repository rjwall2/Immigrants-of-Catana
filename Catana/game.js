import { gameBoard } from "./gameBoard.js";
import { player } from "./player.js";

export class game{
    board;
    diceNumber;
    turnNumber;
    players = new Map([]);
    currentPlayer;
    outputText = document.getElementById("GameInfo");
    currentPlayerText= document.getElementById("CurrentTurnName");

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
        this.currentPlayerText.innerHTML = "It is currently " + this.currentPlayer.name+ "'s turn";
        let turnOrder = [];
        for(let i=0; i<this.players.size;i++){
            turnOrder.push(this.currentPlayer.name);
            this.finishTurn();
        }

        let turnOrderString = "The turn order will be: ";
        for(let i=0; i<this.players.size;i++){
            turnOrderString+=turnOrder[i];
            turnOrderString+=" 🡒 "
        }
        turnOrderString = turnOrderString.slice(0,-3);
        turnOrderString+="↺";
        document.getElementById("TurnOrder").innerHTML=turnOrderString;

        for(let i=0; i<this.players.size;i++){
            const playerFrame = document.createElement("div");
            playerFrame.setAttribute("id",this.currentPlayer.name);
            playerFrame.setAttribute("style","height: 14.5%; width: 40%; border: inset");
            playerFrame.setAttribute("border","2px solid")
            const playerHeader = document.createElement("h2");
            playerHeader.setAttribute("style", "font-family: Copperplate Gothic;margin-bottom: 0px;margin-top: 0px; color: "+this.currentPlayer.color)
            playerHeader.innerHTML = this.currentPlayer.name;
            playerFrame.append(playerHeader);
            document.body.append(playerFrame);
            this.finishTurn();

        }



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
            this.finishTurn(); 
        }
        
        this.linkButtons();
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
        console.log(this.players.size);

        if(this.turnNumber == this.players.size -1){
            this.turnNumber = 0;
        }else{
            this.turnNumber++;
        }
        this.currentPlayer = this.players.get(this.turnNumber);
        this.board.setCurrentPlayer(this.currentPlayer);
        
        this.currentPlayerText.innerHTML = "It is currently " + this.currentPlayer.name+ "'s turn";
    }

    reverseOrderTurn(){
        if(this.turnNumber == 0){
            this.turnNumber = this.players.size -1;
        }else{
            this.turnNumber--;
        }
        this.currentPlayer = this.players.get(this.turnNumber);
        this.board.setCurrentPlayer(this.currentPlayer);
        this.currentPlayerText.innerHTML = "It is currently " + this.currentPlayer.name+ "'s turn";
    }

    collectResources(numberRolled){

    }

    vertexClicked(){

    }

    startTrade(){

    }

    linkButtons(){
        let endTurnButton = document.getElementById("endTurnButton");
        let tradeButton = document.getElementById("tradeButton");
        let rollDiceButton = document.getElementById("rollDiceButton");

        endTurnButton.addEventListener("click",this.finishTurn.bind(this)); //bind ensures that the button knows that the specific object to refer to ex the attributes is this specific game
        tradeButton.addEventListener("click", this.startTrade.bind(this));
        rollDiceButton.addEventListener("click", this.rollDice.bind(this));
    }

}