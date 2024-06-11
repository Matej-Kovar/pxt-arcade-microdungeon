type TileData = {
    img: Image
    kind:number
}
const LevelDimensions: Size = { width: 10, height: 10 };
const ChunkSize: Size = { width: 5, height: 5 };
const TileSize: Size = { width: 12, height: 12 };
const RenderDistance: Size = { width: Math.ceil((userconfig.ARCADE_SCREEN_WIDTH + 0.5 * TileSize.width) / TileSize.width), height: Math.ceil((userconfig.ARCADE_SCREEN_HEIGHT - 0.5 * TileSize.height) / TileSize.height) }
const TestingPlayer: Creature = new Creature({ x: 1, y: 1 }, { x: 0, y: 0 }, sprites.create(assets.image`player-right`, SpriteKind.Player), 100, 100, 5, 5)
TestingPlayer.sprite.z = 10
const displayGrid: Sprite[][] = [];
const entityGrid: Sprite[][] = [];
let globalSeed: number = Math.random() * 2 ** 32;
const renderFrame = (gridData: ChunkData[]): void => {
    const startingPoint:Position = { y: TestingPlayer.absolutePosition.y - Math.ceil(RenderDistance.height / 2), x: TestingPlayer.absolutePosition.x - Math.ceil(RenderDistance.width / 2) }
    clearDisplayGrid(entityGrid)
    if (TestingPlayer.absolutePosition.x === 1 && TestingPlayer.absolutePosition.y === 1) {
        globalSeed = Math.random() * 2 ** 32
        resetChunkGrid(ChunkGrid, testingTileSet, LevelDimensions);
        modifyDungeonBorder(ChunkGrid, VoidTypeTile, LevelDimensions);
        exitAndEntry(ChunkGrid)
        generateDungeonLevelRooms(ChunkGrid, LevelDimensions);
    }
    if (startingPoint.x <= 0) {
        TestingPlayer.sprite.x = (TestingPlayer.absolutePosition.x + 0.5) * TileSize.width
        startingPoint.x = 0

    }
    if (startingPoint.y <= 0) {
        TestingPlayer.sprite.y = (TestingPlayer.absolutePosition.y + 0.5) * TileSize.height
        startingPoint.y = 0

    }
    if (TestingPlayer.absolutePosition.x + Math.floor(RenderDistance.width / 2) >= LevelDimensions.width * ChunkSize.width) {
        startingPoint.x = (LevelDimensions.width * ChunkSize.width) - RenderDistance.width
        TestingPlayer.sprite.x = (TestingPlayer.absolutePosition.x + 0.5 - startingPoint.x) * TileSize.width
    }
    if (TestingPlayer.absolutePosition.y + Math.floor(RenderDistance.height / 2) >= LevelDimensions.height * ChunkSize.height) {
        startingPoint.y = (LevelDimensions.height * ChunkSize.height) - RenderDistance.height
        TestingPlayer.sprite.y = (TestingPlayer.absolutePosition.y + 0.5 - startingPoint.y) * TileSize.height
    }
    const playerChunk = absoluteToChunks(TestingPlayer.absolutePosition)
    const playerTile = absoluteToTiles(TestingPlayer.absolutePosition)
    for (let i = 0; i < gridData[playerChunk.x + playerChunk.y *LevelDimensions.width].Entities.length; i++) {
        if (gridData[playerChunk.x + playerChunk.y * LevelDimensions.width].Entities[i].relativePosition.x === playerTile.x && gridData[playerChunk.x + playerChunk.y * LevelDimensions.width].Entities[i].relativePosition.y === playerTile.y) {
            gridData[playerChunk.x + playerChunk.y * LevelDimensions.width].Entities[i].pickUp()
            gridData[playerChunk.x + playerChunk.y * LevelDimensions.width].Entities.splice(i, 1)
        }
    }
    for (let i = 0; i < RenderDistance.height; i++) {
        for (let j = 0; j < RenderDistance.width; j++) {
            const chunkPos = absoluteToChunks({ x: startingPoint.x + j, y: startingPoint.y + i })
            const TilePos = absoluteToTiles({ x: startingPoint.x + j, y: startingPoint.y + i })
            for (let m = 0; m < gridData[chunkPos.x + chunkPos.y * LevelDimensions.width].Entities.length; m++) {
                if (gridData[chunkPos.x + chunkPos.y * LevelDimensions.width].Entities[m].relativePosition.x === TilePos.x && gridData[chunkPos.x + chunkPos.y * LevelDimensions.width].Entities[m].relativePosition.y === TilePos.y) {
                    entityGrid[i][j].setImage(lookupTileData(gridData[chunkPos.x + chunkPos.y * LevelDimensions.width].Entities[m].type).img)
                    entityGrid[i][j].setKind(SpriteKind.Entity)
                }
            }
            const tileData = gridData[chunkPos.x + chunkPos.y * LevelDimensions.width].chunkTypeOptions[0].imgData[TilePos.y][TilePos.x];
            displayGrid[i][j].setImage(lookupTileData(tileData).img);
            displayGrid[i][j].setKind(lookupTileData(tileData).kind)
        }
    }
    TestingPlayer.relativePosition = { y: TestingPlayer.absolutePosition.y - startingPoint.y, x: TestingPlayer.absolutePosition.x-startingPoint.x}
}
const initializeDisplayGrid = (grid: Sprite[][]) => {
    for (let i = 0; i < RenderDistance.height; i++) {
        grid.push([])
        for (let j = 0; j < RenderDistance.width; j++) {
                grid[i][j] = sprites.create(assets.image`void-tile`, SpriteKind.Tile)
                grid[i][j].setPosition(
                (j * TileSize.width + 0.5 * TileSize.width),
                (i * TileSize.height + 0.5 * TileSize.height)
            );
        }
    }
}  
const clearDisplayGrid = (grid: Sprite[][]) => {
    for (let i = 0; i < RenderDistance.height; i++) {
        for (let j = 0; j < RenderDistance.width; j++) {
                grid[i][j].setImage(assets.image`void-tile`)
        }
    }
}
const lookupTileData = (ID: number):TileData => {
    switch (ID) {
        case 15:
            return { img: assets.image`wall`, kind: SpriteKind.Wall }
            break;
        case 14: 
            return { img: assets.image`floor`, kind: SpriteKind.Floor }
            break;
        case 13: 
            return { img: assets.image`entry-point-tile`, kind: SpriteKind.EntryPoint }
            break;
        case 12:
            return { img: assets.image`exit-point-tile`, kind: SpriteKind.ExitPoint }
            break;
        case 0:
            return { img: assets.image`regen-potion`, kind: SpriteKind.Entity }
            break;
        case 1:
            return { img: assets.image`healthBoost-potion`, kind: SpriteKind.Entity }
            break;
        case 2:
            return { img: assets.image`attackBoost`, kind: SpriteKind.Entity }
            break;
        case 3:
            return { img: assets.image`defenseBoost`, kind: SpriteKind.Entity }
                break;
        default:
            return { img: assets.image`voidTile`, kind: SpriteKind.Tile }
            break;
    }
}