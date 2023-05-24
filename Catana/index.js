function createTileSVG(row, column){ //0 based index
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
    const xmlns = "http://www.w3.org/2000/svg";
    const svg = document.getElementById("board");
    const newPolygon = document.createElementNS(xmlns,"polygon");
    newPolygon.setAttribute("id", ""+row+column);
    newPolygon.setAttribute("points", newPositionString);
    newPolygon.setAttribute("stroke", "black");
    newPolygon.setAttribute("fill", "pink");
    newPolygon.setAttribute("stroke-width", "5");
    svg.appendChild(newPolygon);
    //console.log(newPositionString);
}

function createVertex(row, column){ // 0 based index
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
    newTriangle.setAttribute("id", ""+row+column);
    newTriangle.setAttribute("points",""+pointOneX+" "+pointOneY+", "+pointTwoX+" "+pointTwoY+", "+pointThreeX+" "+pointThreeY);
    newTriangle.setAttribute("stroke", "black");
    newTriangle.setAttribute("fill","green");
    newTriangle.setAttribute("stroke-width", "2.5");
    svg.appendChild(newTriangle);

    const returnResults = [pointOneX,pointOneY,pointTwoX,pointTwoY,pointThreeX,pointThreeY];
    return returnResults;

}

function createRoadUp(pointsOne, pointsTwo,rowColumnOne, rowColumnTwo){
    const xmlns = "http://www.w3.org/2000/svg";
    const svg = document.getElementById("board");
    const newRectangle = document.createElementNS(xmlns,"polygon");
    newRectangle.setAttribute("id", ""+rowColumnOne+rowColumnTwo);
    newRectangle.setAttribute("points",""+pointsOne[0]+" "+pointsOne[1]+", "+pointsOne[2]+" "+pointsOne[3]+", "+pointsTwo[0]+" "+pointsTwo[1]+", "+pointsTwo[2]+" "+pointsTwo[3]);
    newRectangle.setAttribute("stroke", "black");
    newRectangle.setAttribute("fill","orange");
    newRectangle.setAttribute("stroke-width", "2.5");
    svg.appendChild(newRectangle);
}

function createRoadDown(pointsOne, pointsTwo,rowColumnOne, rowColumnTwo){
    const xmlns = "http://www.w3.org/2000/svg";
    const svg = document.getElementById("board");
    const newRectangle = document.createElementNS(xmlns,"polygon");
    newRectangle.setAttribute("id", ""+rowColumnOne+rowColumnTwo);
    newRectangle.setAttribute("points",""+pointsTwo[0]+" "+pointsTwo[1]+", "+pointsTwo[4]+" "+pointsTwo[5]+", "+pointsOne[0]+" "+pointsOne[1]+", "+pointsOne[4]+" "+pointsOne[5]);
    newRectangle.setAttribute("stroke", "black");
    newRectangle.setAttribute("fill","orange");
    newRectangle.setAttribute("stroke-width", "2.5");
    svg.appendChild(newRectangle);
}

function createRoadVertical (pointsOne, row, column){


    const verticalPoint1 =[pointsOne[2], pointsOne[3]+65];
    const verticalPoint2 =[pointsOne[4], pointsOne[5]+65];

    const newrowNumber = row+1;
    const newrowColumnNumber = ""+newrowNumber+column;
   

    const xmlns = "http://www.w3.org/2000/svg";
    const svg = document.getElementById("board");
    const newRectangle = document.createElementNS(xmlns,"polygon");
    newRectangle.setAttribute("id", ""+row+column+newrowColumnNumber);
    newRectangle.setAttribute("points",""+pointsOne[2]+" "+pointsOne[3]+", "+pointsOne[4]+" "+pointsOne[5]+", "+verticalPoint2[0]+" "+verticalPoint2[1]+", "+verticalPoint1[0]+" "+verticalPoint1[1]);
    newRectangle.setAttribute("stroke", "black");
    newRectangle.setAttribute("fill","orange");
    newRectangle.setAttribute("stroke-width", "2.5");
    svg.appendChild(newRectangle);
    console.log(""+row+column+newrowColumnNumber);
}

createTileSVG(0,2);
createTileSVG(0,3);
createTileSVG(0,4);

createTileSVG(1,1);
createTileSVG(1,2);
createTileSVG(1,3);
createTileSVG(1,4);

createTileSVG(2,1);
createTileSVG(2,2);
createTileSVG(2,3);
createTileSVG(2,4);
createTileSVG(2,5);

createTileSVG(3,1);
createTileSVG(3,2);
createTileSVG(3,3);
createTileSVG(3,4);

createTileSVG(4,2);
createTileSVG(4,3);
createTileSVG(4,4);


let vertexPoints1 = createVertex(1,2);
let vertexPoints2 = createVertex(0,3);
createRoadUp(vertexPoints1, vertexPoints2, "12", "03");

createRoadVertical(vertexPoints1, 1, 2);

vertexPoints1 = createVertex(1,4);
createRoadDown(vertexPoints2, vertexPoints1, "03", "14");

createRoadVertical(vertexPoints1, 1, 4);

vertexPoints2 = createVertex(0,5);
createRoadUp(vertexPoints1,vertexPoints2, "14", "05");

vertexPoints1 = createVertex(1,6);
createRoadDown(vertexPoints2,vertexPoints1, "05", "16");

createRoadVertical(vertexPoints1, 1, 6);

vertexPoints2 = createVertex(0,7);
createRoadUp(vertexPoints1,vertexPoints2, "16", "07");

vertexPoints1 = createVertex(1,8); 
createRoadDown(vertexPoints2,vertexPoints1, "07", "18");

createRoadVertical(vertexPoints1, 1, 8);


vertexPoints1 = createVertex(3,1);
vertexPoints2 = createVertex(2,2);
createRoadUp(vertexPoints1, vertexPoints2, "31", "22");

createRoadVertical(vertexPoints1, 3, 1);

vertexPoints1 = createVertex(3,3);
createRoadDown(vertexPoints2,vertexPoints1, "22", "33");

createRoadVertical(vertexPoints1, 3, 3);

vertexPoints2 = createVertex(2,4);
createRoadUp(vertexPoints1, vertexPoints2, "33", "24");

vertexPoints1 = createVertex(3,5);
createRoadDown(vertexPoints2,vertexPoints1, "24", "35");

createRoadVertical(vertexPoints1, 3, 5);

vertexPoints2 =createVertex(2,6);
createRoadUp(vertexPoints1, vertexPoints2, "35", "26");

vertexPoints1 = createVertex(3,7);
createRoadDown(vertexPoints2,vertexPoints1, "24", "37");

createRoadVertical(vertexPoints1, 3, 7);

vertexPoints2 = createVertex(2,8);
createRoadUp(vertexPoints1, vertexPoints2, "37", "28");

vertexPoints1 = createVertex(3,9);
createRoadDown(vertexPoints2,vertexPoints1, "24", "39");

createRoadVertical(vertexPoints1, 3,9);
 

vertexPoints1 = createVertex(5,0);
vertexPoints2 = createVertex(4,1);
createRoadUp(vertexPoints1, vertexPoints2, "50", "41");

createRoadVertical(vertexPoints1, 5, 0);

vertexPoints1 = createVertex(5,2);
createRoadDown(vertexPoints2,vertexPoints1, "41", "52");

createRoadVertical(vertexPoints1, 5, 2);

vertexPoints2 = createVertex(4,3);
createRoadUp(vertexPoints1, vertexPoints2, "52", "43");

vertexPoints1 = createVertex(5,4);
createRoadDown(vertexPoints2,vertexPoints1, "43", "54");

createRoadVertical(vertexPoints1, 5, 4);

vertexPoints2 =createVertex(4,5);
createRoadUp(vertexPoints1, vertexPoints2, "54", "45");

vertexPoints1 = createVertex(5,6);
createRoadDown(vertexPoints2,vertexPoints1, "45", "56");

createRoadVertical(vertexPoints1, 5, 6);

vertexPoints2 = createVertex(4,7);
createRoadUp(vertexPoints1, vertexPoints2, "56", "47");

vertexPoints1 = createVertex(5,8);
createRoadDown(vertexPoints2,vertexPoints1, "47", "58");

createRoadVertical(vertexPoints1, 5,8);

vertexPoints2 = createVertex(4,9);
createRoadUp(vertexPoints1, vertexPoints2, "58", "49");

vertexPoints1 = createVertex(5,10);
createRoadDown(vertexPoints2,vertexPoints1, "49", "510");

createRoadVertical(vertexPoints1, 5,10);


vertexPoints1 = createVertex(6,0);
vertexPoints2 = createVertex(7,1);
createRoadDown(vertexPoints1, vertexPoints2, "50", "41");

createRoadVertical(vertexPoints2, 7, 1);

vertexPoints1 = createVertex(6,2);
createRoadUp(vertexPoints1, vertexPoints2, "71", "61");

vertexPoints2 = createVertex(7,3);
createRoadDown(vertexPoints2,vertexPoints1, "61", "73");

createRoadVertical(vertexPoints2, 7, 3);

vertexPoints1 =createVertex(6,4);
createRoadUp(vertexPoints1, vertexPoints2, "73", "64");

vertexPoints2 = createVertex(7,5);
createRoadDown(vertexPoints2,vertexPoints1, "64", "75");

createRoadVertical(vertexPoints2, 7,5);

vertexPoints1 = createVertex(6,6);
createRoadUp(vertexPoints1, vertexPoints2, "75", "66");

vertexPoints2 = createVertex(7,7);
createRoadDown(vertexPoints2,vertexPoints1, "66", "77");

createRoadVertical(vertexPoints2, 7,7);

vertexPoints1 = createVertex(6,8);
createRoadUp(vertexPoints1, vertexPoints2, "77", "68");

vertexPoints2 = createVertex(7,9);
createRoadDown(vertexPoints2,vertexPoints1, "68", "79");

createRoadVertical(vertexPoints2, 7,9);

vertexPoints1 = createVertex(6,10);
createRoadUp(vertexPoints1, vertexPoints2, "77", "610");


vertexPoints1 = createVertex(8,1);
vertexPoints2 = createVertex(9,2);
createRoadDown(vertexPoints1, vertexPoints2, "81", "92");

createRoadVertical(vertexPoints2, 9, 2);

vertexPoints1 = createVertex(8,3);
createRoadUp(vertexPoints1, vertexPoints2, "92", "83");

vertexPoints2 = createVertex(9,4);
createRoadDown(vertexPoints2,vertexPoints1, "83", "94");

createRoadVertical(vertexPoints2, 9, 4);

vertexPoints1 =createVertex(8,5);
createRoadUp(vertexPoints1, vertexPoints2, "94", "85");

vertexPoints2 = createVertex(9,6);
createRoadDown(vertexPoints2,vertexPoints1, "85", "96");

createRoadVertical(vertexPoints2, 9,6);

vertexPoints1 = createVertex(8,7);
createRoadUp(vertexPoints1, vertexPoints2, "96", "87");

vertexPoints2 = createVertex(9,8);
createRoadDown(vertexPoints2,vertexPoints1, "87", "98");

createRoadVertical(vertexPoints2, 9,8);

vertexPoints1 = createVertex(8,9);
createRoadUp(vertexPoints1, vertexPoints2, "98", "89");


vertexPoints1 = createVertex(10,2);
vertexPoints2 = createVertex(11,3);
createRoadDown(vertexPoints1, vertexPoints2, "102", "113");

vertexPoints1 = createVertex(10,4);
createRoadUp(vertexPoints1, vertexPoints2, "113", "104");

vertexPoints2 = createVertex(11,5);
createRoadDown(vertexPoints2,vertexPoints1, "104", "115");

vertexPoints1 =createVertex(10,6);
createRoadUp(vertexPoints1, vertexPoints2, "115", "106");

vertexPoints2 = createVertex(11,7);
createRoadDown(vertexPoints2,vertexPoints1, "106", "117");

vertexPoints1 = createVertex(10,8);
createRoadUp(vertexPoints1, vertexPoints2, "117", "108");




