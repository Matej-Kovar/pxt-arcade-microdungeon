namespace userconfig {
    export const ARCADE_SCREEN_WIDTH = 160
    export const ARCADE_SCREEN_HEIGHT = 130
}
namespace SpriteKind {
    export const Tile = SpriteKind.create()
    export const Wall = SpriteKind.create()
    export const Floor = SpriteKind.create()
    export const Item = SpriteKind.create()
    export const EntryPoint = SpriteKind.create()
    export const ExitPoint = SpriteKind.create()
}
game.setGameOverMessage(true, "GAME OVER!")
game.setGameOverPlayable(false, music.melodyPlayable(music.powerDown), false)
game.setGameOverEffect(false, effects.dissolve)
let Enemies: Creature[] = []
initializeChunkGrid(ChunkGrid, TileSetIndexes, LevelDimensions);
initializeDisplayGrid(displayGrid)
initializeDisplayGrid(entityGrid)
scene.centerCameraAt(Math.ceil(RenderDistance.width / 2)*TileSize.width, Math.ceil(RenderDistance.height / 2 - 0.5)*TileSize.height)
globalSeed = Math.random() * 2 ** 32
generatePath(ChunkGrid)
modifyDungeonBorder(ChunkGrid, voidTypeChunk, LevelDimensions);
generateDungeonLevelRooms(ChunkGrid, LevelDimensions);
renderFrame(ChunkGrid);
