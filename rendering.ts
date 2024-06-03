const LevelDimensions: Size = { width: 10, height: 10 };
const ChunkSize: Size = { width: 5, height: 5 };
const TileSize: Size = { width: 12, height: 12 };
const RenderDistance: Size = { width: Math.ceil(userconfig.ARCADE_SCREEN_WIDTH/TileSize.width), height: Math.ceil(userconfig.ARCADE_SCREEN_HEIGHT/TileSize.height) }
const displayGrid: Sprite[][] = [];
function displayTiles(gridData: ChunkData[], dim: Size): void {
            for (let i = 0; i < RenderDistance.height; i++) {
                for (let j = 0; j < RenderDistance.width; j++) {
                    const imgData = gridData[Math.floor(j/ChunkSize.width) + Math.floor(i/ChunkSize.height) * LevelDimensions.width].chunkTypeOptions[0].imgData[i%ChunkSize.height][j%ChunkSize.width];
                    displayGrid[i][j].setImage(imgData === 15 ? assets.image`wall` : assets.image`floor`);
                }
            }
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