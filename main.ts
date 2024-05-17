
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
    const Dimensions: Size = { width: 5, height: 5 }
    const TileTypeBlank = new TileTypeData(assets.tile`tile-blank`, ["AAA", "AAA", "AAA", "AAA"], "Tile Blank", 0, [[]])
    const TileTypeUp = new TileTypeData(assets.tile`tile-up`, ["ABA", "ABA", "AAA", "ABA"], "Tile Up", 1,[[]])
    const TileTypeDown = new TileTypeData(assets.tile`tile-down`, ["AAA", "ABA", "ABA", "ABA"], "Tile Down", 2,[[]])
    const TileTypeRight = new TileTypeData(assets.tile`tile-right`, ["ABA", "ABA", "ABA", "AAA"], "Tile Right", 3,[[]])
    const TileTypeLeft = new TileTypeData(assets.tile`tile-left`, ["ABA", "AAA", "ABA", "ABA"], "Tile Left", 4,[[]])
    const TileTypeCross = new TileTypeData(assets.tile`tile-cross`, ["ABA", "ABA", "ABA", "ABA"], "Tile Cross", 5,[[]])
    let tileSize: number = 16;
    let tileGrid: TileData[] = [];

    function display(gridData: TileData[], dim: Size): void {
        for (let i = 0; i < dim.height * dim.width; i++) {
            if (gridData[i].TileHasBeenCollapse) {
                let newSprite = sprites.create(gridData[i].tileTypeOptions[0].imgPath, SpriteKind.Player)
                newSprite.setPosition(gridData[i].tilePosition.x * tileSize + (0.5 * tileSize), gridData[i].tilePosition.y * tileSize + (0.5 * tileSize))
            }
        }
    }
    function modifyNeighbouringTile(tileData: TileData, checkSide: Sides, NeighbourTile: TileData) {
        if (!NeighbourTile.TileHasBeenCollapse) {
            let tileTypeOptionsLenght: number = NeighbourTile.tileTypeOptions.length;
            let tileTypesRemoved: number = 0;
            let opositeSide: number;
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
        let newGrid: TileData[] = gridData.filter((a) => !a.TileHasBeenCollapse);
        newGrid.sort((a, b) => a.tileTypeOptions.length - b.tileTypeOptions.length)
        newGrid = newGrid.filter((a) => a.tileTypeOptions.length === newGrid[0].tileTypeOptions.length)
        return newGrid
    }
    function initializeTileGrid(gridData: TileData[], tileSet: TileTypeData[], dim: Size) {
        for (let i = 0; i < dim.width * dim.height; i++) {
            gridData[i] = new TileData({ y: Math.floor(i / dim.width), x: i % dim.width }, i, [TileTypeBlank, TileTypeUp, TileTypeDown, TileTypeLeft, TileTypeRight, TileTypeCross]);
        }
    }
    function resetTileGrid(gridData: TileData[], tileSet: TileTypeData[], dim: Size) {
        for (let i = 0; i < dim.width * dim.height; i++) {
            gridData[i] = { TileHasBeenCollapse: false, tileTypeOptions: tileSet, tilePosition: { y: Math.floor(i / dim.width), x: i % dim.width }, tilesGridIndex: i };
        }
    }
    function generateDungeonLevelRooms(gridData: TileData[], dim: Size) {

        for (let index = 0; index < gridData.length; index++) {
            sprites.destroyAllSpritesOfKind(SpriteKind.Player)

            let entropyGrid: TileData[] = createEntrophyGrid(gridData)
            let chosenTile: TileData = Math.pickRandom(entropyGrid)
            chosenTile.tileTypeOptions = [Math.pickRandom(chosenTile.tileTypeOptions)]
            chosenTile.TileHasBeenCollapse = true;
        
            let { x, y } = chosenTile.tilePosition;
            let index = chosenTile.tilesGridIndex;
            if (y != 0) modifyNeighbouringTile(chosenTile, Sides.top, gridData[index - dim.width]);
            if (y != dim.height - 1) modifyNeighbouringTile(chosenTile, Sides.bottom, gridData[index + dim.width]);
            if (x != 0) modifyNeighbouringTile(chosenTile, Sides.left, gridData[index - 1]);
            if (x != dim.width - 1) modifyNeighbouringTile(chosenTile, Sides.right, gridData[index + 1]);
        }
    }
initializeTileGrid(tileGrid,[TileTypeBlank, TileTypeCross, TileTypeDown, TileTypeLeft,TileTypeRight, TileTypeUp],Dimensions);
generateDungeonLevelRooms(tileGrid, Dimensions)
display(tileGrid, Dimensions)