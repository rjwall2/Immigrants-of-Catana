import {gameTile} from "./gameTile.js";
import { road } from "./road.js";
import {vertex} from "./vertex.js";
import { player } from "./player.js";


export class gameBoard{
    mapCounter = 0;
    tileArray = [];
    tileMap = new Map([]);
    vertexMap = new Map([]);
    roadMap = new Map([]);
    claimedVerticesMap = new Map([]);
    currentPlayer;

    constructor(){}

    setCurrentPlayer(player){
        this.currentPlayer = player;
    }


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
        let originalXCoordinates = [65,117.5,117.5,65,12.5,12.5];
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
        newPolygon.setAttribute("transform", "scale("+ svg.clientHeight/640+") translate(" + svg.clientWidth/50 + ")");

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
        newCircle.setAttribute("transform", "scale("+ svg.clientHeight/640+") translate(" + svg.clientWidth/50 + ")");
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
        newText.setAttribute("transform", "scale("+ svg.clientHeight/640+")translate(" + svg.clientWidth/50 + ")");
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

        const originalXCoordinates = 127.5;
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
        newTriangle.addEventListener("click", ()=>{this.vertexClicked(id,this.currentPlayer,this);});
        newTriangle.setAttribute("transform", "scale("+ svg.clientHeight/640+")translate(" + svg.clientWidth/50 + ")");
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
        newRectangle.addEventListener("click", ()=>{this.roadClicked(id,this.currentPlayer,this);});
        newRectangle.setAttribute("transform", "scale("+ svg.clientHeight/640+")translate(" + svg.clientWidth/50 + ")");
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
        newRectangle.addEventListener("click", ()=>{this.roadClicked(id,this.currentPlayer,this);});
        newRectangle.setAttribute("transform", "scale("+ svg.clientHeight/640+")translate(" + svg.clientWidth/50 + ")");
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
        newRectangle.addEventListener("click", ()=>{this.roadClicked(id,this.currentPlayer,this);});
        newRectangle.setAttribute("transform", "scale("+ svg.clientHeight/640+")translate(" + svg.clientWidth/50 + ")");
        svg.appendChild(newRectangle);
        
        this.roadMap.set(id,new road(firstRowColumn,secondRowColumn));

    }

    createRowsTop(a1,a2,b1,b2,rowLength){
        let vertexPoints1;
        let vertexPoints2;
        vertexPoints1 = this.createVertex(a1,a2);
        vertexPoints2 = this.createVertex(b1,b2);
        this.createRoadUp(vertexPoints1, vertexPoints2, ""+a1+"."+a2, ""+b1+"."+b2);
        this.createRoadVertical(vertexPoints1, a1, a2);
        a2 += 2;
        vertexPoints1 = this.createVertex(a1,a2);
        this.createRoadDown(vertexPoints2,vertexPoints1, ""+b1+"."+b2, ""+a1+"."+a2);
        this.createRoadVertical(vertexPoints1, a1, a2);
        b2+=2;
        vertexPoints2 = this.createVertex(b1,b2);
        
        for(let i = 1; i<=rowLength; i++){
            this.createRoadUp(vertexPoints1, vertexPoints2, ""+a1+"."+a2, ""+b1+"."+b2);
            a2 += 2;
            vertexPoints1 = this.createVertex(a1,a2);
            this.createRoadDown(vertexPoints2,vertexPoints1, ""+b1+"."+b2, ""+a1+"."+a2);
            this.createRoadVertical(vertexPoints1, a1, a2);
            if(i!=rowLength){
                b2+=2;
                vertexPoints2 = this.createVertex(b1,b2);
            }
                    
        }
    }

    createRowsBottom(a1,a2,b1,b2,rowLength,lastRow){
    let vertexPoints1;
    let vertexPoints2;
    vertexPoints1 = this.createVertex(a1,a2);
    vertexPoints2 = this.createVertex(b1,b2);
    this.createRoadDown(vertexPoints1, vertexPoints2, ""+a1+"."+a2, ""+b1+"."+b2);
    if(!lastRow){
        this.createRoadVertical(vertexPoints2, b1, b2);
    }
    a2+=2;
    vertexPoints1 = this.createVertex(a1,a2);
    this.createRoadUp(vertexPoints1, vertexPoints2, ""+b1+"."+b2, ""+a1+"."+a2);
    b2+=2;
    vertexPoints2 = this.createVertex(b1,b2); 
  
    for(let i = 1; i<=rowLength; i++){
        this.createRoadDown(vertexPoints2, vertexPoints1, ""+a1+"."+a2, ""+b1+"."+b2);
        if(!lastRow){
            this.createRoadVertical(vertexPoints2, b1, b2);
        }
        a2 += 2;
        vertexPoints1 = this.createVertex(a1,a2);
        this.createRoadUp(vertexPoints1,vertexPoints2, ""+b1+"."+b2, ""+a1+"."+a2);
     
        if(i!=rowLength){
            b2+=2;
            vertexPoints2 = this.createVertex(b1,b2);
        }
                
    }
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


        this.createRowsTop(1,2,0,3,2);

        this.createRowsTop(3,1,2,2,3); 

        this.createRowsTop(5,0,4,1,4);

        this.createRowsBottom(6,0,7,1,4,false);

        this.createRowsBottom(8,1,9,2,3,false);

        this.createRowsBottom(10,2,11,3,2,true);

        this.connectVertexToTiles();

    }

    tileClicked(){

    }

    vertexClicked(id, currentPlayer, board){
        if(currentPlayer.initialTurns==4 || currentPlayer.initialTurns==2) {
            console.log(id);
            this.currentPlayer.claimElement(id,currentPlayer.isValidPlay(id,board,currentPlayer.initialTurns),board,currentPlayer.initialTurns);
        }
        if(currentPlayer.initialTurns==0){
            if(currentPlayer.ownedVertices.has(id)){
                let vertexTiles = currentPlayer.ownedVertices.get(id).tiles;
                vertexTiles.forEach((value)=>{
                    if(value.resource!="Desert"){
                        currentPlayer.addResourceCard(value.resource);
                    }
                });
                currentPlayer.initialTurns--;
            }
        }
    }

    roadClicked(id,currentPlayer,board){
        if(currentPlayer.initialTurns==3 || currentPlayer.initialTurns==1) {
            console.log(id);
            this.currentPlayer.claimElement(id,currentPlayer.isValidPlay(id,board,currentPlayer.initialTurns),board,currentPlayer.initialTurns);
        }
        if(currentPlayer.initialTurns<0){
            let successCode = currentPlayer.isValidPlay(id,board,currentPlayer.initialTurns);
            this.currentPlayer.claimElement(id,successCode,board,currentPlayer.initialTurns);
        }
    }
}

