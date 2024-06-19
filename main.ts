namespace SpriteKind {
    export const Tile = SpriteKind.create()
    export const Wall = SpriteKind.create()
    export const Floor = SpriteKind.create()
    export const Item = SpriteKind.create()
    export const EntryPoint = SpriteKind.create()
    export const ExitPoint = SpriteKind.create()
}
type Size = {
    width: number,
    height: number
}
type Position = {
    x: number
    y: number
}
const absolutePosition = (chunkPositon: Position, tilePosition: Position, offset: Position): Position => {
    return { x: chunkPositon.x * ChunkSize.width + tilePosition.x + offset.x, y: chunkPositon.y * ChunkSize.height + tilePosition.y + offset.y }
}
const absoluteToChunks = (absolutePosition: Position): Position => {
    return { x: Math.floor(absolutePosition.x / ChunkSize.width), y: Math.floor(absolutePosition.y / ChunkSize.height) }
}
const absoluteToTiles = (absolutePosition: Position): Position => {
    return { x: absolutePosition.x - Math.floor(absolutePosition.x / ChunkSize.width) * ChunkSize.width, y: absolutePosition.y - Math.floor(absolutePosition.y / ChunkSize.height) * ChunkSize.height }
}
//inicializace velikostí
const LevelDimensions: Size = { width: 4, height: 4 };
const ChunkSize: Size = { width: 5, height: 5 };
const TileSize: Size = { width: 12, height: 12 };
const RenderDistance: Size = { width: Math.ceil((60 + 0.5 * TileSize.width) / TileSize.width), height: Math.ceil((60 + 0.5 * TileSize.height) / TileSize.height) }
//inicializace vchodu a východu do dungeonu
const EntryPointPosition: Position = { x: Math.floor(Math.random() * (LevelDimensions.width - 1) + 1), y: Math.floor(Math.random() * (LevelDimensions.height - 1) + 1) }
const ExitPointPosition: Position = { x: 0, y: 0 }
exitAndEntry()
//inicializace Hráče
let level: number = 1
const TestingPlayer: Creature = { absolutePosition: { x: EntryPointPosition.x * ChunkSize.width + 2, y: EntryPointPosition.y * ChunkSize.height + 2 }, secondaryPosition: { x: EntryPointPosition.x * ChunkSize.width + 2, y: EntryPointPosition.y * ChunkSize.height + 2 }, type: EntityTypes.player, health: 100, maxhealth: 100, defense: 100, attack: 10, path: [] }
const TestingPlayerSprite = sprites.create(assets.image`player-right`, SpriteKind.Player)
TestingPlayerSprite.z = 10
const startingPoint: Position = { y: TestingPlayer.absolutePosition.y - Math.ceil(RenderDistance.height / 2), x: TestingPlayer.absolutePosition.x - Math.ceil(RenderDistance.width / 2) }
TestingPlayerSprite.x = (TestingPlayer.absolutePosition.x - startingPoint.x + 0.5) * TileSize.width
TestingPlayerSprite.y = (TestingPlayer.absolutePosition.y - startingPoint.y + 0.5) * TileSize.height
const playerHealth = textsprite.create(TestingPlayer.health.toString(), 0, 1)
playerHealth.setIcon(assets.image`lives`)
playerHealth.setOutline(1, 15)
playerHealth.x = -25
playerHealth.y = -15
playerHealth.z = 100
const playerAttack = textsprite.create(TestingPlayer.attack.toString(), 0, 1)
playerAttack.setIcon(assets.image`attack`)
playerAttack.setOutline(1, 15)
playerAttack.x = 25
playerAttack.y = -15
playerAttack.z = 100
const playerDefense = textsprite.create(TestingPlayer.defense.toString(), 0, 1)
playerDefense.setIcon(assets.image`defense`)
playerDefense.setOutline(1, 15)
playerDefense.x = 55
playerDefense.y = -15
playerDefense.z = 100
const dungeonLevel = textsprite.create(level.toString(), 0, 1)
dungeonLevel.setIcon(assets.image`level`)
dungeonLevel.setOutline(1, 15)
dungeonLevel.x = 100
dungeonLevel.y = -15
dungeonLevel.z = 100
let tileSet: ChunkTypeData[] = [];
loadTileSet(assets.image`chunkset-room`, tileSet, 10, ChunkTypes.room)
loadTileSet(assets.image`chunkset-hallway`, tileSet, 10, ChunkTypes.hallway)
loadTileSet(assets.image`chunkset-broken`, tileSet, 1, ChunkTypes.broken)
tileSet = createTileRotations(tileSet)
const TileSetIndexes: number[] = []
for (let i = 1; i < tileSet.length - 1; i++) {
    TileSetIndexes.push(i)
}
playerHealth.setText("assets-loaded")
game.setGameOverMessage(true, "GAME OVER!")
game.setGameOverPlayable(false, music.melodyPlayable(music.powerDown), false)
game.setGameOverEffect(false, effects.dissolve)
let Enemies: Creature[] = []
initializeChunkGrid(ChunkGrid, TileSetIndexes, LevelDimensions);
playerHealth.setText("chunks")
initializeDisplayGrid(displayGrid)
console.log(displayGrid.length)
console.log(displayGrid[0].length)
initializeDisplayGrid(entityGrid)
playerHealth.setText("grids-inicialized")
scene.centerCameraAt(Math.ceil(RenderDistance.width / 2) * TileSize.width, Math.ceil(RenderDistance.height / 2 - 0.5) * TileSize.height)
globalSeed = Math.random() * 2 ** 32
generatePath(ChunkGrid)
playerHealth.setText("path-generated")
modifyDungeonBorder(ChunkGrid, voidTypeChunk, LevelDimensions);
playerHealth.setText("border-modyfied")
generateDungeonLevelRooms(ChunkGrid, LevelDimensions);
playerHealth.setText("dungeonLevel")
renderFrame(ChunkGrid);