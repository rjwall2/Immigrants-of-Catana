export class player{
    playerNumber;
    name;
    color;
    initialTurns = 4;
    numberOfVictoryPoints = 0;
    resourceCards = [];
    ownedVertices = new Map([]); 
    ownedRoads = new Map([]);
    movingRobber = false;
    stealing = false;
    errorText = document.getElementById("ErrorMessage");

    constructor (playerNumber, name){
        this.playerNumber = playerNumber;
        this.name = name; 
        if(playerNumber==0){
            this.color = "red";
        }else if(playerNumber==1){
            this.color="deepskyblue";
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

                if(this.ownedVertices.get(idOfClick).power==2){
                    return 0; //can't advance a city further
                }
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
                }

                

                if(connectingRoad && requiredResources){ 
                    return 3;
                }else{
                    if(initial<0){
                        this.errorText.innerHTML="Insufficient resources to build a city";    
                    }
                }

            }else{ // unowned vertex

                if(!board.vertexMap.has(idOfClick)){
                    console.log("This element is already owned!"); 
                    this.errorText.innerHTML="This element is already owned!";
                    return 0;
                }

                let rowNumber = idOfClick.slice(0,idOfClick.indexOf("."));
                let columnNumber = idOfClick.slice(idOfClick.indexOf(".")+1);


                if(rowNumber%2 == 0){ //even 
                    if(board.claimedVerticesMap.has(""+(+rowNumber-1)+"."+columnNumber)||board.claimedVerticesMap.has(""+(+rowNumber+1)+"."+(+columnNumber-1))||board.claimedVerticesMap.has(""+(+rowNumber+1)+"."+(+columnNumber+1))){
                        console.log("Settlements must be at least two roads apart");
                        this.errorText.innerHTML="Settlements must be at least two roads apart";
                        return 0;
                    }
                }else{ //odd
                    if(board.claimedVerticesMap.has(""+(+rowNumber+1)+"."+columnNumber)||board.claimedVerticesMap.has(""+(+rowNumber-1)+"."+(+columnNumber-1))||board.claimedVerticesMap.has(""+(+rowNumber-1)+"."+(+columnNumber+1))){
                        console.log("Settlements must be at least two roads apart");
                        this.errorText.innerHTML="Settlements must be at least two roads apart";
                        return 0;
                    } 
                }

                this.ownedRoads.forEach((value)=>{
                    if(idOfClick == value.vertex1 || idOfClick == value.vertex2){
                        connectingRoad = true;
                    }
                })

                if(initial>0){
                    connectingRoad = true;
                   
                }

                

                const woodIndex = this.resourceCards.indexOf("Wood");
                const brickIndex = this.resourceCards.indexOf("Brick");
                const sheepIndex = this.resourceCards.indexOf("Sheep");
                const wheatIndex = this.resourceCards.indexOf("Wheat");

                if((woodIndex!=-1 && brickIndex!=-1 && sheepIndex!=-1 && wheatIndex!=-1)|| initial > 0){
                    requiredResources = true;
                }


                if((connectingRoad && requiredResources)||initial>0){
                    return 2;
                }else{
                    if(!connectingRoad && !requiredResources){
                        this.errorText.innerHTML="Insufficient resources and no connecting road";
                    }else if(connectingRoad==false){
                        this.errorText.innerHTML="No connecting road";
                    }else if(requiredResources==false){
                        this.errorText.innerHTML="Insufficient resources";
                    }
                }
            }



        } else{ //road clicked

            if(!board.roadMap.has(idOfClick)){
                console.log("This element is already owned!");
                this.errorText.innerHTML="This element is already owned!"; 
                return 0;
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

            if(initial==1){
                const currentVertices = this.ownedVertices.entries();
                currentVertices.next();
                let valid = currentVertices.next().value[1].position;
                if(end1 == valid || end2 == valid){
                    connectingRoad=true;
                }else{
                    console.log("Must build adjacent to latest placed settlement");
                    this.errorText.innerHTML="Must build road adjacent to latest placed settlement";
                    connectingRoad=false;
                }
            }


            let woodIndex = this.resourceCards.indexOf("Wood");
            let brickIndex = this.resourceCards.indexOf("Brick");
            

            if((woodIndex!=-1 && brickIndex!=-1)|| initial>0){
                requiredResources = true;
            }

            if(connectingRoad && requiredResources){
                return 1;
            }else{
                if(!connectingRoad && !requiredResources){
                    this.errorText.innerHTML="Insufficient resources and no connecting road";
                }else if(connectingRoad==false){
                    this.errorText.innerHTML="No connecting road";
                }else if(requiredResources==false){
                    this.errorText.innerHTML="Insufficient resources";
                }
            }

        }

        return 0;
    }    

    claimElement(id, successCode, board, initial){
        
        if(successCode == 1){ //road

            if(initial<0){

                this.removeResourceCard(this.resourceCards.indexOf("Wood"),"Wood");
                this.removeResourceCard(this.resourceCards.indexOf("Brick"),"Brick");

            }else{
                this.initialTurns--;
            }

            this.ownedRoads.set(id,board.roadMap.get(id));
            board.roadMap.delete(id);
            document.getElementById(id).setAttribute("fill",this.color);
            this.errorText.innerHTML="";
        }
        if(successCode == 2){ //settlement



            if(initial<0){ 
                
                this.removeResourceCard(this.resourceCards.indexOf("Wood"),"Wood");

                this.removeResourceCard(this.resourceCards.indexOf("Brick"),"Brick");

                this.removeResourceCard(this.resourceCards.indexOf("Sheep"),"Sheep");

                this.removeResourceCard(this.resourceCards.indexOf("Wheat"),"Wheat");

            }else{
                this.initialTurns--;
            }

            this.ownedVertices.set(id,board.vertexMap.get(id));
            board.claimedVerticesMap.set(id,board.vertexMap.get(id));
            board.vertexMap.delete(id);
            document.getElementById(id).setAttribute("fill",this.color);
            this.errorText.innerHTML="";

            board.vertexOwnersMap.set(id,this);

            this.numberOfVictoryPoints++;
            
        }
        if(successCode == 3){ //city


            this.removeResourceCard(this.resourceCards.indexOf("Wheat"),"Wheat");
            this.removeResourceCard(this.resourceCards.indexOf("Wheat"),"Wheat");
            this.removeResourceCard(this.resourceCards.indexOf("Rock"),"Rock");
            this.removeResourceCard(this.resourceCards.indexOf("Rock"),"Rock");
            this.removeResourceCard(this.resourceCards.indexOf("Rock"),"Rock");
           
            

            this.ownedVertices.get(id).power = 2;

            document.getElementById(id).setAttribute("fill","url(#grad"+this.playerNumber+")")
            this.errorText.innerHTML="";

            this.numberOfVictoryPoints++;

        }
    }

    addResourceCard(resourceString){
        this.resourceCards.push(resourceString);

        let newCard = document.createElement("button");
        newCard.classList.add(resourceString,"card");
        
        document.getElementById(this.name).append(newCard);

    }
    removeResourceCard(resourceIndex,resourceString){


        let playerDiv = document.getElementById(this.name);

        let playerCardElements = playerDiv.children;
        for(let i =0; i<playerCardElements.length;i++){
            if(playerCardElements[i].classList.contains(resourceString)){
                playerDiv.removeChild(playerCardElements[i]);
                this.resourceCards.splice(resourceIndex,1); ///////splice refactors array! thus index must be recalculated after each deletion
                return;
            }
        }

    }

    removeResourceCardClone(resourceString,clone){


        let playerDiv = clone;

        let playerCardElements = playerDiv.children;
        for(let i =0; i<playerCardElements.length;i++){
            if(playerCardElements[i].classList.contains(resourceString)){
                playerDiv.removeChild(playerCardElements[i]);
                
                return;
            }
        }

    }

    addResourceCardClone(resourceString,clone){

        let newCard = document.createElement("button");
        newCard.classList.add(resourceString,"card");
        
        clone.append(newCard);

    }

    robPlayer(){
        if(this.resourceCards.length>7){
            let numberToRemove = Math.floor((this.resourceCards.length)/2);
            for(let i = 0; i<numberToRemove; i++){
                let randomIndex = Math.floor(Math.random()*this.resourceCards.length);
                this.removeResourceCard(randomIndex,this.resourceCards[randomIndex]);
            }
        }
    }
}