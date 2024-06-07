class TileData {
    tileType:number
    spriteData:Sprite
    constructor(type:number, img:Sprite) {
        this.spriteData = img;
        this.tileType = type
    }
}
const LevelDimensions: Size = { width: 10, height: 10 };
const ChunkSize: Size = { width: 5, height: 5 };
const TileSize: Size = { width: 12, height: 12 };
const RenderDistance: Size = { width: Math.ceil((userconfig.ARCADE_SCREEN_WIDTH + 0.5*TileSize.width) / TileSize.width), height: Math.ceil((userconfig.ARCADE_SCREEN_HEIGHT - 0.5*TileSize.height) / TileSize.height) }
const TestingPlayer: Player = { Position: { x: Math.ceil(RenderDistance.width / 2), y: Math.ceil(RenderDistance.height / 2) }, sprite: sprites.create(assets.image`player`, SpriteKind.Player) }
TestingPlayer.sprite.z = 10
const displayGrid: TileData[][] = [];
const renderFrame = (gridData: ChunkData[]): void => {
    const startingPoint: Position = { y: TestingPlayer.Position.y - Math.ceil(RenderDistance.height / 2), x: TestingPlayer.Position.x - Math.ceil(RenderDistance.width / 2) }
    console.log(startingPoint)
    console.log(TestingPlayer.Position)
    if (startingPoint.x <= 0) {
        TestingPlayer.sprite.x = (TestingPlayer.Position.x + 0.5) * TileSize.width
        startingPoint.x = 0

    }
    if (startingPoint.y <= 0) {
        TestingPlayer.sprite.y = (TestingPlayer.Position.y + 0.5) * TileSize.height
        startingPoint.y = 0

    }
    if (TestingPlayer.Position.x + Math.floor(RenderDistance.width / 2) > LevelDimensions.width * ChunkSize.width) {
        startingPoint.x = (LevelDimensions.width * ChunkSize.width) - RenderDistance.width
        TestingPlayer.sprite.x = (TestingPlayer.Position.x + 0.5 - startingPoint.x) * TileSize.width
    }
    if (TestingPlayer.Position.y + Math.floor(RenderDistance.height / 2) > LevelDimensions.height * ChunkSize.height) {
        startingPoint.y = (LevelDimensions.height * ChunkSize.height) - RenderDistance.height
        TestingPlayer.sprite.y = (TestingPlayer.Position.y + 0.5 - startingPoint.y) * TileSize.height
    }
    for (let i = 0; i < RenderDistance.height; i++) {
        for (let j = 0; j < RenderDistance.width; j++) {
            const imgData = gridData[Math.floor((startingPoint.x + j) / ChunkSize.width) + (Math.floor((startingPoint.y + i) / ChunkSize.height) * LevelDimensions.width)].chunkTypeOptions[0].imgData[(startingPoint.y + i) - Math.floor((startingPoint.y + i) / ChunkSize.height) * ChunkSize.height][(startingPoint.x + j) - Math.floor((startingPoint.x + j) / ChunkSize.width) * ChunkSize.width];
            displayGrid[i][j].spriteData.setImage(imgData === 15 ? assets.image`wall` : assets.image`floor`);
        }
    }
}
const initializeDisplayGrid = (grid: TileData[][]) => {
    for (let i = 0; i < RenderDistance.height; i++) {
        grid.push([])
        for (let j = 0; j < RenderDistance.width; j++) {
                    grid[i][j] = new TileData(0 , sprites.create(assets.image`void-tile`, SpriteKind.Tile))
                    grid[i][j].spriteData.setPosition(
                        (j * TileSize.width + 0.5 * TileSize.width),
                        (i * TileSize.height + 0.5 * TileSize.height)
                    );
                }
            }
        }
/*
for (let j = 0; j < ChunkGrid.length; j++) {
    if (ChunkGrid[j].chunkPositon.x === TestingPlayer.inWorldPosition.x - 1 && ChunkGrid[j].chunkPositon.y === TestingPlayer.inWorldPosition.y - 1) {
        const ChunksToDisplay: ChunkData[] = [];
        for (let m = 0; m < RenderDistance.height; m++) {
            for (let i = 0; i < RenderDistance.width; i++) {
                ChunksToDisplay.push(ChunkGrid[j + i + m * LevelDimensions.width])
            }
        }
        displayTiles(ChunksToDisplay, LevelDimensions);
        break
    }
}
*/     