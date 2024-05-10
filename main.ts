type Size = {
    width: number,
    height: number
}
type Position = {
    x: number
    y: number
}
enum Sides {
    top = 0,
    right = 1,
    bottom = 2,
    left = 3
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
    TileHasBeenCollapse: boolean
    tileTypeOptions: Array<TileTypeData>
    private tilePosition: Position
    tilesGridIndex: number
    constructor(position: Position, index: number) {
        this.TileHasBeenCollapse = false;
        this.tileTypeOptions = [TileTypeTop, TileTypeUp, TileTypeRight, TileTypeDown, TileTypeLeft, TileTypeCross];
        this.tilePosition = position;
        this.tilesGridIndex = index;
    }
    setPosition(x: number, y: number) {
        this.tilePosition.x = x
        this.tilePosition.y = y
    }
    getPosition(): Position {
        return this.tilePosition
    }
}
const Dimensions: Size = { width: 5, height: 5 }
const TileTypeTop = new TileTypeData(assets.tile`tile-blank`, ["AAA", "AAA", "AAA", "AAA"], "Tile Blank", 0)
const TileTypeUp = new TileTypeData(assets.tile`tile-up`, ["ABA", "ABA", "AAA", "ABA"], "Tile Up", 1)
const TileTypeDown = new TileTypeData(assets.tile`tile-down`, ["AAA", "ABA", "ABA", "ABA"], "Tile Down", 2)
const TileTypeRight = new TileTypeData(assets.tile`tile-right`, ["ABA", "ABA", "ABA", "AAA"], "Tile Right", 3)
const TileTypeLeft = new TileTypeData(assets.tile`tile-left`, ["ABA", "AAA", "ABA", "ABA"], "Tile Left", 4)
const TileTypeCross = new TileTypeData(assets.tile`tile-cross`, ["ABA", "ABA", "ABA", "ABA"], "Tile Cross", 5)
let tileGrid: TileData[] = [];
let entropyGrid: TileData[];
let ChosenTile: TileData;
let ChosenTileType: TileTypeData;

function display(gridData: TileData[], dim: Size): void {
  for (let i = 0; i < dim.height * dim.width; i++) {
      if (gridData[i].TileHasBeenCollapse) {
          let newSprite = sprites.create(gridData[i].tileTypeOptions[0].imgPath, SpriteKind.Player)
          newSprite.setPosition(gridData[i].getPosition().x * 16 + 8, gridData[i].getPosition().y * 16 + 8)
      }
  }
}
function modifyNeighbouringTile(tileData: TileData, checkSide: Sides, NeighbourTile:TileData) {
    if(!NeighbourTile.TileHasBeenCollapse){
    let tileTypeOptionsLenght: number = NeighbourTile.tileTypeOptions.length;
    let tileTypesRemoved: number = 0;
    let opositeSide:number;
    if (checkSide >= 2) {
        opositeSide = checkSide - 2
    }
    else {
        opositeSide = checkSide + 2
    }
        for (let i = 0; i < tileTypeOptionsLenght; i++) {
        if (NeighbourTile.tileTypeOptions[i - tileTypesRemoved].compatibleSides[opositeSide] != tileData.tileTypeOptions[0].compatibleSides[checkSide]) {
            NeighbourTile.tileTypeOptions.splice(i - tileTypesRemoved, 1)
            tileTypesRemoved++
        }
    }
    }
}
function createEntrophyGrid(gridData: TileData[]): TileData[] {
    let newGrid: TileData[] = tileGrid.filter((a) => !a.TileHasBeenCollapse);
    newGrid.sort((a,b) => a.tileTypeOptions.length - b.tileTypeOptions.length)
    newGrid = newGrid.filter((a) => a.tileTypeOptions.length === newGrid[0].tileTypeOptions.length)
    return newGrid
}
function generateDungeonLevelRooms() {
    for (let i = 0; i < Dimensions.width * Dimensions.height; i++) {
        tileGrid[i] = new TileData({ y: Math.floor(i / Dimensions.width), x: i % Dimensions.width }, i);
    }
    for (let z = 0; z < tileGrid.length; z++) {
        sprites.destroyAllSpritesOfKind(SpriteKind.Player)

        entropyGrid = createEntrophyGrid(tileGrid)
        ChosenTile = Math.pickRandom(entropyGrid)
        ChosenTileType = Math.pickRandom(ChosenTile.tileTypeOptions)
        ChosenTile.tileTypeOptions = [ChosenTileType]
        ChosenTile.TileHasBeenCollapse = true;
        
        let x = ChosenTile.getPosition().x;
        let y = ChosenTile.getPosition().y;
        let index = ChosenTile.tilesGridIndex;
        if (y != 0) modifyNeighbouringTile(ChosenTile, Sides.top, tileGrid[index - Dimensions.width]);
        if (y != Dimensions.height - 1) modifyNeighbouringTile(ChosenTile, Sides.bottom, tileGrid[index + Dimensions.width]);
        if (x != 0) modifyNeighbouringTile(ChosenTile, Sides.left, tileGrid[index - 1]);
        if (x != Dimensions.width - 1) modifyNeighbouringTile(ChosenTile, Sides.right, tileGrid[index + 1]);

        display(tileGrid, Dimensions);
    }
}