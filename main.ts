namespace userconfig {
    export const ARCADE_SCREEN_WIDTH = 160
    export const ARCADE_SCREEN_HEIGHT = 120
}
namespace SpriteKind {
    export const Tile = SpriteKind.create()
    export const Wall = SpriteKind.create()
    export const Floor = SpriteKind.create()
    export const Entity = SpriteKind.create()
    export const EntryPoint = SpriteKind.create()
    export const ExitPoint = SpriteKind.create()
}
initializeChunkGrid(ChunkGrid, testingTileSet, LevelDimensions);
initializeDisplayGrid(displayGrid)
initializeDisplayGrid(entityGrid)
scene.centerCameraAt(Math.ceil(RenderDistance.width / 2)*TileSize.width, Math.ceil(RenderDistance.height / 2 - 0.5)*TileSize.height)
TestingPlayer.sprite.x = (TestingPlayer.absolutePosition.x + 0.5) * TileSize.width
TestingPlayer.sprite.y = (TestingPlayer.absolutePosition.y + 0.5) * TileSize.height
renderFrame(ChunkGrid);