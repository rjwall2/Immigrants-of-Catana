export class vertex{
    position;
    power = 1; //1 = settlement, 2 = city
    tiles = [];

    constructor(position){
        this.position = position;
    }

    addTile(tile){
        this.tiles.push(tile);
    }

    claimVertex(){
        this.ownerStatus=true;
    }

    buildTown(){
        this.power=2;
    }
}