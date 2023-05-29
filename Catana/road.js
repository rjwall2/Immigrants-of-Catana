export class road{
    vertex1;
    vertex2;

    constructor(vertex1, vertex2){
        this.vertex1 = vertex1;
        this.vertex2 = vertex2;
    }

    claimRoad(){
        this.ownerStatus=true;
    }

}