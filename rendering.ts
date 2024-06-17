class TileData {
    costToTravel: number = Infinity;
    toEnd: number = 0;
    value: number = 0;
    state: number = 0;
    position: Position;
    sprite: Sprite;
    cameFrom:TileData = undefined
    constructor (pos:Position) {
        this.position = pos
    }
}
const LevelDimensions: Size = { width: 10, height: 10 };
const ChunkSize: Size = { width: 5, height: 5 };
const TileSize: Size = { width: 12, height: 12 };
const RenderDistance: Size = { width: Math.floor((userconfig.ARCADE_SCREEN_WIDTH + 0.5 * TileSize.width) / TileSize.width), height: Math.floor((userconfig.ARCADE_SCREEN_HEIGHT + 0.5 * TileSize.height) / TileSize.height) }
const EntryPointPosition: Position = { x: Math.floor(Math.random() * (LevelDimensions.width - 1) + 1), y: Math.floor(Math.random() * (LevelDimensions.height - 1) + 1) }
const ExitPointPosition: Position = { x: 0, y: 0 }
exitAndEntry()
const TestingPlayer: Creature = new Creature({ x: EntryPointPosition.x * ChunkSize.width + 2, y: EntryPointPosition.y * ChunkSize.height + 2 }, EntityTypes.player)
TestingPlayer.sprite = sprites.create(assets.image`player-right`, SpriteKind.Player)
TestingPlayer.sprite.z = 10
const displayGrid: TileData[][] = [];
const entityGrid: TileData[][] = [];
const startingPoint:Position = { y: TestingPlayer.absolutePosition.y - Math.ceil(RenderDistance.height / 2), x: TestingPlayer.absolutePosition.x - Math.ceil(RenderDistance.width / 2) }
let globalSeed: number = Math.random() * 2 ** 32;
const renderFrame = (gridData: ChunkData[][]): void => {
    for (let i = 0; i < Enemies.length; i++) {
        Enemies[i].active = false
    }
    clearDisplayGrid(entityGrid)
    startingPoint.y = TestingPlayer.absolutePosition.y - Math.ceil(RenderDistance.height / 2)
    startingPoint.x = TestingPlayer.absolutePosition.x - Math.ceil(RenderDistance.width / 2 )
    if (TestingPlayer.absolutePosition.x === ExitPointPosition.x * ChunkSize.width + 2 && TestingPlayer.absolutePosition.y === ExitPointPosition.y * ChunkSize.height + 2) {
        EntryPointPosition.x = Math.floor(Math.random() * (LevelDimensions.width - 1))
        EntryPointPosition.y = Math.floor(Math.random() * (LevelDimensions.height - 1))
        exitAndEntry()
        TestingPlayer.absolutePosition.x = EntryPointPosition.x * ChunkSize.width + 2
        TestingPlayer.absolutePosition.y = EntryPointPosition.y * ChunkSize.height + 2
        startingPoint.y = TestingPlayer.absolutePosition.y - Math.ceil(RenderDistance.height / 2)
        startingPoint.x = TestingPlayer.absolutePosition.x - Math.ceil(RenderDistance.width / 2)
        TestingPlayer.sprite.x = (TestingPlayer.absolutePosition.x - startingPoint.x + 0.5) * TileSize.width
        TestingPlayer.sprite.y = (TestingPlayer.absolutePosition.y - startingPoint.y + 0.5) * TileSize.height
        globalSeed = Math.random() * 2 ** 32
        resetChunkGrid(ChunkGrid, testingTileSet, LevelDimensions);
        generatePath(ChunkGrid)
        modifyDungeonBorder(ChunkGrid, VoidTypeTile, LevelDimensions);
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
    for (let i = 0; i < RenderDistance.height; i++) {
        for (let j = 0; j < RenderDistance.width; j++) {
            const chunkPos = absoluteToChunks({ x: startingPoint.x + j, y: startingPoint.y + i })
            const TilePos = absoluteToTiles({ x: startingPoint.x + j, y: startingPoint.y + i })
            for (let m = 0; m < gridData[chunkPos.y][chunkPos.x].Entities.length; m++) {
                if (gridData[chunkPos.y][chunkPos.x].Entities[m].relativePosition.x === TilePos.x && gridData[chunkPos.y][chunkPos.x].Entities[m].relativePosition.y === TilePos.y) {
                    lookupTileData(gridData[chunkPos.y][chunkPos.x].Entities[m].type, entityGrid[i][j])
                }
            }
            const tileData = gridData[chunkPos.y][chunkPos.x].chunkTypeOptions[0].imgData[TilePos.y][TilePos.x];
            lookupTileData(tileData, displayGrid[i][j]);
        }
    }
    const playerChunk = absoluteToChunks(TestingPlayer.absolutePosition)
    const playerTile = absoluteToTiles(TestingPlayer.absolutePosition)
    if (entityGrid[TestingPlayer.absolutePosition.y - startingPoint.y][TestingPlayer.absolutePosition.x - startingPoint.x].sprite.kind() === SpriteKind.Item) {
        for (let i = 0; i < gridData[playerChunk.y][playerChunk.x].Entities.length; i++) {
            if (gridData[playerChunk.y][playerChunk.x].Entities[i].relativePosition.x === playerTile.x && gridData[playerChunk.y][playerChunk.x].Entities[i].relativePosition.y === playerTile.y) {
                gridData[playerChunk.y][playerChunk.x].Entities[i].pickUp()
                gridData[playerChunk.y][playerChunk.x].Entities.splice(i, 1)
            }
        }
    }
    for (let i = 0; i < Enemies.length; i++) {
        if (Enemies[i].absolutePosition.x > startingPoint.x && Enemies[i].absolutePosition.x < startingPoint.x + RenderDistance.width && Enemies[i].absolutePosition.y > startingPoint.y && Enemies[i].absolutePosition.y < startingPoint.y + RenderDistance.height) {
            Enemies[i].active = true
            if (Enemies[i].path.length > 0) {
                if (entityGrid[Enemies[i].newPos.y - startingPoint.y][Enemies[i].newPos.x - startingPoint.x].sprite.kind() !== SpriteKind.Player) {
                    Enemies[i].absolutePosition.y = Enemies[i].newPos.y
                    Enemies[i].absolutePosition.x = Enemies[i].newPos.x
                    Enemies[i].path.splice(Enemies[i].path.length - 1, 1)
                }
            }
            lookupTileData(Enemies[i].type, entityGrid[Enemies[i].absolutePosition.y - startingPoint.y][Enemies[i].absolutePosition.x - startingPoint.x])
            //if (absoluteToChunks(Enemies[i].absolutePosition).x === absoluteToChunks(TestingPlayer.absolutePosition).x && absoluteToChunks(Enemies[i].absolutePosition).y === absoluteToChunks(TestingPlayer.absolutePosition).y) {
                //Enemies[i].path = []
            //}
            if (Enemies[i].path.length === 0) {
                Enemies[i].path = findPath(displayGrid[Enemies[i].absolutePosition.y-startingPoint.y][Enemies[i].absolutePosition.x - startingPoint.x], displayGrid[TestingPlayer.absolutePosition.y - startingPoint.y][TestingPlayer.absolutePosition.x - startingPoint.x], displayGrid)
            }
                Enemies[i].newPos.x = Enemies[i].path[Enemies[i].path.length - 1].x
            Enemies[i].newPos.y = Enemies[i].path[Enemies[i].path.length - 1].y
            console.log("Absolute pos:")
            console.log(Enemies[i].absolutePosition)
            console.log("New pos:")
            console.log(Enemies[i].newPos)
            console.log(Enemies[i].newPos)
        }
        
    }
}
const initializeDisplayGrid = (grid: TileData[][]) => {
    for (let i = 0; i < RenderDistance.height; i++) {
        grid.push([])
        for (let j = 0; j < RenderDistance.width; j++) {
            grid[i][j] = new TileData({ y: i, x: j })
            grid[i][j].sprite = sprites.create(assets.image`void-tile`, SpriteKind.Tile)
            grid[i][j].sprite.setPosition((j * TileSize.width + 0.5 * TileSize.width), (i * TileSize.height + 0.5 * TileSize.height));
        }
    }
}  
const clearDisplayGrid = (grid: TileData[][]) => {
    for (let i = 0; i < RenderDistance.height; i++) {
        for (let j = 0; j < RenderDistance.width; j++) {
                grid[i][j].sprite.setImage(assets.image`void-tile`)
        }
    }
}
const lookupTileData = (ID: number, tile:TileData) => {
    switch (ID) {
        case 15:
            tile.sprite.setImage(assets.image`wall`)
            tile.sprite.setKind(SpriteKind.Wall)
            break;
        case 14: 
            tile.sprite.setImage(assets.image`floor`)
            tile.sprite.setKind(SpriteKind.Floor)
            break;
        case 13: 
            tile.sprite.setImage(assets.image`entry-point-tile`)
            tile.sprite.setKind(SpriteKind.EntryPoint)
            break;
        case 12:
            tile.sprite.setImage(assets.image`exit-point-tile`)
            tile.sprite.setKind(SpriteKind.ExitPoint)
            break;
        case 0:
            tile.sprite.setImage(assets.image`regen-potion`)
            tile.sprite.setKind(SpriteKind.Item)
            break;
        case 1:
            tile.sprite.setImage(assets.image`healthBoost-potion`)
            tile.sprite.setKind(SpriteKind.Item)
            break;
        case 2:
            tile.sprite.setImage(assets.image`attackBoost`)
            tile.sprite.setKind(SpriteKind.Item)
            break;
        case 3:
            tile.sprite.setImage(assets.image`defenseBoost`)
            tile.sprite.setKind(SpriteKind.Item)
            break;
        case 6:
            tile.sprite.setImage(assets.image`entity`)
            tile.sprite.setKind(SpriteKind.Player)
            break;
        default:
            tile.sprite.setImage(assets.image`closed`)
            tile.sprite.setKind(SpriteKind.Tile)
            break;
    }
}