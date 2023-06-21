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
    errorText = document.getElementById("ErrorMessage");
    currentPlayerOffer = [];
    opponentOffer = [];
    

    constructor(playerNames){
        playerNames.forEach((element,index)=>{         
            
            this.players.set(index,new player(index,element))

        })
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
            playerFrame.setAttribute("style","background: white; height: 14.5%; width: 40%; border: inset");
            playerFrame.setAttribute("border","2px solid")
            const playerHeader = document.createElement("h2");
            playerHeader.setAttribute("style", "font-family: Copperplate Gothic;margin-bottom: 0px;margin-top: 0px; color: "+this.currentPlayer.color)
            playerHeader.innerHTML = this.currentPlayer.name;
            playerFrame.append(playerHeader);
            document.body.append(playerFrame);
            this.finishTurn();

        }



        for(let i = 0; i<this.players.size; i++){
            this.outputText.innerHTML= this.currentPlayer.name+", please select a settlement";
            while(this.currentPlayer.initialTurns!=2){
                await this.waitForPlayer(50);
            }
            this.finishTurn(); 
        }

        this.reverseOrderTurn();
        for(let i = 0; i<this.players.size; i++){
            this.outputText.innerHTML= this.currentPlayer.name+", please select another settlement";
            while(this.currentPlayer.initialTurns!=0){
                await this.waitForPlayer(50);
            }
            this.reverseOrderTurn(); 
        }
        this.finishTurn();
        
        for(let i = 0; i<this.players.size; i++){
            this.outputText.innerHTML=this.currentPlayer.name+", please select one of your settlments to gather initial resources";
            while(this.currentPlayer.initialTurns!=-1){
                await this.waitForPlayer(50);
            }
            this.finishTurn(); 
        }
        
        this.linkButtons();
        this.outputText.innerHTML=this.currentPlayer.name+", please roll the dice!";
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
            this.outputText.innerHTML=this.currentPlayer.name+", a "+numberRolled+" was rolled, you may build, trade, or end your turn";
        }
    }

    async sevenProtocol(){
        document.getElementById("endTurnButton").disabled = true;
        document.getElementById("tradeButton").disabled = true;
        console.log(document.getElementById("endTurnButton").disabled)
        this.players.forEach((player)=>{player.robPlayer();})
        this.currentPlayer.movingRobber=true;
        this.currentPlayer.stealing=true;
        this.outputText.innerHTML=this.currentPlayer.name+", a 7 was rolled, please move the robber";
        while(this.currentPlayer.movingRobber){
            await this.waitForPlayer(50);
        }
        this.outputText.innerHTML=this.currentPlayer.name+", please select a peripheral opponent vertex to steal from";
        while(this.currentPlayer.stealing){
            await this.waitForPlayer(50);
        }
        document.getElementById("endTurnButton").disabled = false;
        document.getElementById("tradeButton").disabled = false;
        this.outputText.innerHTML=this.currentPlayer.name+", you may build, trade, or end your turn";
    }

    trade(){

        let currentPlayerTrader = document.getElementById(this.currentPlayer.name).cloneNode(true);
        currentPlayerTrader.setAttribute("style","height: 100%; width: 100%;");
        document.getElementById("current_cards").appendChild(currentPlayerTrader);
        let opponentPlayerTrader = document.getElementById("opponent_cards");

        this.players.forEach((player)=>{
            if(player.name==this.currentPlayer.name){
                //do not add current player as an opponent
            }else{
                let playerSelectButton = document.createElement("button");
                let id = player.name;
                playerSelectButton.innerHTML=player.name;
                playerSelectButton.addEventListener("click",()=>{
                    while(opponentPlayerTrader.firstChild){
                        opponentPlayerTrader.removeChild(opponentPlayerTrader.firstChild);
                    }
                    let selectedOpponent = document.getElementById(id).cloneNode(true);
                    selectedOpponent.setAttribute("style","height: 100%; width: 100%;");
                    opponentPlayerTrader.appendChild(selectedOpponent);
                    currentPlayerTrader.querySelectorAll(".card").forEach((button)=>{
                        button.addEventListener("click",()=>{
                            button.classList.toggle("clicked");
                            if(button.classList.contains("clicked")){
                                this.currentPlayerOffer.push(button.classList.item(0));
                            }else{
                                this.currentPlayerOffer.splice(this.currentPlayerOffer.indexOf(button.classList.item(0)),1);
                            }
                            console.log("current player offer: "+this.currentPlayerOffer);
                            console.log("opponent player offer: "+this.opponentOffer);   
            
                        })
                    })
                    opponentPlayerTrader.querySelectorAll(".card").forEach((button)=>{
                        button.addEventListener("click",()=>{
                            button.classList.toggle("clicked");
                            if(button.classList.contains("clicked")){
                                this.opponentOffer.push(button.classList.item(0));
                            }else{
                                this.opponentOffer.splice(this.opponentOffer.indexOf(button.classList.item(0)),1);
                            }
                            console.log("current player offer: "+this.currentPlayerOffer);
                            console.log("opponent player offer: "+this.opponentOffer);
                        })
                    })

                })
                opponentPlayerTrader.appendChild(playerSelectButton);


            }

        })
    }

    linkButtons(){
        let endTurnButton = document.getElementById("endTurnButton");
        let tradeButton = document.getElementById("tradeButton");
        let rollDiceButton = document.getElementById("rollDiceButton");
        let tradeWindow = document.getElementById("trade_window");
        let overlay = document.getElementById("overlay");

        //bind ensures that the button knows that the specific object to refer to ex the attributes is this specific game
        endTurnButton.addEventListener("click",()=>{
            let finishThisTurn = this.finishTurn.bind(this);
            finishThisTurn();
            document.getElementById("endTurnButton").disabled = true;
            document.getElementById("tradeButton").disabled = true;
            document.getElementById("rollDiceButton").disabled = false;
            this.errorText.innerHTML="";
            this.outputText.innerHTML= this.currentPlayer.name+", please roll the dice!";}); 
        
        
        rollDiceButton.addEventListener("click",()=>{
            document.getElementById("rollDiceButton").disabled = true;
            document.getElementById("tradeButton").disabled = false;
            document.getElementById("endTurnButton").disabled = false;
            
            let rollThisDice = this.rollDice.bind(this);
            rollThisDice();
        });

        tradeButton.addEventListener("click",()=>{
            this.errorText.innerHTML="";
            tradeWindow.classList.add("active")
            overlay.classList.add("active");
            let trade = this.trade.bind(this);
            trade();
        });

        overlay.addEventListener("click", ()=>{
            if(overlay.classList.contains("active")){
                tradeWindow.classList.remove("active")
                overlay.classList.remove("active");
                document.querySelectorAll(".trader").forEach((traderWindow)=>{
                    if(traderWindow.firstChild!=null){
                        traderWindow.removeChild(traderWindow.firstChild)
                    }
                });
            }
        });
    }

}