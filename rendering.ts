const LevelDimensions: Size = { width: 10, height: 10 };
const ChunkSize: Size = { width: 5, height: 5 };
const TileSize: Size = { width: 12, height: 12 };
const RenderDistance: Size = { width: Math.ceil((userconfig.ARCADE_SCREEN_WIDTH + 0.5*TileSize.width) / TileSize.width), height: Math.ceil((userconfig.ARCADE_SCREEN_HEIGHT - 0.5*TileSize.height) / TileSize.height) }
const TestingPlayer: Player = { absolutePosition: { x: 10, y: 5 }, relativePosition: { x: 0, y: 0 }, sprite: sprites.create(assets.image`player`, SpriteKind.Player)}
TestingPlayer.sprite.z = 10
const displayGrid: Sprite[][] = [];
const renderFrame = (gridData: ChunkData[]): void => {
    const startingPoint:Position = { y: TestingPlayer.absolutePosition.y - Math.ceil(RenderDistance.height / 2), x: TestingPlayer.absolutePosition.x - Math.ceil(RenderDistance.width / 2) }
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
            const imgData = gridData[Math.floor((startingPoint.x + j) / ChunkSize.width) + (Math.floor((startingPoint.y + i) / ChunkSize.height) * LevelDimensions.width)].chunkTypeOptions[0].imgData[(startingPoint.y + i) - Math.floor((startingPoint.y + i) / ChunkSize.height) * ChunkSize.height][(startingPoint.x + j) - Math.floor((startingPoint.x + j) / ChunkSize.width) * ChunkSize.width];
            displayGrid[i][j].setImage(imgData === 15 ? assets.image`wall` : assets.image`floor`);
            displayGrid[i][j].setKind(imgData === 15 ? SpriteKind.Wall : SpriteKind.Floor)
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