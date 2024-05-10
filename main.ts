type Size = {
    width: number,
    height: number
}
type Position = {
    x: number
    y: number
}
class TileTypeData {
    readonly imgPath: Image
    readonly compatibleSides: string[]
    readonly tileTypeName: string
    readonly tileTypeId: number

    constructor(imagePath: Image, sidesType: string[], name: string, id: number) {
        this.imgPath = imagePath;
        this.compatibleSides = sidesType;
        this.tileTypeName = name;
        this.tileTypeId = id;
    }
}
class TileData {
    colapsed: boolean
    options: Array<TileTypeData>
    private tilePosition: Position
    tileIndex: number
    constructor(position: Position, index: number) {
        this.colapsed = false;
        this.options = [TileBlankIndex, TileUpIndex, TileRightIndex, TileDownIndex, TileLeftIndex];
        this.tilePosition = position;
        this.tileIndex = index;
    }
    setPosition(x: number, y: number) {
        this.tilePosition.x = x
        this.tilePosition.y = y
    }
    getPosition(): Position {
        return this.tilePosition
    }
}
let Dimensions: Size = { width: 1, height: 6 }
const TileBlankIndex = new TileTypeData(assets.tile`tile-blank`, ["AAA", "AAA", "AAA", "AAA"], "Tile Blank", 0)
const TileUpIndex = new TileTypeData(assets.tile`tile-up`, ["ABA", "ABA", "AAA", "ABA"], "Tile Up", 1)
const TileDownIndex = new TileTypeData(assets.tile`tile-down`, ["AAA", "ABA", "ABA", "ABA"], "Tile Down", 2)
const TileRightIndex = new TileTypeData(assets.tile`tile-right`, ["ABA", "ABA", "ABA", "AAA"], "Tile Right", 3)
const TileLeftIndex = new TileTypeData(assets.tile`tile-left`, ["ABA", "AAA", "ABA", "ABA"], "Tile Left", 4)
let tileGrid: TileData[] = [];
let sortedTileGrid: TileData[];
let randomTile: TileData;
let randomTileType: TileTypeData;
let grid2Dindex: number;

function display(gridData: TileData[], dim: Size): void {
  for (let i = 0; i < dim.height * dim.width; i++) {
      if (gridData[i].colapsed) {
          let newSprite = sprites.create(gridData[i].options[0].imgPath, SpriteKind.Player)
          newSprite.setPosition(gridData[i].getPosition().x * 16 + 8, gridData[i].getPosition().y * 16 + 8)
      }
  }
}
function modifyNeighbouringTile(tileData: TileData, gridData: TileData[], checkSide:number) {
    let tilesTypeOptions;
    if(checkSide === 0){
        tilesTypeOptions = gridData[tileData.tileIndex - Dimensions.width].options
    }
    else if(checkSide === 1){
        tilesTypeOptions = gridData[tileData.tileIndex + 1].options
    }
    else if(checkSide === 2){
        tilesTypeOptions = gridData[tileData.tileIndex + Dimensions.width].options
    }
    else{
        tilesTypeOptions = gridData[tileData.tileIndex - 1].options
    }
    let optionsLenght: number = tilesTypeOptions.length;
    let tileTypesRemoved: number = 0;
    let opositeSide:number;
    if (checkSide > 1) {
        opositeSide = checkSide - 2
    }
    else {
        opositeSide = checkSide + 2
    }
        for (let i = 0; i < optionsLenght; i++) {
        if (tilesTypeOptions[i - tileTypesRemoved].compatibleSides[opositeSide] != tileData.options[0].compatibleSides[checkSide]) {
            tilesTypeOptions.splice(i - tileTypesRemoved, 1)
            tileTypesRemoved++
        }
    }
}

//grid constructor
for (let i = 0; i < Dimensions.width * Dimensions.height; i++) {
    tileGrid[i] = new TileData({ y: Math.floor(i / Dimensions.width), x: i % Dimensions.width }, i);
}


for(let z = 0; z < tileGrid.length; z++){
sprites.destroyAllSpritesOfKind(SpriteKind.Player)
sortedTileGrid = tileGrid.filter((a) => !a.colapsed);
sortedTileGrid.sort((a,b) => a.options.length - b.options.length)
sortedTileGrid = sortedTileGrid.filter((a) => a.options.length === sortedTileGrid[0].options.length)

randomTile = Math.pickRandom(sortedTileGrid)
randomTileType = Math.pickRandom(randomTile.options)
randomTile.options = [randomTileType]
randomTile.colapsed = true;

if(randomTile.getPosition().y != 0){
    modifyNeighbouringTile(randomTile,tileGrid,0);
}
if (randomTile.getPosition().y != Dimensions.height-1) {
    modifyNeighbouringTile(randomTile, tileGrid,2);
}
/*
if (randomTile.getPosition().x != 0) {
    modifyNeighbouringTile(randomTile, tileGrid,1);
}
if (randomTile.getPosition().x != Dimensions.width - 1) {
    modifyNeighbouringTile(randomTile, tileGrid,3);
}
*/
  display(tileGrid, Dimensions);
}