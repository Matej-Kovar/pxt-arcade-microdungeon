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
                TestingPlayer.maxhealth = TestingPlayer.maxhealth*1.2
            break;
            case 2:
                TestingPlayer.attack = TestingPlayer.attack*1.2
                break;
            case 3:
                TestingPlayer.defense = TestingPlayer.defense*1.2
                break;
            default:
                break;
        }
    }
}
class Creature {
    absolutePosition: Position
    type: number
    target: Position
    path: Position[] = []
    sprite: Sprite
    maxhealth:number
    health: number
    attack: number
    defense: number
    active:boolean = false
    constructor(positionAbs:Position, creatureType:number) {
        this.absolutePosition = positionAbs
        this.type = creatureType
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