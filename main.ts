namespace userconfig {
    export const ARCADE_SCREEN_WIDTH = 160
    export const ARCADE_SCREEN_HEIGHT = 128
}
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
const absoluteToChunks = (absolutePosition:Position):Position => {
    return {x: Math.floor(absolutePosition.x/ChunkSize.width), y: Math.floor(absolutePosition.y/ChunkSize.height)}
}
const absoluteToTiles = (absolutePosition:Position):Position => {
    return {x: absolutePosition.x - Math.floor(absolutePosition.x/ChunkSize.width)*ChunkSize.width, y: absolutePosition.y - Math.floor(absolutePosition.y/ChunkSize.height)*ChunkSize.height}
}
//inicializace velikostí
const LevelDimensions: Size = { width: 10, height: 10 };
const ChunkSize: Size = { width: 5, height: 5 };
const TileSize: Size = { width: 12, height: 12 };
const RenderDistance: Size = { width: Math.ceil((userconfig.ARCADE_SCREEN_WIDTH + 0.5 * TileSize.width) / TileSize.width), height: Math.ceil((userconfig.ARCADE_SCREEN_HEIGHT + 0.5 * TileSize.height) / TileSize.height) }
//inicializace vchodu a východu do dungeonu
const EntryPointPosition: Position = { x: Math.floor(Math.random() * (LevelDimensions.width - 1) + 1), y: Math.floor(Math.random() * (LevelDimensions.height - 1) + 1) }
const ExitPointPosition: Position = { x: 0, y: 0 }
exitAndEntry()
//inicializace Hráče
let level:number = 1
const TestingPlayer: Creature = {absolutePosition:{ x: EntryPointPosition.x * ChunkSize.width + 2, y: EntryPointPosition.y * ChunkSize.height + 2 }, secondaryPosition:{ x: EntryPointPosition.x * ChunkSize.width + 2, y: EntryPointPosition.y * ChunkSize.height + 2 }, type: EntityTypes.player, health: 100, maxhealth: 100, defense: 5, attack:10, path:[], side:Sides.bottom}
const TestingPlayerSprite = sprites.create(assets.image`player-right`, SpriteKind.Player)
TestingPlayerSprite.z = 10
const startingPoint: Position = { y: TestingPlayer.absolutePosition.y - Math.ceil(RenderDistance.height / 2), x: TestingPlayer.absolutePosition.x - Math.ceil(RenderDistance.width / 2) }
TestingPlayerSprite.x = (TestingPlayer.absolutePosition.x - startingPoint.x + 0.5) * TileSize.width
TestingPlayerSprite.y = (TestingPlayer.absolutePosition.y - startingPoint.y + 0.5) * TileSize.height
const playerHealth = textsprite.create(TestingPlayer.health.toString(), 0, 1)
playerHealth.setIcon(assets.image`lives`)
playerHealth.setOutline(1, 15)
playerHealth.x = 20
playerHealth.y = 15
playerHealth.z = 50
const playerAttack = textsprite.create(TestingPlayer.attack.toString(), 0, 1)
playerAttack.setIcon(assets.image`attack`)
playerAttack.setOutline(1, 15)
playerAttack.x = 75
playerAttack.y = 15
playerAttack.z = 50
const playerDefense = textsprite.create(TestingPlayer.defense.toString(), 0, 1)
playerDefense.setIcon(assets.image`defense`)
playerDefense.setOutline(1, 15)
playerDefense.x = 105
playerDefense.y = 15
playerDefense.z = 50
const dungeonLevel = textsprite.create(level.toString(), 0, 1)
dungeonLevel.setIcon(assets.image`level`)
dungeonLevel.setOutline(1, 15)
dungeonLevel.x = 145
dungeonLevel.y = 15
dungeonLevel.z = 50
let gameIsRunnning = false
let menu: Sprite = sprites.create(assets.image`menu`, SpriteKind.Tile)
menu.x = 84
menu.y = 72
menu.z = 100
let title1 = textsprite.create("MICRO")
title1.setOutline(2, 15)
title1.setMaxFontHeight(15)
title1.x = 84
title1.y = 40
title1.z = 101
let title2 = textsprite.create("DUNGEON")
title2.setOutline(2, 15)
title2.setMaxFontHeight(15)
title2.x = 84
title2.y = 65
title2.z = 101
let title3 = textsprite.create("Press A")
title3.setOutline(2, 15)
title3.setMaxFontHeight(10)
title3.x = 84
title3.y = 105
title3.z = 101
const BlankTypeChunk:ChunkTypeData = {
    imgData: [
    [14, 14, 14, 14, 14],
    [14, 14, 14, 14, 14],
    [14, 14, 14, 14, 14],
    [14, 14, 14, 14, 14],
    [14, 14, 14, 14, 14]
    ], weight: 1 ,chunkID: 0, chunkType: ChunkTypes.room
}
let tileSet: ChunkTypeData[] = [];
loadTileSet(assets.image`chunkset-room`, tileSet, 10, ChunkTypes.room)
loadTileSet(assets.image`chunkset-hallway`, tileSet, 10, ChunkTypes.hallway)
loadTileSet(assets.image`chunkset-broken`, tileSet, 1, ChunkTypes.broken)
tileSet = createTileRotations(tileSet)
tileSet.unshift(BlankTypeChunk)
const TileSetIndexes:number[] = []
for (let i = 1; i < tileSet.length - 1; i++) {
    TileSetIndexes.push(i)
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
