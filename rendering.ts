class TileData {
    costToTravel: number = Infinity;
    toEnd: number = 0;
    value: number = 0;
    state: number = 0;
    position: Position;
    sprite: Sprite;
    cameFrom:TileData = undefined
    constructor (pos:Position) {
        this.position = pos
    }
}
//inicializace gridů pro zobrazování políček
const displayGrid: TileData[][] = [];
const entityGrid: TileData[][] = [];
let globalSeed: number = Math.random() * 2 ** 32;
const renderFrame = (gridData: ChunkData[][]): void => {
    clearDisplayGrid(entityGrid)
    //Definuje absolutní pozici počítečního bodu pro vykreslení
    startingPoint.y = TestingPlayer.absolutePosition.y - Math.ceil(RenderDistance.height / 2)
    startingPoint.x = TestingPlayer.absolutePosition.x - Math.ceil(RenderDistance.width / 2)
    //vygeneruje mapu pokud hráč dorazil do cíle
    if (TestingPlayer.absolutePosition.x === ExitPointPosition.x * ChunkSize.width + 2 && TestingPlayer.absolutePosition.y === ExitPointPosition.y * ChunkSize.height + 2) {
        generateMap()
    }
    //zajišťuje aby kamera "nevyšla" mimo mapu (ve skutečnosti se kamera nepohubuje, jenom se mění textury)
    if (startingPoint.x <= 0) {
        TestingPlayerSprite.x = (TestingPlayer.absolutePosition.x + 0.5) * TileSize.width
        startingPoint.x = 0

    }
    if (startingPoint.y <= 0) {
        TestingPlayerSprite.y = (TestingPlayer.absolutePosition.y + 0.5) * TileSize.height
        startingPoint.y = 0

    }
    if (TestingPlayer.absolutePosition.x + Math.floor(RenderDistance.width / 2) >= LevelDimensions.width * ChunkSize.width) {
        startingPoint.x = (LevelDimensions.width * ChunkSize.width) - RenderDistance.width
        TestingPlayerSprite.x = (TestingPlayer.absolutePosition.x + 0.5 - startingPoint.x) * TileSize.width
    }
    if (TestingPlayer.absolutePosition.y + Math.floor(RenderDistance.height / 2) >= LevelDimensions.height * ChunkSize.height) {
        startingPoint.y = (LevelDimensions.height * ChunkSize.height) - RenderDistance.height
        TestingPlayerSprite.y = (TestingPlayer.absolutePosition.y + 0.5 - startingPoint.y) * TileSize.height
    }
    //vykreslení políček
    TestingPlayer.secondaryPosition = {x: TestingPlayer.absolutePosition.x - startingPoint.x, y: TestingPlayer.absolutePosition.y - startingPoint.y}
    for (let i = 0; i < RenderDistance.height; i++) {
        for (let j = 0; j < RenderDistance.width; j++) {
            const chunkPos = absoluteToChunks({ x: startingPoint.x + j, y: startingPoint.y + i })
            const TilePos = absoluteToTiles({ x: startingPoint.x + j, y: startingPoint.y + i })
            for (let m = 0; m < gridData[chunkPos.y][chunkPos.x].Entities.length; m++) {
                if (gridData[chunkPos.y][chunkPos.x].Entities[m].inChunkPosition.x === TilePos.x && gridData[chunkPos.y][chunkPos.x].Entities[m].inChunkPosition.y === TilePos.y) {
                    lookupTileData(gridData[chunkPos.y][chunkPos.x].Entities[m].type, entityGrid[i][j])
                }
            }
            const tileData = tileSet[gridData[chunkPos.y][chunkPos.x].chunkTypeOptions[0]].imgData[TilePos.y][TilePos.x];
            lookupTileData(tileData, displayGrid[i][j]);
        }
    }
    //detekce sebrání předmětu
    const playerChunk = absoluteToChunks(TestingPlayer.absolutePosition)
    const playerTile = absoluteToTiles(TestingPlayer.absolutePosition)
    if (entityGrid[TestingPlayer.secondaryPosition.y][TestingPlayer.secondaryPosition.x].sprite.kind() === SpriteKind.Item) {
        for (let i = 0; i < gridData[playerChunk.y][playerChunk.x].Entities.length; i++) {
            if (gridData[playerChunk.y][playerChunk.x].Entities[i].inChunkPosition.x === playerTile.x && gridData[playerChunk.y][playerChunk.x].Entities[i].inChunkPosition.y === playerTile.y) {
                music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.InBackground)
                pickUp(TestingPlayer, gridData[playerChunk.y][playerChunk.x].Entities[i].type)
                gridData[playerChunk.y][playerChunk.x].Entities.splice(i, 1)
            }
        }
    }
    //resetuje nepřátele
    resetEnemies()
    //pohyb nepřátel
    for (let i = 0; i < Enemies.length; i++) {
        const enemyPos = Enemies[i].absolutePosition
        const relativePos: Position = { x: enemyPos.x - startingPoint.x, y: enemyPos.y - startingPoint.y }
        const newRelativePos:Position = {x: Enemies[i].secondaryPosition.x - startingPoint.x, y: Enemies[i].secondaryPosition.y - startingPoint.y}
        if (relativePos.x >= 0 && relativePos.x < RenderDistance.width && relativePos.y >= 0 && relativePos.y < RenderDistance.height && newRelativePos.x >= 0 && newRelativePos.x < RenderDistance.width && newRelativePos.y >= 0 && newRelativePos.y < RenderDistance.height) {
            //detekce kolizí
            colisionEnemies(Enemies[i], enemyPos)
            //útok na hráče
            attackPlayer(Enemies[i])
            //vykreslení nepřátel
            lookupTileData(Enemies[i].type, entityGrid[enemyPos.y - startingPoint.y][enemyPos.x - startingPoint.x], Enemies[i].side)
            //hledání cesty, buď pokud cesta skončila, nebo je nepřítel blízko hráže
            if (getDistanceToEnd(enemyPos, TestingPlayer.absolutePosition) < ChunkSize.width || Enemies[i].path.length === 0) {
                Enemies[i].path = findPath(displayGrid[enemyPos.y-startingPoint.y][enemyPos.x - startingPoint.x], displayGrid[TestingPlayer.secondaryPosition.y][TestingPlayer.secondaryPosition.x], displayGrid)
            }
            //posunutí nepřítele na dál po cestě
            if (Enemies[i].path.length > 0) {
                setNextPosition(Enemies[i])
            }
        }
    }
    //vykreslení vlastností hráče
    playerHealth.setText(TestingPlayer.health.toString() + "/" + TestingPlayer.maxhealth.toString())
    playerAttack.setText(TestingPlayer.attack.toString())
    playerDefense.setText(TestingPlayer.defense.toString())
}
const initializeDisplayGrid = (grid: TileData[][]) => {
    for (let i = 0; i < RenderDistance.height; i++) {
        grid.push([])
        for (let j = 0; j < RenderDistance.width; j++) {
            grid[i][j] = new TileData({ y: i, x: j })
            grid[i][j].sprite = sprites.create(assets.image`void-tile`, SpriteKind.Tile)
            grid[i][j].sprite.setPosition((j * TileSize.width + 0.5 * TileSize.width), (i * TileSize.height + 0.5 * TileSize.height));
        }
    }
}  
const clearDisplayGrid = (grid: TileData[][]) => {
    for (let i = 0; i < RenderDistance.height; i++) {
        for (let j = 0; j < RenderDistance.width; j++) {
            grid[i][j].sprite.setImage(assets.image`void-tile`)
            entityGrid[i][j].sprite.setKind(SpriteKind.Tile)
        }
    }
}
const lookupTileData = (ID: number, tile:TileData, side?: number) => {
    switch (ID) {
        case 15:
            tile.sprite.setImage(assets.image`wall`)
            tile.sprite.setKind(SpriteKind.Wall)
            break;
        case 14: 
            tile.sprite.setImage(assets.image`floor`)
            tile.sprite.setKind(SpriteKind.Floor)
            break;
        case 13: 
            tile.sprite.setImage(assets.image`entry-point-tile`)
            tile.sprite.setKind(SpriteKind.EntryPoint)
            break;
        case 12:
            tile.sprite.setImage(assets.image`exit-point-tile`)
            tile.sprite.setKind(SpriteKind.ExitPoint)
            break;
        case 0:
            tile.sprite.setImage(assets.image`regen-potion`)
            tile.sprite.setKind(SpriteKind.Item)
            break;
        case 1:
            tile.sprite.setImage(assets.image`healthBoost-potion`)
            tile.sprite.setKind(SpriteKind.Item)
            break;
        case 2:
            tile.sprite.setImage(assets.image`attackBoost`)
            tile.sprite.setKind(SpriteKind.Item)
            break;
        case 3:
            tile.sprite.setImage(assets.image`defenseBoost`)
            tile.sprite.setKind(SpriteKind.Item)
            break;
        case 6:
            if (side === 0) {
                tile.sprite.setImage(assets.image`zombie-up`)
            }
            if (side === 1) {
                tile.sprite.setImage(assets.image`zombie-right`)
            }
            if (side === 2) {
                tile.sprite.setImage(assets.image`zombie-down`)
            }
            if (side === 3) {
                tile.sprite.setImage(assets.image`zombie-left`)
            }
            tile.sprite.setKind(SpriteKind.Enemy)
            break;
        default:
            tile.sprite.setImage(assets.image`closed`)
            tile.sprite.setKind(SpriteKind.Tile)
            break;
    }
}
const Attack = (def: number, atk: number) => {
    let damage:number = atk - def
    if (damage < 0) {
        damage = 0
    }
    return damage
}
const pickUp = (player:Creature, itemType:number) => {
    switch (itemType) {
        case 0:
            player.health = player.maxhealth
            break;
        case 1:
            player.maxhealth = Math.ceil(player.maxhealth*1.2)
        break;
        case 2:
            player.attack = Math.ceil(player.attack*1.2)
            break;
        case 3:
            player.defense = Math.ceil(player.defense*1.2)
            break;
        default:
            break;
    }
}
const generateMap = () => {
    music.play(music.melodyPlayable(music.beamUp), music.PlaybackMode.InBackground)
    level++;
    EntryPointPosition.x = Math.floor(Math.random() * (LevelDimensions.width - 1))
    EntryPointPosition.y = Math.floor(Math.random() * (LevelDimensions.height - 1))
    exitAndEntry()
    TestingPlayer.absolutePosition.x = EntryPointPosition.x * ChunkSize.width + 2
    TestingPlayer.absolutePosition.y = EntryPointPosition.y * ChunkSize.height + 2
    startingPoint.y = TestingPlayer.absolutePosition.y - Math.ceil(RenderDistance.height / 2)
    startingPoint.x = TestingPlayer.absolutePosition.x - Math.ceil(RenderDistance.width / 2)
    TestingPlayerSprite.x = (TestingPlayer.absolutePosition.x - startingPoint.x + 0.5) * TileSize.width
    TestingPlayerSprite.y = (TestingPlayer.absolutePosition.y - startingPoint.y + 0.5) * TileSize.height
    Enemies = []
    globalSeed = Math.random() * 2 ** 32
    resetChunkGrid(ChunkGrid, TileSetIndexes, LevelDimensions);
    generatePath(ChunkGrid)
    modifyDungeonBorder(ChunkGrid, voidTypeChunk, LevelDimensions);
    generateDungeonLevelRooms(ChunkGrid, LevelDimensions);
    dungeonLevel.setText(level.toString())
}
const resetEnemies = () => {
    for (let i = Enemies.length-1; i >= 0; i--) {
        const enemyPos = Enemies[i].absolutePosition
        if (Enemies[i].health <= 0) {
            Enemies.splice(i, 1)
        } else {
            if (enemyPos.x > startingPoint.x && enemyPos.x < startingPoint.x + RenderDistance.width && enemyPos.y > startingPoint.y && enemyPos.y < startingPoint.y + RenderDistance.height) { 
                entityGrid[enemyPos.y - startingPoint.y][enemyPos.x - startingPoint.x].sprite.setKind(SpriteKind.Enemy)
            }
        }
    }
}
const colisionEnemies = (Enemy: Creature, enemyPosition: Position) => {
    if (entityGrid[Enemy.secondaryPosition.y - startingPoint.y][Enemy.secondaryPosition.x - startingPoint.x].sprite.kind() !== SpriteKind.Enemy && !(Enemy.secondaryPosition.x === TestingPlayer.absolutePosition.x && Enemy.secondaryPosition.y === TestingPlayer.absolutePosition.y)) {
        entityGrid[enemyPosition.y - startingPoint.y][enemyPosition.x - startingPoint.x].sprite.setKind(SpriteKind.Tile)
        if (Enemy.secondaryPosition.x - enemyPosition.x > 0) {
            Enemy.side = Sides.right
        }
        if (Enemy.secondaryPosition.y - enemyPosition.y > 0) {
            Enemy.side = Sides.bottom
        }
        if (Enemy.secondaryPosition.x - enemyPosition.x < 0) {
            Enemy.side = Sides.left
        }
        if (Enemy.secondaryPosition.y - enemyPosition.y < 0) {
            Enemy.side = Sides.top
        }
        enemyPosition.x = Enemy.secondaryPosition.x
        enemyPosition.y = Enemy.secondaryPosition.y
    }
}
const attackPlayer = (Enemy:Creature) => {
    if (Enemy.secondaryPosition.x === TestingPlayer.absolutePosition.x && Enemy.secondaryPosition.y === TestingPlayer.absolutePosition.y) {
        TestingPlayer.health -= Attack(TestingPlayer.defense, Enemy.attack)
        if (TestingPlayer.health <= 0) {
            game.gameOver(false)
        }
    }
}
const setNextPosition = (Enemy:Creature) => {
    Enemy.secondaryPosition.x = Enemy.path[Enemy.path.length - 1].x
    Enemy.secondaryPosition.y = Enemy.path[Enemy.path.length - 1].y
    Enemy.path.splice(Enemy.path.length - 1, 1)
}