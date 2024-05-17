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
    const Dimensions: Size = { width: 5, height: 5 };
    const tileSize = 16;
    const tileGrid: TileData[] = [];
    
    const TileTypes = [
        new TileTypeData(assets.tile`tile-blank`, ["AAA", "AAA", "AAA", "AAA"], "Tile Blank", 0, [[]]),
        new TileTypeData(assets.tile`tile-up`, ["ABA", "ABA", "AAA", "ABA"], "Tile Up", 1,[[]]),
        new TileTypeData(assets.tile`tile-down`, ["AAA", "ABA", "ABA", "ABA"], "Tile Down", 2,[[]]),
        new TileTypeData(assets.tile`tile-right`, ["ABA", "ABA", "ABA", "AAA"], "Tile Right", 3,[[]]),
        new TileTypeData(assets.tile`tile-left`, ["ABA", "AAA", "ABA", "ABA"], "Tile Left", 4,[[]]),
        new TileTypeData(assets.tile`tile-cross`, ["ABA", "ABA", "ABA", "ABA"], "Tile Cross", 5,[[]])
    ];
    
    function display(gridData: TileData[], dim: Size): void {
        gridData.filter(tile => tile.TileHasBeenCollapse).forEach(tile => {
            let newSprite = sprites.create(tile.tileTypeOptions[0].imgPath, SpriteKind.Player);
            newSprite.setPosition(tile.tilePosition.x * tileSize + (0.5 * tileSize), tile.tilePosition.y * tileSize + (0.5 * tileSize));
        });
    }
    
    function modifyNeighbouringTile(tileData: TileData, checkSide: Sides, NeighbourTile: TileData) {
        if (!NeighbourTile.TileHasBeenCollapse) {
            let opositeSide = checkSide >= 2 ? checkSide - 2 : checkSide + 2;
            NeighbourTile.tileTypeOptions = NeighbourTile.tileTypeOptions.filter(option => option.compatibleSides[opositeSide] === tileData.tileTypeOptions[0].compatibleSides[checkSide]);
        }
    }
    
    function createEntrophyGrid(gridData: TileData[]): TileData[] {
        let newGrid = gridData.filter(tile => !tile.TileHasBeenCollapse);
        newGrid.sort((a, b) => a.tileTypeOptions.length - b.tileTypeOptions.length);
        return newGrid.filter(tile => tile.tileTypeOptions.length === newGrid[0].tileTypeOptions.length);
    }
    
    function initializeTileGrid(gridData: TileData[], tileSet: TileTypeData[], dim: Size) {
        for (let i = 0; i < dim.width * dim.height; i++) {
            gridData[i] = new TileData({ y: Math.floor(i / dim.width), x: i % dim.width }, i, [...TileTypes]);
        }
    }
    
    function generateDungeonLevelRooms(gridData: TileData[], dim: Size) {
        for (let index = 0; index < gridData.length; index++) {
            sprites.destroyAllSpritesOfKind(SpriteKind.Player);
            let entropyGrid = createEntrophyGrid(gridData);
            let chosenTile = Math.pickRandom(entropyGrid);
            chosenTile.tileTypeOptions = [Math.pickRandom(chosenTile.tileTypeOptions)];
            chosenTile.TileHasBeenCollapse = true;
            let { x, y } = chosenTile.tilePosition;
            let index = chosenTile.tilesGridIndex;
            if (y != 0) modifyNeighbouringTile(chosenTile, Sides.top, gridData[index - dim.width]);
            if (y != dim.height - 1) modifyNeighbouringTile(chosenTile, Sides.bottom, gridData[index + dim.width]);
            if (x != 0) modifyNeighbouringTile(chosenTile, Sides.left, gridData[index - 1]);
            if (x != dim.width - 1) modifyNeighbouringTile(chosenTile, Sides.right, gridData[index + 1]);
        }
    }
    
    initializeTileGrid(tileGrid, TileTypes, Dimensions);
    generateDungeonLevelRooms(tileGrid, Dimensions);
    display(tileGrid, Dimensions);