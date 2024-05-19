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
    class TileData {
        TileHasBeenCollapse: boolean
        tileTypeOptions: Array<TileTypeData>
        tilePosition: Position
        tilesGridIndex: number
        constructor(position: Position, index: number, tileSet: TileTypeData[]) {
            this.TileHasBeenCollapse = false;
            this.tileTypeOptions = tileSet;
            this.tilePosition = position;
            this.tilesGridIndex = index;
        }
    }
    const Dimensions: Size = { width: 30, height: 20 };
    const TileSize = 5;
    const TileGrid: TileData[] = [];
    let globalSeed: number = Math.randomRange(1000000000, 2147483647);
        
function display(gridData: TileData[], dim: Size): void {
            gridData.filter(tile => tile.TileHasBeenCollapse).forEach(tile => {
            let newImage = image.create(TileSize, TileSize)
            for (let i = 0; i < TileSize; i++) {
                for (let j = 0; j < TileSize; j++) {
                    newImage.setPixel(j,i,tile.tileTypeOptions[0].imgData[i][j])
                }
            }
            let newSprite = sprites.create(newImage, SpriteKind.Player);
            newSprite.setPosition(tile.tilePosition.x * TileSize + TileSize, tile.tilePosition.y * TileSize + TileSize);
        });
    }
    
    function modifyNeighbouringTile(tileData: TileData, checkSide: Sides, NeighbourTile: TileData) {
        if (!NeighbourTile.TileHasBeenCollapse) {
            let opositeSide = checkSide >= 2 ? checkSide - 2 : checkSide + 2;
            NeighbourTile.tileTypeOptions = NeighbourTile.tileTypeOptions.filter(option => option.getSide(opositeSide) ===
                tileData.tileTypeOptions[0].getSide(checkSide));
        }
    }
    
    function createEntrophyGrid(gridData: TileData[]): TileData[] {
        let newGrid = gridData.filter(tile => !tile.TileHasBeenCollapse);
        newGrid.sort((a, b) => a.tileTypeOptions.length - b.tileTypeOptions.length);
        return newGrid.filter(tile => tile.tileTypeOptions.length === newGrid[0].tileTypeOptions.length);
    }
    
    function initializeTileGrid(gridData: TileData[], tileSet: TileTypeData[], dim: Size) {
        for (let i = 0; i < dim.width * dim.height; i++) {
            gridData[i] = new TileData({ y: Math.floor(i / dim.width), x: i % dim.width }, i, tileSet);
        }
}
    function resetTileGrid(gridData: TileData[], tileSet: TileTypeData[], dim: Size) {
        for (let i = 0; i < dim.width * dim.height; i++) {
            gridData[i].TileHasBeenCollapse = false;
            gridData[i].tileTypeOptions = tileSet;
    }
    }
    
    function generateDungeonLevelRooms(gridData: TileData[], dim: Size) {
        for (let index:number = 0; index < gridData.length; index++) {
            sprites.destroyAllSpritesOfKind(SpriteKind.Player)
            let ChunkSeed:number = (globalSeed * gridData[index].tilePosition.x * gridData[index].tilePosition.y)
            let entropyGrid = createEntrophyGrid(gridData);
            let chosenTile = Math.pickRandom(entropyGrid);
            chosenTile.tileTypeOptions = [Math.pickRandom(chosenTile.tileTypeOptions)];
            chosenTile.TileHasBeenCollapse = true;
            let { x, y } = chosenTile.tilePosition;
            let chosenIndex = chosenTile.tilesGridIndex;
            if (y != 0) modifyNeighbouringTile(chosenTile, Sides.top, gridData[chosenIndex - dim.width]);
            if (y != dim.height - 1) modifyNeighbouringTile(chosenTile, Sides.bottom, gridData[chosenIndex + dim.width]);
            if (x != 0) modifyNeighbouringTile(chosenTile, Sides.left, gridData[chosenIndex - 1]);
            if (x != dim.width - 1) modifyNeighbouringTile(chosenTile, Sides.right, gridData[chosenIndex + 1]);
            display(TileGrid, Dimensions);
            basic.pause(10)
        }
    }
    initializeTileGrid(TileGrid, testingTileSet, Dimensions);
    while (true) {
        generateDungeonLevelRooms(TileGrid, Dimensions);
        resetTileGrid(TileGrid, testingTileSet, Dimensions)
    }
