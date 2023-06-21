import {gameBoard} from "./gameBoard.js";
import { player } from "./player.js";
import { game } from "./game.js";

let inputtedPlayers = [localStorage.getItem("player1"),localStorage.getItem("player2"),localStorage.getItem("player3"),localStorage.getItem("player4")];
inputtedPlayers = inputtedPlayers.filter((name)=>{return (name!="" && name!=null)});


let newGame = new game(inputtedPlayers);
newGame.initializeGame();



