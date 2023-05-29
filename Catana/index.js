import {gameBoard} from "./gameBoard.js";




let board = new gameBoard();   
board.initializeBoard();    
console.log(board.tileMap);
board.tileArray.forEach((element) => {console.log(element.position)});   
board.vertexMap.forEach((element) => console.log(element));           


