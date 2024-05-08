type Size = {
    width: number,
    height: number
}
type Position ={
    x:number
    y:number
}
class TileTypeData {
    readonly imgPath:Image
    readonly compatibleSides:Array<string>
    readonly tileTypeName:string
    readonly tileTypeId:number

    constructor(imagePath:Image, sidesType:Array<string>, name:string, id:number){
        this.imgPath = imagePath;
        this.compatibleSides = sidesType;
        this.tileTypeName = name;
        this.tileTypeId = id;
    }
}
class TileData {
    colapsed:boolean
    options:Array<TileTypeData>
    private tilePosition:Position

    constructor(position:Position){
        this.colapsed = false;
        this.options = [TileBlankIndex, TileUpIndex, TileRightIndex, TileDownIndex, TileLeftIndex]
        this.tilePosition = position;
    }
    setPosition(x:number, y:number){
        this.tilePosition.x = x
        this.tilePosition.y = y
    }
    getPosition(): Position{
        return this.tilePosition
    }
}
let Dimensions:Size = {width: 2, height: 2}
const TileBlankIndex = new TileTypeData(assets.tile`tile-blank`, ["AAA", "AAA", "AAA", "AAA"], "Tile Blank", 0)
const TileUpIndex = new TileTypeData(assets.tile`tile-up`,["ABA","ABA","AAA","ABA"],"Tile Up",1)
const TileDownIndex = new TileTypeData(assets.tile`tile-down`, ["AAA", "ABA", "ABA", "ABA"], "Tile Down", 2)
const TileRightIndex = new TileTypeData(assets.tile`tile-right`, ["ABA", "ABA", "ABA", "AAA"], "Tile Right", 3)
const TileLeftIndex = new TileTypeData(assets.tile`tile-left`, ["ABA", "AAA", "ABA", "ABA"], "Tile Left", 4)
let tileGrid:TileData[] = [];
let sortedTileGrid:TileData[];
let randomTile:TileData;
let randomTileType:TileTypeData;
let grid2Dindex: number;
scene.setBackgroundColor(1)
function display(gridData: TileData[], dim: Size): void {
    for (let i = 0; i < dim.height; i++) {
        for (let j = 0; j < dim.width; j++) {
            grid2Dindex = i*dim.width+j
            if (gridData[grid2Dindex].colapsed) {
                let newSprite = sprites.create(gridData[grid2Dindex].options[0].imgPath, SpriteKind.Player)
                newSprite.setPosition(gridData[grid2Dindex].getPosition().y *16 + 8, gridData[grid2Dindex].getPosition().x * 16 + 8)
            }
        }
    }
}
//grid constructor
for(let i = 0; i < Dimensions.width*Dimensions.height; i++){
    tileGrid[i] = new TileData({y:Math.floor(i/Dimensions.width) , x:i%Dimensions.width});
}

tileGrid[1].options = [TileBlankIndex, TileUpIndex, TileRightIndex, TileDownIndex]
tileGrid[2].options = [TileBlankIndex, TileUpIndex, TileRightIndex,]
tileGrid[3].options = [TileBlankIndex, TileUpIndex, TileRightIndex,]
console.log(tileGrid[2].getPosition())
sortedTileGrid = tileGrid.slice();
sortedTileGrid.sort((a,b) => a.options.length - b.options.length)
sortedTileGrid = sortedTileGrid.filter((a) => a.options.length === sortedTileGrid[0].options.length)

randomTile = Math.pickRandom(sortedTileGrid)
randomTileType = Math.pickRandom(randomTile.options)
randomTile.options = [randomTileType]
randomTile.colapsed = true;
console.log(randomTile.getPosition())
display(tileGrid, Dimensions);