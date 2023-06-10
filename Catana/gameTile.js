export class gameTile{
    resource;
    number;
    position;
    robberStatus;

    constructor(resource, number, robber){
        this.resource = resource;
        this.number = number;
        this.robberStatus = robber;
    }

    setPosition(position){
        this.position = position;
    }

    setRobber(){
        this.robberStatus = true;
    }

    undoRobber(){
        this.robber = false;
    }

}