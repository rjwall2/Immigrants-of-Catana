import {gameTile} from "./gameTile.js";
import { road } from "./road.js";
import {vertex} from "./vertex.js";


export class gameBoard{
    mapCounter = 0;
    tileArray = [];
    tileMap = new Map([]);
    vertexMap = new Map([]);
    roadMap = new Map([]);

    constructor(){}

    static shuffle(array) { //function from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
        let currentIndex = array.length,  randomIndex;
    
        // While there remain elements to shuffle.
        while (currentIndex != 0) {
    
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
    
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
    
        return array; 
    }   

    makeTiles(){ //initializes the (non-randomized) array of all tiles on board
        const possibleNumbers = [2,3,3,4,4,5,5,6,6,8,8,9,9,10,10,11,11,12];
        const randomizedNumbers = gameBoard.shuffle(possibleNumbers);
        //make wood tiles
        for(let i = 0 ; i<4; i++){
            let woodTile = new gameTile("Wood",randomizedNumbers[i],false);
            this.tileArray.push(woodTile);
        }
        //make wheat tiles
        for(let i = 4 ; i<8; i++){
            let wheatTile = new gameTile("Wheat",randomizedNumbers[i],false);
            this.tileArray.push(wheatTile);
        }
        //make sheep tiles
        for(let i = 8 ; i<12; i++){
            let sheepTile = new gameTile("Sheep",randomizedNumbers[i],false);
            this.tileArray.push(sheepTile);
        }
        //make brick tiles
        for(let i = 12 ; i<15; i++){
            let brickTile = new gameTile("Brick",randomizedNumbers[i],false);
            this.tileArray.push(brickTile);
        }
        //make stone tiles
        for(let i = 15 ; i<18; i++){
            let stoneTile = new gameTile("Rock",randomizedNumbers[i],false);
            this.tileArray.push(stoneTile);
        }
        //make desert tile
        this.tileArray.push(new gameTile("Desert",0,true));

        this.tileArray = gameBoard.shuffle(this.tileArray);
    }

    createTileSVG(row, column){ //0 based index, creates the visual representation of a gametile
        let originalXCoordinates = [75,127.5,127.5,75,22.5,22.5];
        let originalYCoordinates = [37.5,67.5,127.5,157.5,127.5,67.5];
        if(row%2 !=0){
            originalXCoordinates.forEach((currentElement,index) => {originalXCoordinates[index]=currentElement+62.5});
        }
        const horizontalSpace = 125;
        const verticalSpace = 114;
        let horizontalSeperation = column*horizontalSpace;
        let verticalSeperation = row*verticalSpace;
        originalXCoordinates.forEach((currentElement,index,array) => {originalXCoordinates[index] = currentElement+horizontalSeperation});
        originalYCoordinates.forEach((currentElement,index,array)=>{originalYCoordinates[index] = currentElement+verticalSeperation});
        const newPositionString = ""+originalXCoordinates[0]+" "+originalYCoordinates[0]+", "+originalXCoordinates[1]+" "+originalYCoordinates[1]+", "+originalXCoordinates[2]+" "+originalYCoordinates[2]+", "+originalXCoordinates[3]+" "+originalYCoordinates[3]+", "+originalXCoordinates[4]+" "+originalYCoordinates[4]+", "+originalXCoordinates[5]+" "+originalYCoordinates[5];
        const id = "T"+row+"."+column;
        const xmlns = "http://www.w3.org/2000/svg";
        const svg = document.getElementById("board");
        const newPolygon = document.createElementNS(xmlns,"polygon");
        newPolygon.setAttribute("id", id);
        newPolygon.setAttribute("points", newPositionString);
        newPolygon.setAttribute("stroke", "black");
        newPolygon.setAttribute("fill", "white");
        newPolygon.setAttribute("stroke-width", "5");

        // newPolygon.addEventListener("click",tileClicked);///////////////////////////////////////////////////////////uncomment this when done
        this.tileMap.set(id,this.tileArray[this.mapCounter]);
        this.tileArray[this.mapCounter].setPosition(id);       

        //add image svg
        let tileType = this.tileArray[this.mapCounter].resource;
        newPolygon.setAttribute("fill", "url(#"+tileType+")");

        //add number value to tile
        const newCircle = document.createElementNS(xmlns, "circle");
        newCircle.setAttribute("id", id);
        newCircle.setAttribute("cx",originalXCoordinates[3])
        newCircle.setAttribute("cy",originalYCoordinates[2])
        newCircle.setAttribute("r","20")
        newCircle.setAttribute("stroke", "black");
        newCircle.setAttribute("fill", "white");
        newCircle.setAttribute("stroke-width", "2");
        // newCircle.addEventListener("click",tileClicked);///////////////////////////////////////////////////////////uncomment this when done

        //add number to circle
        let numberColor = null;
        switch(this.tileArray[this.mapCounter].number){
            case 12:
                numberColor = "Gold";
                break;
            case 2:
                numberColor = "Gold";
                break;
            case 11:
                numberColor ="Orange";
                break;
            case 3:
                numberColor ="Orange";
                break;
            case 10:
                numberColor ="OrangeRed";
                break;
            case 4:
                numberColor ="OrangeRed";
                break;
            case 9:
                numberColor ="FireBrick";     
                break;
            case 5:
                numberColor ="FireBrick";
                break;
            case 6:
                numberColor ="Maroon";
                break;
            case 8:
                numberColor ="Maroon";
                break;
            default:
                numberColor="White"
        }
        const newText = document.createElementNS(xmlns,"text");      
        newText.setAttribute("id", id);
        newText.setAttribute("x",originalXCoordinates[3]);
        newText.setAttribute("y",originalYCoordinates[2]+9);
        newText.setAttribute("fill","black");
        newText.setAttribute("text-anchor","middle"); 
        newText.setAttribute("font-size","2.2em");
        newText.setAttribute("fill",numberColor);
        newText.innerHTML = this.tileArray[this.mapCounter].number;
        // newText.addEventListener("click",tileClicked);///////////////////////////////////////////////////////////uncomment this when done

        svg.appendChild(newPolygon);
        svg.append(newCircle);
        svg.append(newText);
        this.mapCounter++;  

    }

    createVertex(row, column){ // 0 based index
        const angledVertical = 34;
        const straightVertical = 80;
        const fullHorizontal = 125;
        const halfHorizontal = 62.5;

        const originalXCoordinates = 137.5;
        const originalYCoordinates = 23.5;

        let newXCoordinates = originalXCoordinates + (fullHorizontal*(column/2));
        const newYCoordinates = originalYCoordinates + (angledVertical * Math.ceil(row/2) + straightVertical*Math.floor(row/2));
        if(column%2 !=0){
            newXCoordinates = originalXCoordinates + halfHorizontal + (fullHorizontal * ((column-1)/2));
        }
        let pointOneX = newXCoordinates;
        let pointOneY = newYCoordinates -11;
        let pointTwoX = newXCoordinates + 8.66;
        let pointTwoY = newYCoordinates + 7;
        let pointThreeX = newXCoordinates -8.66;
        let pointThreeY = newYCoordinates + 7; //points ordered clockwise starting from top

        if(row%2 == 0){ //triagnle is upsidedown
            pointOneX = newXCoordinates;
            pointOneY = newYCoordinates +11;
            pointTwoX = newXCoordinates - 8.66;
            pointTwoY = newYCoordinates - 7;
            pointThreeX = newXCoordinates +8.66;
            pointThreeY = newYCoordinates - 7; //points ordered clockwise starting from bottom
        }

        const xmlns = "http://www.w3.org/2000/svg";
        const svg = document.getElementById("board");
        const newTriangle = document.createElementNS(xmlns,"polygon");
        const id = ""+row+"."+column;
        newTriangle.setAttribute("id", id);
        newTriangle.setAttribute("points",""+pointOneX+" "+pointOneY+", "+pointTwoX+" "+pointTwoY+", "+pointThreeX+" "+pointThreeY);
        newTriangle.setAttribute("stroke", "black");
        newTriangle.setAttribute("fill","white");
        newTriangle.setAttribute("stroke-width", "2.5");
        svg.appendChild(newTriangle);

        this.vertexMap.set(id,new vertex(id));

        const returnResults = [pointOneX,pointOneY,pointTwoX,pointTwoY,pointThreeX,pointThreeY];
        return returnResults;

    }

    createRoadUp(pointsOne, pointsTwo,rowColumnOne, rowColumnTwo){
        const id = ""+rowColumnOne+":"+rowColumnTwo;
        const xmlns = "http://www.w3.org/2000/svg";
        const svg = document.getElementById("board");
        const newRectangle = document.createElementNS(xmlns,"polygon");
        newRectangle.setAttribute("id", id);
        newRectangle.setAttribute("points",""+pointsOne[0]+" "+pointsOne[1]+", "+pointsOne[2]+" "+pointsOne[3]+", "+pointsTwo[0]+" "+pointsTwo[1]+", "+pointsTwo[2]+" "+pointsTwo[3]);
        newRectangle.setAttribute("stroke", "black");
        newRectangle.setAttribute("fill","white");
        newRectangle.setAttribute("stroke-width", "2.5");
        svg.appendChild(newRectangle);

        this.roadMap.set(id,new road(rowColumnOne,rowColumnTwo));
    }

    createRoadDown(pointsOne, pointsTwo,rowColumnOne, rowColumnTwo){
        const id = ""+rowColumnOne+":"+rowColumnTwo;
        const xmlns = "http://www.w3.org/2000/svg";
        const svg = document.getElementById("board");
        const newRectangle = document.createElementNS(xmlns,"polygon");
        newRectangle.setAttribute("id", id);
        newRectangle.setAttribute("points",""+pointsTwo[0]+" "+pointsTwo[1]+", "+pointsTwo[4]+" "+pointsTwo[5]+", "+pointsOne[0]+" "+pointsOne[1]+", "+pointsOne[4]+" "+pointsOne[5]);
        newRectangle.setAttribute("stroke", "black");
        newRectangle.setAttribute("fill","white");
        newRectangle.setAttribute("stroke-width", "2.5");
        svg.appendChild(newRectangle);

        this.roadMap.set(id,new road(rowColumnOne,rowColumnTwo));
    }

    createRoadVertical (pointsOne, row, column){


        const verticalPoint1 =[pointsOne[2], pointsOne[3]+65];
        const verticalPoint2 =[pointsOne[4], pointsOne[5]+65];

        const firstRowColumn = ""+row+"."+column;
        const secondRow = row+1;
        const secondRowColumn = ""+secondRow+"."+column;
        const id = ""+firstRowColumn+":"+secondRowColumn;
    

        const xmlns = "http://www.w3.org/2000/svg";
        const svg = document.getElementById("board");
        const newRectangle = document.createElementNS(xmlns,"polygon");
        newRectangle.setAttribute("id", id);
        newRectangle.setAttribute("points",""+pointsOne[2]+" "+pointsOne[3]+", "+pointsOne[4]+" "+pointsOne[5]+", "+verticalPoint2[0]+" "+verticalPoint2[1]+", "+verticalPoint1[0]+" "+verticalPoint1[1]);
        newRectangle.setAttribute("stroke", "black");
        newRectangle.setAttribute("fill","white");
        newRectangle.setAttribute("stroke-width", "2.5");
        svg.appendChild(newRectangle);
        
        this.roadMap.set(id,new road(firstRowColumn,secondRowColumn));

    }

    connectVertexToTiles(){

        let topLeft =[1,0];
        let topMiddle =[0,1];
        let topRight =[1,2];
        let bottomLeft =[2,2];
        let bottomMiddle =[3,1];
        let bottomRight =[2,0];

        this.tileMap.forEach((value, key) =>{ 
            let row = Number(key.slice(1,key.indexOf(".")));
            let column = Number(key.slice(key.indexOf(".")+1));
            let additionFactor = 0;
            let vertexArray = [];

            if(row == 2){
                column--;
            }
            if(row == 0 || row == 4){
                additionFactor = 2;
            }
            if(row == 1 || row ==3){
                additionFactor = 1;
            }
                
                vertexArray.push(this.vertexMap.get(""+(row+row+topLeft[0])+"."+(column+topLeft[1] + (column-additionFactor))));
                vertexArray.push(this.vertexMap.get(""+(row+row+topMiddle[0])+"."+(column+topMiddle[1] + (column-additionFactor))));
                vertexArray.push(this.vertexMap.get(""+(row+row+topRight[0])+"."+(column+topRight[1] + (column-additionFactor))));
                vertexArray.push(this.vertexMap.get(""+(row+row+bottomLeft[0])+"."+(column+bottomLeft[1] + (column-additionFactor))));
                vertexArray.push(this.vertexMap.get(""+(row+row+bottomMiddle[0])+"."+(column+bottomMiddle[1] + (column-additionFactor))));
                vertexArray.push(this.vertexMap.get(""+(row+row+bottomRight[0])+"."+(column+bottomRight[1] + (column-additionFactor))));

                vertexArray.forEach(element =>element.addTile(value)); 


        })
    }

    initializeBoard(){

    this.makeTiles();

    this.createTileSVG(0,2);
    this.createTileSVG(0,3);
    this.createTileSVG(0,4);

    this.createTileSVG(1,1);
    this.createTileSVG(1,2);
    this.createTileSVG(1,3);
    this.createTileSVG(1,4);

    this.createTileSVG(2,1);
    this.createTileSVG(2,2);
    this.createTileSVG(2,3);
    this.createTileSVG(2,4);
    this.createTileSVG(2,5);

    this.createTileSVG(3,1);
    this.createTileSVG(3,2);
    this.createTileSVG(3,3);
    this.createTileSVG(3,4);

    this.createTileSVG(4,2);
    this.createTileSVG(4,3);
    this.createTileSVG(4,4);


    let vertexPoints1 = this.createVertex(1,2);
    let vertexPoints2 = this.createVertex(0,3);
    this.createRoadUp(vertexPoints1, vertexPoints2, "1.2", "0.3");

    this.createRoadVertical(vertexPoints1, 1, 2);

    vertexPoints1 = this.createVertex(1,4);
    this.createRoadDown(vertexPoints2, vertexPoints1, "0.3", "1.4");

    this.createRoadVertical(vertexPoints1, 1, 4);

    vertexPoints2 = this.createVertex(0,5);
    this.createRoadUp(vertexPoints1,vertexPoints2, "1.4", "0.5");

    vertexPoints1 = this.createVertex(1,6);
    this.createRoadDown(vertexPoints2,vertexPoints1, "0.5", "1.6");

    this.createRoadVertical(vertexPoints1, 1, 6);

    vertexPoints2 = this.createVertex(0,7);
    this.createRoadUp(vertexPoints1,vertexPoints2, "1.6", "0.7");

    vertexPoints1 = this.createVertex(1,8); 
    this.createRoadDown(vertexPoints2,vertexPoints1, "0.7", "1.8");

    this.createRoadVertical(vertexPoints1, 1, 8);


    vertexPoints1 = this.createVertex(3,1);
    vertexPoints2 = this.createVertex(2,2);
    this.createRoadUp(vertexPoints1, vertexPoints2, "3.1", "2.2");

    this.createRoadVertical(vertexPoints1, 3, 1);

    vertexPoints1 = this.createVertex(3,3);
    this.createRoadDown(vertexPoints2,vertexPoints1, "2.2", "3.3");

    this.createRoadVertical(vertexPoints1, 3, 3);

    vertexPoints2 = this.createVertex(2,4);
    this.createRoadUp(vertexPoints1, vertexPoints2, "3.3", "2.4");

    vertexPoints1 = this.createVertex(3,5);
    this.createRoadDown(vertexPoints2,vertexPoints1, "2.4", "3.5");

    this.createRoadVertical(vertexPoints1, 3, 5);

    vertexPoints2 = this.createVertex(2,6);
    this.createRoadUp(vertexPoints1, vertexPoints2, "3.5", "2.6");

    vertexPoints1 = this.createVertex(3,7);
    this.createRoadDown(vertexPoints2,vertexPoints1, "2.4", "3.7");

    this.createRoadVertical(vertexPoints1, 3, 7);

    vertexPoints2 = this.createVertex(2,8);
    this.createRoadUp(vertexPoints1, vertexPoints2, "3.7", "2.8");

    vertexPoints1 = this.createVertex(3,9);
    this.createRoadDown(vertexPoints2,vertexPoints1, "2.4", "3.9");

    this.createRoadVertical(vertexPoints1, 3,9);
    

    vertexPoints1 = this.createVertex(5,0);
    vertexPoints2 = this.createVertex(4,1);
    this.createRoadUp(vertexPoints1, vertexPoints2, "5.0", "4.1");

    this.createRoadVertical(vertexPoints1, 5, 0);

    vertexPoints1 = this.createVertex(5,2);
    this.createRoadDown(vertexPoints2,vertexPoints1, "4.1", "5.2");

    this.createRoadVertical(vertexPoints1, 5, 2);

    vertexPoints2 = this.createVertex(4,3);
    this.createRoadUp(vertexPoints1, vertexPoints2, "5.2", "4.3");

    vertexPoints1 = this.createVertex(5,4);
    this.createRoadDown(vertexPoints2,vertexPoints1, "4.3", "5.4");

    this.createRoadVertical(vertexPoints1, 5, 4);

    vertexPoints2 = this.createVertex(4,5);
    this.createRoadUp(vertexPoints1, vertexPoints2, "5.4", "4.5");

    vertexPoints1 = this.createVertex(5,6);
    this.createRoadDown(vertexPoints2,vertexPoints1, "4.5", "5.6");

    this.createRoadVertical(vertexPoints1, 5, 6);

    vertexPoints2 = this.createVertex(4,7);
    this.createRoadUp(vertexPoints1, vertexPoints2, "5.6", "4.7");

    vertexPoints1 = this.createVertex(5,8);
    this.createRoadDown(vertexPoints2,vertexPoints1, "4.7", "5.8");

    this.createRoadVertical(vertexPoints1, 5,8);

    vertexPoints2 = this.createVertex(4,9);
    this.createRoadUp(vertexPoints1, vertexPoints2, "5.8", "4.9");

    vertexPoints1 = this.createVertex(5,10);
    this.createRoadDown(vertexPoints2,vertexPoints1, "4.9", "5.10");

    this.createRoadVertical(vertexPoints1, 5,10);


    vertexPoints1 = this.createVertex(6,0);
    vertexPoints2 = this.createVertex(7,1);
    this.createRoadDown(vertexPoints1, vertexPoints2, "5.0", "4.1");

    this.createRoadVertical(vertexPoints2, 7, 1);

    vertexPoints1 = this.createVertex(6,2);
    this.createRoadUp(vertexPoints1, vertexPoints2, "7.1", "6.1");

    vertexPoints2 = this.createVertex(7,3);
    this.createRoadDown(vertexPoints2,vertexPoints1, "6.1", "7.3");

    this.createRoadVertical(vertexPoints2, 7, 3);

    vertexPoints1 = this.createVertex(6,4);
    this.createRoadUp(vertexPoints1, vertexPoints2, "7.3", "6.4");

    vertexPoints2 = this.createVertex(7,5);
    this.createRoadDown(vertexPoints2,vertexPoints1, "6.4", "7.5");

    this.createRoadVertical(vertexPoints2, 7,5);

    vertexPoints1 = this.createVertex(6,6);
    this.createRoadUp(vertexPoints1, vertexPoints2, "7.5", "6.6");

    vertexPoints2 = this.createVertex(7,7);
    this.createRoadDown(vertexPoints2,vertexPoints1, "6.6", "7.7");

    this.createRoadVertical(vertexPoints2, 7,7);

    vertexPoints1 = this.createVertex(6,8);
    this.createRoadUp(vertexPoints1, vertexPoints2, "7.7", "6.8");

    vertexPoints2 = this.createVertex(7,9);
    this.createRoadDown(vertexPoints2,vertexPoints1, "6.8", "7.9");

    this.createRoadVertical(vertexPoints2, 7,9);

    vertexPoints1 = this.createVertex(6,10);
    this.createRoadUp(vertexPoints1, vertexPoints2, "7.7", "6.10");


    vertexPoints1 = this.createVertex(8,1);
    vertexPoints2 = this.createVertex(9,2);
    this.createRoadDown(vertexPoints1, vertexPoints2, "8.1", "9.2");

    this.createRoadVertical(vertexPoints2, 9, 2);

    vertexPoints1 = this.createVertex(8,3);
    this.createRoadUp(vertexPoints1, vertexPoints2, "9.2", "8.3");

    vertexPoints2 = this.createVertex(9,4);
    this.createRoadDown(vertexPoints2,vertexPoints1, "8.3", "9.4");

    this.createRoadVertical(vertexPoints2, 9, 4);

    vertexPoints1 = this.createVertex(8,5);
    this.createRoadUp(vertexPoints1, vertexPoints2, "9.4", "8.5");

    vertexPoints2 = this.createVertex(9,6);
    this.createRoadDown(vertexPoints2,vertexPoints1, "8.5", "9.6");

    this.createRoadVertical(vertexPoints2, 9,6);       

    vertexPoints1 = this.createVertex(8,7);
    this.createRoadUp(vertexPoints1, vertexPoints2, "9.6", "8.7");

    vertexPoints2 = this.createVertex(9,8);
    this.createRoadDown(vertexPoints2,vertexPoints1, "8.7", "9.8");

    this.createRoadVertical(vertexPoints2, 9,8);

    vertexPoints1 = this.createVertex(8,9);
    this.createRoadUp(vertexPoints1, vertexPoints2, "9.8", "8.9");


    vertexPoints1 = this.createVertex(10,2);
    vertexPoints2 = this.createVertex(11,3);
    this.createRoadDown(vertexPoints1, vertexPoints2, "10.2", "11.3");

    vertexPoints1 = this.createVertex(10,4);
    this.createRoadUp(vertexPoints1, vertexPoints2, "11.3", "10.4");

    vertexPoints2 = this.createVertex(11,5);
    this.createRoadDown(vertexPoints2,vertexPoints1, "10.4", "11.5");

    vertexPoints1 = this.createVertex(10,6);
    this.createRoadUp(vertexPoints1, vertexPoints2, "11.5", "10.6");

    vertexPoints2 = this.createVertex(11,7);
    this.createRoadDown(vertexPoints2,vertexPoints1, "10.6", "11.7");

    vertexPoints1 = this.createVertex(10,8);
    this.createRoadUp(vertexPoints1, vertexPoints2, "11.7", "10.8");

    this.connectVertexToTiles();

    }
}



