namespace userconfig {
    export const ARCADE_SCREEN_WIDTH = 160
    export const ARCADE_SCREEN_HEIGHT = 120
}
namespace SpriteKind {
    export const Tile = SpriteKind.create()
    
}
const TestingPlayer:Player = {inChunkPosition:{x:0, y:0}, inWorldPosition:{x:3, y:10}}
let globalSeed: number = 0;
initializeChunkGrid(ChunkGrid, testingTileSet, LevelDimensions);
globalSeed = Math.random() * 2 ** 32;
modifyDungeonBorder(ChunkGrid, VoidTypeTile, LevelDimensions)
generateDungeonLevelRooms(ChunkGrid, LevelDimensions);
initializeDisplayGrid(displayGrid)
console.log(displayGrid.length)
displayTiles(ChunkGrid, LevelDimensions);
let player = sprites.create(assets.image`player`, SpriteKind.Player)
controller.moveSprite(player, 100, 100)
scene.cameraFollowSprite(player)
