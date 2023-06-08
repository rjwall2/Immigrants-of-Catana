import {gameBoard} from "./gameBoard.js";
import { player } from "./player.js";
import { game } from "./game.js";

let newGame = new game("Ryan","Victoria","Bunny","Mr.Cuddles");
newGame.initializeGame();

// let board = new gameBoard();      
// board.initializeBoard();    
// console.log(board.vertexMap);
// console.log(board.roadMap);


// let test = board.vertexMap.get("1.2");
// test.tiles[0].number = 202;  
// console.log(board.vertexMap); just a test, it shows that the map entries can point to the same object, and if an object is changed through one entry, its changed in all entries

// let player1 = new player(1,"Ryan");
// player1.claimElement("3.3",2,board);
// player1.claimElement("3.3",3,board);
