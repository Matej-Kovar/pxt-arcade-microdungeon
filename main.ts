namespace userconfig {
    export const ARCADE_SCREEN_WIDTH = 160
    export const ARCADE_SCREEN_HEIGHT = 120
}
namespace SpriteKind {
    export const Tile = SpriteKind.create()
    export const Wall = SpriteKind.create()
    export const Floor = SpriteKind.create()
}
type Player = {
    absolutePosition: Position
    relativePosition:Position
    sprite: Sprite
}
let globalSeed: number = 0;
initializeChunkGrid(ChunkGrid, testingTileSet, LevelDimensions);
globalSeed = Math.random() * 2 ** 32;
modifyDungeonBorder(ChunkGrid, VoidTypeTile, LevelDimensions)
generateDungeonLevelRooms(ChunkGrid, LevelDimensions);
initializeDisplayGrid(displayGrid)
scene.centerCameraAt(Math.ceil(RenderDistance.width / 2)*TileSize.width, Math.ceil(RenderDistance.height / 2 - 0.5)*TileSize.height)
renderFrame(ChunkGrid);
TestingPlayer.sprite.setPosition((Math.ceil(RenderDistance.width / 2) + 0.5) * TileSize.width, (Math.ceil(RenderDistance.height / 2) + 0.5) * TileSize.height)
