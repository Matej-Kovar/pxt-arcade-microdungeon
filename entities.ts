class Entity {
    relativePosition: Position;
    type:number
    constructor(position: Position, EntityType:number){
        this.relativePosition = position
        this.type = EntityType
    }
    pickUp() {
        switch (this.type) {
            case 0:
                TestingPlayer.health = TestingPlayer.maxhealth
                break;
            case 1:
                TestingPlayer.maxhealth = Math.ceil(TestingPlayer.maxhealth*1.2)
            break;
            case 2:
                TestingPlayer.attack = Math.ceil(TestingPlayer.attack*1.2)
                break;
            case 3:
                TestingPlayer.defense = Math.ceil(TestingPlayer.defense*1.2)
                break;
            default:
                break;
        }
    }
}
class Creature {
    absolutePosition: Position
    newPosition: Position = { x: 0, y: 0 }
    relativePos: Position;
    type: number
    target: Position
    path: Position[] = []
    sprite: Sprite
    maxhealth:number
    health: number
    attack: number
    defense: number
    active:boolean = false
    constructor(positionAbs:Position, creatureType:number, maxhlt:number, dfn:number, atk:number) {
        this.absolutePosition = positionAbs
        this.type = creatureType
        this.maxhealth = maxhlt
        this.health = maxhlt
        this.defense = dfn
        this.attack = atk
    }
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