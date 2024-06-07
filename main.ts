namespace userconfig {
    export const ARCADE_SCREEN_WIDTH = 160
    export const ARCADE_SCREEN_HEIGHT = 120
}
namespace SpriteKind {
    export const Tile = SpriteKind.create()
}
type Player = {
    Position: Position
    sprite: Sprite
}
let globalSeed: number = 0;
initializeChunkGrid(ChunkGrid, testingTileSet, LevelDimensions);
globalSeed = Math.random() * 2 ** 32;
modifyDungeonBorder(ChunkGrid, VoidTypeTile, LevelDimensions)
generateDungeonLevelRooms(ChunkGrid, LevelDimensions);
initializeDisplayGrid(displayGrid)
renderFrame(ChunkGrid);
scene.centerCameraAt(Math.ceil(RenderDistance.width / 2)*TileSize.width, Math.ceil(RenderDistance.height / 2 - 0.5)*TileSize.height)
TestingPlayer.sprite.setPosition((TestingPlayer.Position.x - 0.5) * TileSize.width, (TestingPlayer.Position.y + 0.5) * TileSize.height)
