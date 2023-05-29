export class vertex{
    position;
    ownerStatus = false;
    tiles = [];

    constructor(position){
        this.position = position;
    }

    addTile(tile){
        this.tiles.push(tile);
    }
}