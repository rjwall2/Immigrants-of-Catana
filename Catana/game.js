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
            let dice1 = Math.floor(Math.random() * 6)+1;
            let dice2 = Math.floor(Math.random() * 6)+1;
            let diceNumber = dice1 + dice2;
            initialRollNumbers.push(diceNumber); 
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
                await this.waitForPlayer(50);
            }
            this.finishTurn(); 
        }

        this.reverseOrderTurn();
        for(let i = 0; i<this.players.size; i++){
            while(this.currentPlayer.initialTurns!=0){
                await this.waitForPlayer(50);
            }
            this.reverseOrderTurn(); 
        }
        this.finishTurn();
        
        for(let i = 0; i<this.players.size; i++){
            while(this.currentPlayer.initialTurns!=-1){
                await this.waitForPlayer(50);
            }
            this.finishTurn(); 
        }
        
        this.linkButtons();
        document.getElementById("endTurnButton").disabled = true;
        document.getElementById("tradeButton").disabled = true;
    }

    waitForPlayer(ms) {
        return new Promise((resolve) => {setTimeout(resolve,ms)});
    }

    rollDice(){
        
        let dice1 = Math.floor(Math.random() * 6)+1;
        let dice2 = Math.floor(Math.random() * 6)+1;
        this.diceNumber = dice1+dice2;
        this.collectResources(this.diceNumber);
        document.getElementById("rollDiceButton").disabled = true;
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
        console.log("Number rolled: "+numberRolled);

        if(numberRolled==7){
            this.sevenProtocol();
        }else{
            this.players.forEach((player)=>{ //for every player
                let playerVertices = player.ownedVertices;
                playerVertices.forEach((vertex)=>{ //for every vertex of a player
                    let power = vertex.power;
                    let vertexTiles = vertex.tiles;
                    vertexTiles.forEach((tile)=>{ //for every tile of a vertex
                        if(tile.number == numberRolled && tile.robberStatus==false){
                            for(let i = 0; i<power;i++){
                                player.addResourceCard(tile.resource);
                            }
                        }
                    })
                })
            })
        }
    }

    async sevenProtocol(){
        document.getElementById("endTurnButton").disabled = true;
        document.getElementById("tradeButton").disabled = true;
        console.log(document.getElementById("endTurnButton").disabled)
        this.players.forEach((player)=>{player.robPlayer();})
        this.currentPlayer.movingRobber=true;
        this.currentPlayer.stealing=true;
        while(this.currentPlayer.movingRobber){
            await this.waitForPlayer(50);
        }
        while(this.currentPlayer.stealing){
            await this.waitForPlayer(50);
        }
        document.getElementById("endTurnButton").disabled = false;
        document.getElementById("tradeButton").disabled = false;
        //keep writing here 
    }

    vertexClicked(){

    }

    startTrade(){
        console.log("Should not run yet3")

    }

    linkButtons(){
        let endTurnButton = document.getElementById("endTurnButton");
        let tradeButton = document.getElementById("tradeButton");
        let rollDiceButton = document.getElementById("rollDiceButton");

        //bind ensures that the button knows that the specific object to refer to ex the attributes is this specific game
        endTurnButton.addEventListener("click",()=>{
            let finishThisTurn = this.finishTurn.bind(this);
            finishThisTurn();
            document.getElementById("endTurnButton").disabled = true;
            document.getElementById("tradeButton").disabled = true;
            document.getElementById("rollDiceButton").disabled = false;}); 
        
        tradeButton.addEventListener("click", this.startTrade.bind(this));
        
        rollDiceButton.addEventListener("click",()=>{
            document.getElementById("rollDiceButton").disabled = true;
            document.getElementById("tradeButton").disabled = false;
            document.getElementById("endTurnButton").disabled = false;
            let rollThisDice = this.rollDice.bind(this);
            rollThisDice();
        });
    }

}