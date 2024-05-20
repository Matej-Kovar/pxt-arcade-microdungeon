//logicky type na size, co by to asi bylo?
type Size = {
    width: number,
    height: number
}
//logicky type na position, co by to asi bylo?
type Position = {
    x: number
    y: number
}
//reprezentace stran tilu, tak jak jsou zasebou
enum Sides {
    top = 0,
    right = 1,
    bottom = 2,
    left = 3
}
//class pro jednotlivé tily
class TileData {
    //jestli už byl zcolapsován
    TileHasBeenCollapse: boolean
    //jákým tipem tilu se může stát
    tileTypeOptions: Array<TileTypeData>
    //pozice na obrazovce, v závislosti na onstaních tilech
    tilePosition: Position
    //index, kvůli debugingu
    tilesGridIndex: number
    //construktor
    constructor(position: Position, index: number, tileSet: TileTypeData[]) {
        this.TileHasBeenCollapse = false;
        this.tileTypeOptions = tileSet;
        this.tilePosition = position; 
        this.tilesGridIndex = index; 
    }
}
//velikost celkového dungeonu
const Dimensions: Size = { width: 30, height: 20 };
//velikost tilů 
const TileSize: Size = { width: 5, height: 5 };
//zde jsou uchovány všechny tily
const TileGrid: TileData[] = [];
//seed
let globalSeed: number = Math.randomRange(1000000000, 2147483647);
//získá random číslo ze seedu
function splitmix32(a:number) {
    return function () {
        a |= 0;
        a = a + 0x9e3779b9 | 0;
        let t = a ^ a >>> 16;
        t = Math.imul(t, 0x21f0aaad);
        t = t ^ t >>> 15;
        t = Math.imul(t, 0x735a2d97);
        return ((t = t ^ t >>> 15) >>> 0) / 4294967296;
    }
} 
//ukáže to co se vygenerovalo na displey, myslím že není důležité
function display(gridData: TileData[], dim: Size): void {
    gridData.filter(tile => tile.TileHasBeenCollapse).forEach(tile => {
    let newImage = image.create(TileSize.width, TileSize.height)
    for (let i = 0; i < TileSize.width; i++) {
        for (let j = 0; j < TileSize.height; j++) {
            newImage.setPixel(j,i,tile.tileTypeOptions[0].imgData[i][j])
        }
    }
    let newSprite = sprites.create(newImage, SpriteKind.Player);
    newSprite.setPosition(tile.tilePosition.x * TileSize.width + TileSize.width, tile.tilePosition.y * TileSize.height + TileSize.height);
        });
}
//upraví možnosti sousedů právě vygenerovaného tilu
    function modifyNeighbouringTile(tileData: TileData, checkSide: Sides, NeighbourTile: TileData) {
        if (!NeighbourTile.TileHasBeenCollapse) {
            //checkSide je strana právě colapsnutému tilu na ke které je přilehlý tile který se bude upravovat
            //opposite side je strana na tilu který se bude upravovat, přilehlá k právě colapsnutému tilu
            let opositeSide = checkSide >= 2 ? checkSide - 2 : checkSide + 2;
            //nechá pouze ty typy tilů, které jsou mají schodnou stranu s právě kolapsnutým tilem, aka sedí k němu
            NeighbourTile.tileTypeOptions = NeighbourTile.tileTypeOptions.filter(option => option.getSide(opositeSide) ===
                tileData.tileTypeOptions[0].getSide(checkSide));
        }
    }
//vytvoří array ve kterém se nachízí pouze tily s nejnižším počtem možných typů tilů
function createEntrophyGrid(gridData: TileData[]): TileData[] {
     let newGrid = gridData.filter(tile => !tile.TileHasBeenCollapse);
    newGrid.sort((a, b) => a.tileTypeOptions.length - b.tileTypeOptions.length);
    return newGrid.filter(tile => tile.tileTypeOptions.length === newGrid[0].tileTypeOptions.length);
}
//vytvoří tile grid
function initializeTileGrid(gridData: TileData[], tileSet: TileTypeData[], dim: Size) {
    for (let i = 0; i < dim.width * dim.height; i++) {
        gridData[i] = new TileData({ y: Math.floor(i / dim.width), x: i % dim.width }, i, tileSet);
    }
}
//resetuje tile grid do původního stavu
function resetTileGrid(gridData: TileData[], tileSet: TileTypeData[], dim: Size) {
    for (let i = 0; i < dim.width * dim.height; i++) {
         gridData[i].TileHasBeenCollapse = false;
        gridData[i].tileTypeOptions = tileSet;
}
}
//vrácí index na základě vah a vygenerovaného čísla
function weightedRandom(tileTypeOptions:TileTypeData[], generatedNum:number) {
    let cumulativeWeights: number[] = [];
    //vytvoří array sečtených vah, nejlepší metoda jak tohle počítat co jsem našel
    for (let i = 0; i < tileTypeOptions.length; i += 1) {
        cumulativeWeights[i] = tileTypeOptions[i].weight + (cumulativeWeights[i - 1]||0);
    }
    //získá min/max číslo
    let randomNumber = cumulativeWeights[cumulativeWeights.length - 1] * generatedNum;
    //najde odpovídající číslo
    for (let index = 0; index < tileTypeOptions.length; index ++) {
        if (cumulativeWeights[index] >= randomNumber) {
            randomNumber = index
            break
        }
    }
    return randomNumber
    }
function generateDungeonLevelRooms(gridData: TileData[], dim: Size) {
    const random = splitmix32((globalSeed) >>> 0) 
    for (let index: number = 0; index < gridData.length; index++) {
        sprites.destroyAllSpritesOfKind(SpriteKind.Player)
        let entropyGrid = createEntrophyGrid(gridData);
        //vybere tile na colapsnutí
        let chosenTile = entropyGrid[Math.floor(random() * entropyGrid.length)];
        //vybere typ tilu
        chosenTile.tileTypeOptions = [chosenTile.tileTypeOptions[weightedRandom(chosenTile.tileTypeOptions, random())]];
        //colapsne
        chosenTile.TileHasBeenCollapse = true;
        //upraví sousedy
            let { x, y } = chosenTile.tilePosition;
            let chosenIndex = chosenTile.tilesGridIndex;
            if (y != 0) modifyNeighbouringTile(chosenTile, Sides.top, gridData[chosenIndex - dim.width]);
            if (y != dim.height - 1) modifyNeighbouringTile(chosenTile, Sides.bottom, gridData[chosenIndex + dim.width]);
            if (x != 0) modifyNeighbouringTile(chosenTile, Sides.left, gridData[chosenIndex - 1]);
            if (x != dim.width - 1) modifyNeighbouringTile(chosenTile, Sides.right, gridData[chosenIndex + 1]);
        }
    }
    initializeTileGrid(TileGrid, testingTileSet, Dimensions);
while (true) {
    globalSeed = Math.randomRange(1000000000,2147483647);
    generateDungeonLevelRooms(TileGrid, Dimensions);
    resetTileGrid(TileGrid, testingTileSet, Dimensions)
    display(TileGrid, Dimensions);
    basic.pause(5)
    }
