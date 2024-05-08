type Size = {
    width: number,
    height: number
}
type Position ={
    x:number
    y:number
}
type Sides = {
    top:string,
    right:string,
    bottom:string,
    left:string
}
class TileTypeData {
    readonly imgPath:Image
    readonly compatibleSides:Sides
    readonly tileTypeName:string
    readonly tileTypeId:number

    constructor(imagePath:Image, sidesType:Sides, name:string, id:number){
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
const TileBlankIndex = new TileTypeData(assets.tile`tile-blank`, { top: "AAA", right: "AAA", bottom: "AAA", left: "AAA"}, "Tile Blank", 0)
const TileUpIndex = new TileTypeData(assets.tile`tile-up`, { top: "ABA", right: "ABA", bottom: "AAA", left:"ABA"},"Tile Up",1)
const TileDownIndex = new TileTypeData(assets.tile`tile-down`, { top: "AAA", right: "ABA", bottom: "ABA", left:"ABA"}, "Tile Down", 2)
const TileRightIndex = new TileTypeData(assets.tile`tile-right`, { top: "ABA", right: "ABA", bottom: "ABA", left:"AAA"}, "Tile Right", 3)
const TileLeftIndex = new TileTypeData(assets.tile`tile-left`, { top: "ABA", right: "AAA", bottom: "ABA", left: "ABA"}, "Tile Left", 4)
let tileGrid:TileData[] = [];
let sortedTileGrid:TileData[];
let randomTile:TileData;
let randomTileType:TileTypeData;
let grid2Dindex: number;
scene.setBackgroundColor(1)
function display(gridData: TileData[], dim: Size): void {
    for (let i = 0; i < dim.height*dim.width; i++) {
            if (gridData[i].colapsed) {
                let newSprite = sprites.create(gridData[i].options[0].imgPath, SpriteKind.Player)
                newSprite.setPosition(gridData[i].getPosition().x *16 + 8, gridData[i].getPosition().y * 16 + 8)
            }
    }
}
function modifyLeftTile(tileData: TileData, gridData: TileData[]) {
    let leftTile: TileData = gridData[tileData.getPosition().y - 1]
    for (let i = 0; i < leftTile.options.length; i++) {
        if (leftTile.options[i].compatibleSides.right != tileData.options[i].compatibleSides.left) {
            leftTile.options.slice(i, i)
        }
    }
}
function modifyRightTile(tileData: TileData, gridData: TileData[]) {
    let leftTile: TileData = gridData[tileData.getPosition().y + 1]
    for (let i = 0; i < leftTile.options.length; i++) {
        if (leftTile.options[i].compatibleSides.left != tileData.options[i].compatibleSides.right) {
            leftTile.options.slice(i, i)
        }
    }
}
function modifyTopTile(tileData: TileData, gridData: TileData[]) {
    let leftTile: TileData = gridData[tileData.getPosition().y - Dimensions.width]
    for (let i = 0; i < leftTile.options.length; i++) {
        if (leftTile.options[i].compatibleSides.bottom != tileData.options[i].compatibleSides.top) {
            leftTile.options.slice(i, i)
        }
    }
}
function modifyBottomTile(tileData: TileData, gridData: TileData[]) {
    let leftTile: TileData = gridData[tileData.getPosition().y + Dimensions.width]
    for (let i = 0; i < leftTile.options.length; i++) {
        if (leftTile.options[i].compatibleSides.top != tileData.options[i].compatibleSides.bottom) {
            leftTile.options.slice(i, i)
        }
    }
}
//grid constructor
for(let i = 0; i < Dimensions.width*Dimensions.height; i++){
    tileGrid[i] = new TileData({y:Math.floor(i/Dimensions.width) , x:i%Dimensions.width});
}
for(let z = 0; z < tileGrid.length; z++){
sortedTileGrid = tileGrid.filter((a) => !a.colapsed);
sortedTileGrid.sort((a,b) => a.options.length - b.options.length)
sortedTileGrid = sortedTileGrid.filter((a) => a.options.length === sortedTileGrid[0].options.length)

randomTile = Math.pickRandom(sortedTileGrid)
randomTileType = Math.pickRandom(randomTile.options)
randomTile.options = [randomTileType]
randomTile.colapsed = true;

if(randomTile.getPosition().y != 0){
    modifyTopTile(randomTile,tileGrid);
}
/*if (randomTile.getPosition().y != Dimensions.height-1) {
    modifyBottomTile(randomTile, tileGrid);
}
if (randomTile.getPosition().y != 0) {
    modifyLeftTile(randomTile, tileGrid);
}
if (randomTile.getPosition().y != Dimensions.width - 1) {
    modifyRightTile(randomTile, tileGrid);
}*/
    display(tileGrid, Dimensions);
}
