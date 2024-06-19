type Item = {
    inChunkPosition: Position
    type:number
}
type Creature = {
    absolutePosition: Position
    secondaryPosition: Position
    type: number
    path: Position[]
    maxhealth:number
    health: number
    attack: number
    defense: number
}
enum EntityTypes {
    regen = 0,
    healthBoost = 1,
    damageBoost = 2,
    defenseBoost = 3,
    tile = 4,
    player = 5, 
    enemy = 6
}