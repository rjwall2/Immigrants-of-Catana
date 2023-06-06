export class player{
    playerNumber;
    name;
    color;
    initialTurns = 4;
    numberOfVictoryPoints = 0;
    resourceCards = [];
    ownedVertices = new Map([]);
    ownedRoads = new Map([]);

    constructor (playerNumber, name){
        this.playerNumber = playerNumber;
        this.name = name;
        if(playerNumber==0){
            this.color = "red";
        }else if(playerNumber==1){
            this.color="blue";
        }else if(playerNumber==2){
            this.color="green";
        }else if( playerNumber==3){
            this.color="orange";
        }
    }

    // updateVictoryPoints(){
    //     this.ownedVertices.forEach((value) => {this.numberOfVictoryPoints += value.power});
    //     if (this.numberOfVictoryPoints >= 10){
    //         //win protocol
    //     }
    // }

    isValidPlay(idOfClick,board,initial){ //return code: 1 = successful road, 2 = successful settlement, 3 = successful city, 0 = invalid
        const colonIndex = idOfClick.indexOf(":");
        let connectingRoad = false;
        let requiredResources = false;
        if(colonIndex == -1){ //vertex clicked

            if(this.ownedVertices.has(idOfClick)){ //trying to build city
                connectingRoad = true;
                const wheatIndices = [];
                const rockIndices = [];
                this.resourceCards.forEach((value,index) =>{
                    if (wheatIndices.length ==2){

                    } else{
                        if(value =="Wheat"){
                            wheatIndices.push(index);
                        }
                    }

                    if (rockIndices.length ==3){

                    } else{
                        if(value =="Rock"){
                            rockIndices.push(index);
                        }
                    }
                })

                if(wheatIndices.length ==2 && rockIndices.length == 3){
                    requiredResources = true;
                    // this.resourceCards.splice(wheatIndices[0],1);
                    // this.resourceCards.splice(wheatIndices[1],1);
                    // this.resourceCards.splice(rockIndices[0],1);
                    // this.resourceCards.splice(rockIndices[1],1);
                    // this.resourceCards.splice(rockIndices[2],1);
                }

                if(connectingRoad && requiredResources){
                    return 3;
                }

            }else{ // unowned vertex

                if(!board.vertexMap.has(idOfClick)){
                    console.log("This element is already owned!"); 
                    return 0;
                }

                this.ownedRoads.forEach((value)=>{
                    if(idOfClick == value.vertex1 || idOfClick == value.vertex2){
                        connectingRoad = true;
                    }
                })

                if(initial){
                    connectingRoad = true;
                    
                    
                }

                

                const woodIndex = this.resourceCards.indexOf("Wood");
                const brickIndex = this.resourceCards.indexOf("Brick");
                const sheepIndex = this.resourceCards.indexOf("Sheep");
                const wheatIndex = this.resourceCards.indexOf("Wheat");

                if(woodIndex!=-1||brickIndex!=-1||sheepIndex!=-1||wheatIndex!=-1|| initial == true){
                    requiredResources = true;
                }


                if((connectingRoad && requiredResources)||initial){
                    return 2;
                }
            }



        } else{ //road clicked

            if(!board.roadMap.has(idOfClick)){
                console.log("This element is already owned!");
                return;
            }

            let end1 = idOfClick.slice(0,colonIndex);
            let end2 = idOfClick.slice(colonIndex+1);

            
            this.ownedRoads.forEach((value)=>{
                if(end1 == value.vertex1 || end2 == value.vertex2 ||end2 == value.vertex1 || end1 == value.vertex2){
                    connectingRoad = true;
                }
                
            })

            this.ownedVertices.forEach((value)=>{
                if(end1 == value.position || end2 == value.position){ 
                    connectingRoad = true;
                }
                
            })


            const woodIndex = this.resourceCards.indexOf("Wood");
            const brickIndex = this.resourceCards.indexOf("Brick");

            if(woodIndex!=-1||brickIndex!=-1|| initial){
                requiredResources = true;
            }

            console.log(requiredResources);

            if(connectingRoad && requiredResources){
                return 1;
            }

        }

        return 0;
    }    

    claimElement(id, successCode, board, initial){
        console.log(successCode);

        if(successCode == 1){ //road

            if(initial==false){
                const woodIndex = this.resourceCards.indexOf("Wood");
                const brickIndex = this.resourceCards.indexOf("Brick");

                this.resourceCards.splice(woodIndex,1);
                this.resourceCards.splice(brickIndex,1);
            }else{
                this.initialTurns--;
            }

            this.ownedRoads.set(id,board.roadMap.get(id));
            board.roadMap.delete(id);
            document.getElementById(id).setAttribute("fill",this.color);
        }
        if(successCode == 2){ //settlement



            if(initial==false){
                const woodIndex = this.resourceCards.indexOf("Wood");
                const brickIndex = this.resourceCards.indexOf("Brick");
                const sheepIndex = this.resourceCards.indexOf("Sheep");
                const wheatIndex = this.resourceCards.indexOf("Wheat");

                this.resourceCards.splice(woodIndex,1);
                this.resourceCards.splice(brickIndex,1);
                this.resourceCards.splice(sheepIndex,1);
                this.resourceCards.splice(wheatIndex,1);
            }else{
                this.initialTurns--;
            }

            this.ownedVertices.set(id,board.vertexMap.get(id));
            board.vertexMap.delete(id);
            document.getElementById(id).setAttribute("fill",this.color);
            this.numberOfVictoryPoints++;
            
        }
        if(successCode == 3){ //city

            const wheatIndices = [];
            const rockIndices = [];
            this.resourceCards.forEach((value,index) =>{
                if (wheatIndices.length ==2){

                } else{
                    if(value =="Wheat"){
                        wheatIndices.push(index);
                    }
                }

                if (rockIndices.length ==3){

                } else{
                    if(value =="Rock"){
                        rockIndices.push(index);
                    }
                }
            })

            this.resourceCards.splice(wheatIndices[0],1);
            this.resourceCards.splice(wheatIndices[1],1);
            this.resourceCards.splice(rockIndices[0],1);
            this.resourceCards.splice(rockIndices[1],1);
            this.resourceCards.splice(rockIndices[2],1); 
            

            this.ownedVertices.get(id).power = 2;
            let rowNumber = id.slice(0,id.indexOf("."));
            let newCity = document.getElementById(id);
            let trianglePoints = newCity.getAttribute("points");
            let topPointX = Number(trianglePoints.slice(0,trianglePoints.indexOf(" ")));
            let topPointY = Number(trianglePoints.slice(trianglePoints.indexOf(" ")+1,trianglePoints.indexOf(",")));
            let dotYCoord;
            if(rowNumber%2 == 0){
                dotYCoord = topPointY -10;
            } else{
                dotYCoord = topPointY +13;
            }

            const svg = document.getElementById("board");
            const xmlns = "http://www.w3.org/2000/svg";
            const newText = document.createElementNS(xmlns,"text");      
            newText.setAttribute("id", id);
            newText.setAttribute("x",topPointX);
            newText.setAttribute("y",dotYCoord);
            newText.setAttribute("fill","black");
            newText.setAttribute("font-size","2em");
            newText.setAttribute("text-anchor","middle");
            newText.innerHTML = ".";
            svg.append(newText);
            // newText.addEventListener("click",tileClicked);////////////
            console.log(topPointX)
            console.log(dotYCoord)
            console.log(this.ownedVertices);
            console.log(newCity);

            this.numberOfVictoryPoints++;

        }
    }
}